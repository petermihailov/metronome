import { createLogger } from './Logger'
import { TimeoutManager } from './TimeoutManager'
import { DEFAULTS } from '../constants'
import type { Instrument, SoundMap, Tick, Grid } from '../types/common'
import { getAudioContext } from '../utils/audio'

const logger = createLogger('PLAYER', { color: '#2af' })

const frameMs = 1000 / 60

const zeroScheduledCount = {
  notes: 0,
  beats: 0,
  bars: 0,
}

export class Player {
  private readonly audioCtx: AudioContext = getAudioContext()
  private readonly timeoutManager = new TimeoutManager()
  private playing: boolean = false
  private kit: SoundMap = {} as SoundMap
  private tempo: number = DEFAULTS.tempo
  private beats: number = DEFAULTS.beats
  private scheduledCount = { ...zeroScheduledCount }
  private grid: Grid = []
  private counting: number = 0
  private nextBeatAt: number = 0
  private scheduledTick: Tick | null = null
  private scheduledBufferSource: AudioBufferSourceNode | null = null
  private onTick?: (tick: Tick) => void
  private beforeTickScheduled?: (next: Tick, prev: Tick | null) => void

  private isSubdivisionNote(index: number): boolean {
    return !(index % (this.grid.length / this.beats) === 0)
  }

  private getTick(idx: number, time: number, isNext: boolean = false): Tick {
    const sub = this.grid.length / this.beats
    const note = this.grid[idx]

    const { notes, beats, bars } = this.scheduledCount
    const playedBars = bars - this.counting

    const played = {
      notes: notes + Number(isNext),
      beats: beats + Number(isNext && !this.isSubdivisionNote(idx)),
      bars: playedBars + Number(isNext && idx === 0),
    }

    const position = {
      idx: idx,
      beat: Math.floor(idx / sub) + 1,
      subdivision: (idx % sub) + 1,
      first: idx === 0,
      last: idx === this.grid.length - 1,
    }

    let counting = this.counting > 0 && bars < this.counting
    if (isNext && idx === 0 && playedBars === -1) {
      counting = false
    }

    return { counting, note, played, position, time }
  }

  private playNotesAtNextBeatTime(when: number, instrument: Instrument) {
    const gainNode = this.audioCtx.createGain()
    gainNode.gain.value = 1
    gainNode.connect(this.audioCtx.destination)

    const source = this.audioCtx.createBufferSource()
    source.buffer = this.kit[instrument]
    source.connect(gainNode)
    source.start(when)
    this.scheduledBufferSource = source

    source.onended = () => {
      source.disconnect()
      gainNode.disconnect()
    }
  }

  private schedule(idx: number) {
    this.nextBeatAt += 60 / ((this.tempo * this.grid.length) / this.beats)

    const nextIdx = (idx + 1) % this.grid.length
    const nextScheduledTick = this.getTick(nextIdx, this.nextBeatAt, true)
    this.beforeTickScheduled?.(nextScheduledTick, this.scheduledTick)

    // Schedule next
    const nextNote = this.grid[nextIdx]

    if (nextScheduledTick.counting || nextNote.instrument) {
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
      bars: this.scheduledCount.bars + Number(nextScheduledTick.position.first),
    }

    this.timeoutManager.set(
      () => {
        const outputLatency = this.audioCtx.outputLatency * 1000
        this.schedule(nextIdx)

        outputLatency < frameMs * 5
          ? this.onTick?.(nextScheduledTick)
          : this.timeoutManager.set(() => this.onTick?.(nextScheduledTick), outputLatency)
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

  public setBeats(beats: number) {
    logger.info('setBeats', beats)
    this.beats = beats
  }

  public setGrid(grid: Grid) {
    logger.info('setGrid', grid)
    this.grid = grid
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

  public async play() {
    if (this.playing) {
      return
    }

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume()
      logger.info('audioCtx.resume()')
    }

    logger.info('play')
    this.playing = true
    this.nextBeatAt = this.audioCtx.currentTime + 0.05
    const tick = this.getTick(0, this.nextBeatAt)

    if (this.grid[0]) {
      const instrument = tick.counting ? 'fxMetronome1' : this.grid[0].instrument
      if (instrument) {
        this.playNotesAtNextBeatTime(this.nextBeatAt, instrument)
      }
      this.onTick?.(tick)
    }

    this.schedule(0)
  }

  public stop() {
    logger.info('stop')
    this.playing = false
    this.timeoutManager.clearAll()
    this.scheduledTick = null
    this.scheduledCount = { ...zeroScheduledCount }
    this.scheduledBufferSource?.stop()
    this.scheduledBufferSource = null
  }
}
