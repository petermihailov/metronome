import { produce } from 'immer';
import { create } from 'zustand';

import { DEFAULTS, MINMAX } from '../constants';
import type { Instrument, Note } from '../types/common';

interface Store {
  // Values
  tempo: number;
  notes: Note[];
  subdivision: number;
  beats: number;
  title: string;
  isPlaying: boolean;
  isTraining: boolean;

  // Actions
  setBeatsAction: (beats: number) => void;
  setIsPlayingAction: (isPlaying: boolean) => void;
  setIsTrainingAction: (isTraining: boolean) => void;
  setSubdivisionAction: (subdivision: number) => void;
  setTempoAction: (tempo: number) => void;
  setTitleAction: (title: string) => void;
  switchInstrumentAction: (noteIndex: number) => void;
}

export const useMetronomeStore = create<Store>((set) => {
  // const action = <T>(args:T, setter: (draft: Store) => Store) => () => set((state) => produce(state, setter))

  return {
    title: '',
    tempo: DEFAULTS.tempo,
    beats: DEFAULTS.beats,
    noteValue: DEFAULTS.noteValue,
    subdivision: DEFAULTS.subdivision,
    isPlaying: false,
    isTraining: false,
    notes: [{ instrument: 'fxMetronome1' }, { instrument: 'fxMetronome3' }],

    setBeatsAction: (beats) =>
      set((state) => {
        return produce(state, (draft) => {
          beats = MINMAX.range('beats', beats);
          const notes: Note[] = Array(beats * state.subdivision);

          draft.beats = beats;
          draft.notes = gridAlignment(notes, beats, state.subdivision);
        });
      }),

    setIsPlayingAction: (isPlaying) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.isPlaying = isPlaying;
        });
      }),

    setIsTrainingAction: (isTraining) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.isTraining = isTraining;
        });
      }),

    setSubdivisionAction: (subdivision) =>
      set((state) => {
        return produce(state, (draft) => {
          subdivision = MINMAX.range('subdivision', subdivision);
          const notes: Note[] = Array(state.beats * subdivision);

          draft.subdivision = subdivision;
          draft.notes = gridAlignment(notes, state.beats, subdivision);
        });
      }),

    setTempoAction: (tempo) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.tempo = MINMAX.range('tempo', tempo);
        });
      }),

    setTitleAction: (title) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.title = title;
        });
      }),

    switchInstrumentAction: (noteIndex: number) =>
      set((state) => {
        return produce(state, (draft) => {
          const order: Array<Instrument | null> = [
            null,
            'fxMetronome3',
            'fxMetronome2',
            'fxMetronome1',
          ];

          const next = order.indexOf(draft.notes[noteIndex].instrument) + 1;
          draft.notes[noteIndex].instrument = order[next % order.length];
        });
      }),
  };
});

// Utils
function gridAlignment(notes: Note[], beats: number, subdivision: number) {
  const res: Note[] = [];

  for (let i = 0; i < notes.length; i++) {
    const isBeat = i % (notes.length / beats) === 0;

    res[i] = {
      instrument: isBeat && subdivision !== 1 ? 'fxMetronome2' : 'fxMetronome3',
    };

    if (i === 0) res[i].instrument = 'fxMetronome1';
  }

  return res;
}
