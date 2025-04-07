import { DEFAULTS } from '../constants'
import type { Instrument, SoundMap, Tick, Grid } from '../types/common'
import { getAudioContext } from '../utils/audio'

const zeroScheduledCount = {
  notes: 0,
  beats: 0,
  bars: 0,
}

export class Player {
  private readonly audioCtx: AudioContext = getAudioContext()
  private playing: boolean = false
  private kit: SoundMap = {} as SoundMap
  private tempo: number = DEFAULTS.tempo
  private beats: number = DEFAULTS.beats
  private scheduledCount = { ...zeroScheduledCount }
  private grid: Grid = []
  private counting: number = 0
  private nextBeatAt: number = 0
  private timeoutId?: number
  private scheduledTick: Tick | null = null
  private scheduledBufferSource: AudioBufferSourceNode | null = null
  private onTick?: (tick: Tick) => void
  private beforeTickScheduled?: (next: Tick, prev: Tick | null) => void

  private isSubdivisionNote(index: number): boolean {
    return !(index % (this.grid.length / this.beats) === 0)
  }

  private getTick(idx: number, isNext: boolean = false): Tick {
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

    return { counting, note, played, position }
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
    const nextIdx = (idx + 1) % this.grid.length
    const nextScheduledTick = this.getTick(nextIdx, true)
    this.beforeTickScheduled?.(nextScheduledTick, this.scheduledTick)

    // Schedule next
    this.nextBeatAt += 60 / ((this.tempo * this.grid.length) / this.beats)
    const nextNote = this.grid[nextIdx]

    if (nextScheduledTick.counting || nextNote.instrument) {
      if (nextScheduledTick.counting) {
        if (!this.isSubdivisionNote(nextIdx)) {
          this.playNotesAtNextBeatTime(this.nextBeatAt, 'fxMetronome1')
        }
      } else if (nextNote.instrument) {
        this.playNotesAtNextBeatTime(this.nextBeatAt, nextNote.instrument)
      }

      this.scheduledTick = nextScheduledTick
    }

    this.scheduledCount = {
      notes: this.scheduledCount.notes + 1,
      beats: !this.isSubdivisionNote(nextScheduledTick.position.idx)
        ? this.scheduledCount.beats + 1
        : this.scheduledCount.beats,
      bars: this.scheduledCount.bars + Number(nextScheduledTick.position.first),
    }

    this.timeoutId = window.setTimeout(
      () => {
        this.onTick?.(nextScheduledTick)
        this.schedule(nextIdx)
      },
      (this.nextBeatAt - this.audioCtx.currentTime) * 1000,
    )
  }

  public setKit(kit: SoundMap) {
    this.kit = kit
  }

  public setTempo(bpm: number) {
    this.tempo = bpm
  }

  public setBeats(value: number) {
    this.beats = value
  }

  public setGrid(grid: Grid) {
    this.grid = grid
  }

  public setOnTick(onTick: (tick: Tick) => void) {
    this.onTick = onTick
  }

  public setBeforeTickScheduled(beforeTickScheduled: (tick: Tick) => void) {
    this.beforeTickScheduled = beforeTickScheduled
  }

  public setCounting(count: number) {
    this.counting = count
  }

  public play() {
    if (this.playing) {
      return
    }

    this.playing = true
    this.nextBeatAt = this.audioCtx.currentTime
    const tick = this.getTick(0)

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
    this.playing = false
    window.clearTimeout(this.timeoutId)
    this.scheduledCount = { ...zeroScheduledCount }
    this.scheduledBufferSource?.stop()
    this.scheduledBufferSource = null
  }
}
