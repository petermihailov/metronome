import { createLogger } from './Logger'
import { TimeoutManager } from './TimeoutManager'
import { DEFAULTS, INSTRUMENTS } from '../constants'
import type { Instrument, SoundMap, Tick, Bar } from '../types/metronome'
import { getAudioContext, isAudioWarmingUp, resumeAudioContext } from '../utils/audio'
import { getBarMap, noteDuration } from '../utils/barLayout'
import type { BarMap } from '../utils/barLayout'
import { isMutedBar } from '../utils/silence'

const logger = createLogger('PLAYER', { color: '#2af' })

const frameMs = 1000 / 60

// Запас между стартом и первой нотой: обычный и пока контекст «холодный» после пробуждения.
// Устройство вывода (особенно Bluetooth) открывается ещё 100–500 мс после перехода в running,
// и звук, попавший в это окно, теряется
const leadSec = 0.05
const wakeLeadSec = 0.2

const zeroScheduledCount = {
  notes: 0,
  beats: 0,
  bars: 0,
}

export class Player {
  private readonly audioCtx: AudioContext = getAudioContext()
  private readonly timeoutManager = new TimeoutManager()
  private playing: boolean = false
  // Растёт на каждый play() и stop(): так play() понимает, что пока он ждал resume(), нажали stop
  private startId: number = 0
  private kit: SoundMap = {} as SoundMap
  private tempo: number = DEFAULTS.tempo
  private subdivisions: number[] = Array(DEFAULTS.beats).fill(DEFAULTS.subdivision)
  private barMap: BarMap = getBarMap(this.subdivisions)
  private scheduledCount = { ...zeroScheduledCount }
  private bar: Bar = []
  private counting: number = 0
  // N тактов играем, M молчим; null — режим тишины выключен
  private silence: { play: number; mute: number } | null = null
  private nextBeatAt: number = 0
  private scheduledTick: Tick | null = null
  private scheduledBufferSource: AudioBufferSourceNode | null = null
  private onTick?: (tick: Tick) => void
  private beforeTickScheduled?: (next: Tick, prev: Tick | null) => void

  // Нота не первая в своей доле
  private isSubdivisionNote(index: number): boolean {
    const { beatOf, beatStart } = this.barMap
    return index !== beatStart[beatOf[index]]
  }

  // Сколько нот в доле, которой принадлежит нота с индексом idx.
  // Запасное значение нужно на случай, если раскладка сменилась на лету и idx вышел за такт.
  private getSubdivision(idx: number): number {
    return this.subdivisions[this.barMap.beatOf[idx]] ?? 1
  }

  private getTick(idx: number, time: number, isNext: boolean = false): Tick {
    const { beatOf, beatStart } = this.barMap
    const note = this.bar[idx]

    const { notes, beats, bars } = this.scheduledCount
    const playedBars = bars - this.counting

    const played = {
      notes: notes + Number(isNext),
      beats: beats + Number(isNext && !this.isSubdivisionNote(idx)),
      bars: playedBars + Number(isNext && idx === 0),
    }

    const position = {
      idx: idx,
      beat: beatOf[idx] + 1,
      subdivision: idx - beatStart[beatOf[idx]] + 1,
      downbeat: idx === 0,
      last: idx === this.bar.length - 1,
    }

    let counting = this.counting > 0 && bars < this.counting
    if (isNext && idx === 0 && playedBars === -1) {
      counting = false
    }

    const muted =
      !counting && !!this.silence && isMutedBar(played.bars, this.silence.play, this.silence.mute)

    return { counting, muted, note, played, position, time }
  }

  // Кит грузится целиком, поэтому проверяем все инструменты разом
  private hasKit(): boolean {
    return INSTRUMENTS.every((instrument) => !!this.kit[instrument])
  }

  // outputLatency есть не везде (Safari только с 18.4), без него считаем задержку нулевой
  private getOutputLatency(): number {
    const { outputLatency } = this.audioCtx
    return Number.isFinite(outputLatency) ? outputLatency : 0
  }

  // Визуальный тик отдаём в момент звука: если задержка вывода заметна (от пяти кадров),
  // откладываем его на эту задержку
  private emitTick(tick: Tick) {
    const outputLatency = this.getOutputLatency() * 1000

    if (outputLatency < frameMs * 5) {
      this.onTick?.(tick)
    } else {
      this.timeoutManager.set(() => this.onTick?.(tick), outputLatency)
    }
  }

  private playNotesAtNextBeatTime(when: number, instrument: Instrument) {
    const buffer = this.kit[instrument]

    if (!buffer) {
      logger.warn('playNotesAtNextBeatTime: звук ещё не загружен, пропускаем', instrument)
      return
    }

    const gainNode = this.audioCtx.createGain()
    gainNode.gain.value = 1
    gainNode.connect(this.audioCtx.destination)

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(gainNode)
    source.start(when)
    this.scheduledBufferSource = source

    source.onended = () => {
      source.disconnect()
      gainNode.disconnect()
    }
  }

