import { DEFAULTS } from '../constants'
import type { Instrument, SoundMap, Beat, Note } from '../types/common'
import { getAudioContext, getOutputLatency } from '../utils/audio'

export class Player {
  private readonly audioCtx: AudioContext
  private kit: SoundMap
  private tempo: number
  private beats: number
  private volume: number
  private nextBeatAt: number
  private onBeat?: (beat: Beat) => void
  private openBuffers: AudioBufferSourceNode[]
  private timeoutId: number | undefined
  private notes: Note[]
  private counting: boolean
  private outputLatency: number

  private isSubdivisionNote(index: number): boolean {
    return !(index % (this.notes.length / this.beats) === 0)
  }

  constructor() {
    this.kit = {} as SoundMap
    this.tempo = DEFAULTS.tempo
    this.beats = DEFAULTS.beats
    this.notes = []
    this.volume = DEFAULTS.volume
    this.nextBeatAt = 0
    this.audioCtx = getAudioContext()
    this.openBuffers = []
    this.counting = false
    this.outputLatency = 0
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

  public setNotes(notes: Note[]) {
    this.notes = notes
  }

  public setVolume(volume: number) {
    this.volume = volume
  }

  public setOnBeat(onBeat: (beat: Beat) => void) {
    this.onBeat = onBeat
  }

  public setIsCounting(isCounting: boolean) {
    this.counting = isCounting
  }

  public play() {
    this.outputLatency = getOutputLatency()
    this.nextBeatAt = this.audioCtx.currentTime

    if (this.notes[0]) {
      if (this.notes[0]?.instrument) {
        this.playNotesAtNextBeatTime(this.nextBeatAt, this.notes[0]?.instrument)
      }
      this.timeoutId = window.setTimeout(() => {
        this.onBeat?.({
          index: 0,
          isCounting: this.counting,
          isFirst: true,
          isLast: 0 === this.notes.length - 1,
          isSubdivision: false,
        })
      }, this.outputLatency)
    }

    this.schedule(0)
  }

  public stop() {
    window.clearTimeout(this.timeoutId)
    this.openBuffers.forEach((buffer) => buffer.stop())
    this.openBuffers = []
  }

  private playNotesAtNextBeatTime(time: number, instrument: Instrument) {
    const gainNode = this.audioCtx.createGain()
    gainNode.gain.value = this.volume
    gainNode.connect(this.audioCtx.destination)

    const source = this.audioCtx.createBufferSource()
    source.buffer = this.kit[instrument]
    source.connect(gainNode)
    source.start(time)

    this.openBuffers.push(source)
  }

  schedule(index: number) {
    // Schedule next
    this.nextBeatAt += 60 / ((this.tempo * this.notes.length) / this.beats)
    const nextIndex = (index + 1) % this.notes.length
    const nextNote = this.notes[nextIndex]
    const nextIsSubdivision = this.isSubdivisionNote(nextIndex)

    // Schedule next beat
    if (nextNote?.instrument && (!this.counting || !nextIsSubdivision)) {
      const nextInstrument = this.counting ? 'fxMetronome1' : nextNote.instrument
      this.playNotesAtNextBeatTime(this.nextBeatAt, nextInstrument)
    }

    this.timeoutId = window.setTimeout(
      () => {
        if (nextNote) {
          this.onBeat?.({
            index: nextIndex,
            isCounting: this.counting,
            isFirst: nextIndex === 0,
            isLast: nextIndex === this.notes.length - 1,
            isSubdivision: nextIsSubdivision,
          })
        }

        this.schedule(nextIndex)
      },
      (this.nextBeatAt - this.audioCtx.currentTime + this.outputLatency) * 1000,
    )
  }
}
