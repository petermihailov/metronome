export type Instrument = 'fxMetronome1' | 'fxMetronome2' | 'fxMetronome3'

export interface Note {
  instrument: Instrument | null
}

export interface Beat {
  index: number
  note: Note
}

export type SoundMap = Record<Instrument, AudioBuffer>
