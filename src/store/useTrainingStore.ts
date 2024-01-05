import { produce } from 'immer';
import { create } from 'zustand';

import type { TrainingType } from '../components/Training/Training.types';
import { Storage } from '../lib/LocalStorage';
import { dateFormat } from '../utils/format';

const TIME_DEFAULT = { current: 0, session: 0, day: 0 };

const currentDate = dateFormat();
const trainingStorage = new Storage<{ [date: string]: number }>('training');
const storageValue = trainingStorage.get();

if (!storageValue) {
  trainingStorage.set({ [currentDate]: 0 });
} else {
  if (storageValue[currentDate]) {
    TIME_DEFAULT.day = storageValue[currentDate];
  }
}

type Seconds = number;

interface Store {
  alternate: boolean;
  from: number;
  to: number;
  every: number;
  type: TrainingType;

  time: {
    current: Seconds;
    session: Seconds;
    day: Seconds;
  };

  addSecond: () => void;
  resetCurrentTime: () => void;
  setAlternate: (value: boolean) => void;
  setFrom: (value: number) => void;
  setTo: (value: number) => void;
  setEvery: (value: number) => void;
  setType: (value: TrainingType) => void;
}

export const useTrainingStore = create<Store>((set) => {
  return {
    time: TIME_DEFAULT,
    alternate: false,
    from: 80,
    to: 240,
    every: 1,
    type: 'tempo',

    addSecond: () =>
      set((state) => {
        return produce(state, (draft) => {
          draft.time.current++;
          draft.time.session++;
          draft.time.day++;

          trainingStorage.update({ [currentDate]: draft.time.day });
        });
      }),

    resetCurrentTime: () =>
      set((state) => {
        return produce(state, (draft) => {
          draft.time.current = 0;
        });
      }),

    setAlternate: (value) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.alternate = value;
        });
      }),

    setFrom: (value) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.from = value;
        });
      }),

    setTo: (value) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.to = value;
        });
      }),

    setEvery: (value) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.every = value;
        });
      }),

    setType: (value) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.type = value;
        });
      }),
  };
});
