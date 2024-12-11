export type Instrument = 'fxMetronome1' | 'fxMetronome2' | 'fxMetronome3'

export interface Note {
  instrument: Instrument | null
}

export interface Beat {
  index: number
  isCounting: boolean
  isSubdivision: boolean
  isFirst: boolean
  isLast: boolean
}

export interface BeatInfo {
  barsPlayed: number
  isCounting: boolean
}

export type SoundMap = Record<Instrument, AudioBuffer>
