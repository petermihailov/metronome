export type SoundMap = Record<Instrument, AudioBuffer>

export type Instrument = 'fxMetronome1' | 'fxMetronome2' | 'fxMetronome3'

export interface Tick {
  note: Note | null
  counting: boolean
  position: NotePosition
  played: Played
  time: number
}

export interface Note {
  instrument: Instrument | null
}

export type Grid = Note[]

export interface NotePosition {
  idx: number // id ноты в массиве такта
  beat: number // какая доля (воровская?) такта
  subdivision: number // на каком месте в доле
  first: boolean // первая ли нота
  last: boolean // последняя ли нота
}

export interface Played {
  notes: number
  beats: number
  bars: number
}