  private schedule(idx: number) {
    // Интервал до следующей ноты — это длительность текущей ноты idx
    this.nextBeatAt += noteDuration(this.tempo, this.getSubdivision(idx))

    const nextIdx = (idx + 1) % this.bar.length
    const nextScheduledTick = this.getTick(nextIdx, this.nextBeatAt, true)
    this.beforeTickScheduled?.(nextScheduledTick, this.scheduledTick)

    // Schedule next
    const nextNote = this.bar[nextIdx]

    if (nextScheduledTick.counting || (nextNote.instrument && !nextScheduledTick.muted)) {
      if (nextScheduledTick.counting) {
        if (!this.isSubdivisionNote(nextIdx)) {
          this.playNotesAtNextBeatTime(this.nextBeatAt, 'fxMetronome1')
        }
      } else if (nextNote.instrument) {
        this.playNotesAtNextBeatTime(this.nextBeatAt, nextNote.instrument)
      }
    }

    this.scheduledTick = nextScheduledTick

    this.scheduledCount = {
      notes: this.scheduledCount.notes + 1,
      beats: !this.isSubdivisionNote(nextScheduledTick.position.idx)
        ? this.scheduledCount.beats + 1
        : this.scheduledCount.beats,
      bars: this.scheduledCount.bars + Number(nextScheduledTick.position.downbeat),
    }

    this.timeoutManager.set(
      () => {
        this.schedule(nextIdx)
        this.emitTick(nextScheduledTick)
      },
      (this.nextBeatAt - this.audioCtx.currentTime) * 1000,
    )
  }

  public setKit(kit: SoundMap) {
    logger.info('setKit', kit)
    this.kit = kit
  }

  public setTempo(bpm: number) {
    logger.info('setTempo', bpm)
    this.tempo = bpm
  }

  // Раскладка и такт меняются только вместе: bar.length обязан равняться сумме subdivisions
  public setLayout(subdivisions: number[], bar: Bar) {
    const total = subdivisions.reduce((sum, sub) => sum + sub, 0)

    if (bar.length !== total) {
      logger.warn('setLayout: bar не сходится с subdivisions, пропускаем', { subdivisions, bar })
      return
    }

    logger.info('setLayout', { subdivisions, bar })
    this.subdivisions = subdivisions
    this.barMap = getBarMap(subdivisions)
    this.bar = bar
  }

  public setOnTick(onTick: (tick: Tick) => void) {
    this.onTick = (tick) => {
      logger.info('onTick', tick)
      onTick(tick)
    }
  }

  public setBeforeTickScheduled(beforeTickScheduled: (tick: Tick) => void) {
    this.beforeTickScheduled = beforeTickScheduled
  }

  public setCounting(count: number) {
    logger.info('setCounting', count)
    this.counting = count
  }

  public setSilence(silence: { play: number; mute: number } | null) {
    logger.info('setSilence', silence)
    this.silence = silence
  }

  public async play() {
    if (this.playing) {
      return
    }

    // Без кита стартовать нечем: usePlayer позовёт play() ещё раз, когда звуки загрузятся
    if (!this.hasKit()) {
      logger.warn('play: звуки ещё не загружены, ждём setKit')
      return
    }

    const startId = ++this.startId

    try {
      await resumeAudioContext()
    } catch (e) {
      // Старт уже отменили через stop() — ошибка никому не нужна
      if (startId !== this.startId) return
      throw e
    }

    // Пока ждали пробуждения контекста, нажали stop
    if (startId !== this.startId) {
      logger.info('play: отменён во время resume()')
      return
    }

    // Контекст проснулся только что (этим play(), жестом из useAudioUnlock или предыдущим
    // play→stop→play) — устройство вывода ещё открывается, даём первой ноте больше запаса
    const lead = isAudioWarmingUp()
      ? Math.max(wakeLeadSec, this.getOutputLatency() + leadSec)
      : leadSec

    logger.info('play', { lead })
    this.playing = true
    this.nextBeatAt = this.audioCtx.currentTime + lead
    const tick = this.getTick(0, this.nextBeatAt)

    if (this.bar[0]) {
      const instrument = tick.counting ? 'fxMetronome1' : this.bar[0].instrument
      if (instrument && !tick.muted) {
        this.playNotesAtNextBeatTime(this.nextBeatAt, instrument)
      }
      // Тик — в момент звука, а не нажатия; stop() до него снимет таймер через clearAll
      this.timeoutManager.set(() => this.emitTick(tick), lead * 1000)
    }

    this.schedule(0)
  }

  public stop() {
    logger.info('stop')
    this.startId++
    this.playing = false
    this.timeoutManager.clearAll()
    this.scheduledTick = null
    this.scheduledCount = { ...zeroScheduledCount }
    this.scheduledBufferSource?.stop()
    this.scheduledBufferSource = null
  }
}
