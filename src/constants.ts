import type { Beat, Instrument } from './types/common';
import { minMax } from './utils/math';

export const INSTRUMENTS: Instrument[] = ['fxMetronome1', 'fxMetronome2', 'fxMetronome3'];

export const BEAT_DEFAULT: Beat = {
  index: 0,
  note: { instrument: 'fxMetronome1' },
};

export const MINMAX = (() => {
  const ranges = {
    tempo: { min: 20, max: 240 },
    beats: { min: 1, max: 16 },
    subdivision: { min: 1, max: 16 },
  } as const;

  return {
    ...ranges,
    range(key: keyof typeof ranges, value: number) {
      const { min, max } = MINMAX[key];
      return minMax(value, { min, max });
    },
  };
})();

export const DEFAULTS = {
  tempo: 60,
  beats: 2,
  noteValue: 4,
  subdivision: 1,
};
