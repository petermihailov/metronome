import { produce } from 'immer';
import { create } from 'zustand';

import type { TrainingType } from '../components/Training/Training.types';
import { DEFAULTS } from '../constants';
import { Storage } from '../lib/LocalStorage';

const trainingStorage = new Storage<{
  alternate: boolean;
  from: number;
  to: number;
  every: number;
  type: TrainingType;
}>('settings', {
  alternate: false,
  from: 60,
  to: 100,
  every: 8,
  type: 'tempo',
});

const storage = trainingStorage.get()!;

interface Store {
  alternate: boolean;
  from: number;
  to: number;
  every: number;
  type: TrainingType;

  setAlternate: (value: boolean) => void;
  setFrom: (value: number) => void;
  setTo: (value: number) => void;
  setEvery: (value: number) => void;
  setType: (value: TrainingType) => void;
}

export const useTrainingStore = create<Store>((set) => {
  return {
    alternate: storage.alternate ?? false,
    from: storage.from ?? DEFAULTS.tempo,
    to: storage.to ?? DEFAULTS.tempo + 20,
    every: storage.every ?? DEFAULTS.every,
    type: storage.type ?? 'tempo',

    setAlternate: (alternate) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.alternate = alternate;
          trainingStorage.update({ alternate });
        });
      }),

    setFrom: (from) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.from = from;
          trainingStorage.update({ from });
        });
      }),

    setTo: (to) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.to = to;
          trainingStorage.update({ to });
        });
      }),

    setEvery: (every) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.every = every;
          trainingStorage.update({ every });
        });
      }),

    setType: (type) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.type = type;
          trainingStorage.update({ type });
        });
      }),
  };
});
