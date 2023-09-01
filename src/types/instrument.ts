export type Instrument = 'fxMetronome1' | 'fxMetronome2' | 'fxMetronome3';

export type DrumKit = Record<Instrument, AudioBuffer>;

// export type TimeDivision = 4 | 8 | 16 | 32;
//
// export interface TimeSignature {
//   beatsPerBar: number;
//   noteValue: number;
// }

export interface Groove {
  tempo: number;
  notes: Note[];
  subdivision: number;
  // 2/4 = beatsPerBar/noteValue
  beatsPerBar: number;
  noteValue: number;
}

export interface Note {
  instrument: Instrument | null;
}

export interface Beat {
  index: number;
  note: Note;
}
