import type { Beat, Instrument } from './types/common';
import { minMax } from './utils/math';

export const INSTRUMENTS: Instrument[] = ['fxMetronome1', 'fxMetronome2', 'fxMetronome3'];

export const BEAT_DEFAULT: Beat = {
  index: 0,
  note: { instrument: 'fxMetronome1' },
};

export const MINMAX = (() => {
  const ranges = {
    tempo: { min: 20, max: 300 },
    beats: { min: 1, max: 16 },
    every: { min: 1, max: 16 },
    subdivision: { min: 1, max: 16 },
    inputLag: { min: 50, max: 250 },
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
  beats: 4,
  noteValue: 4,
  subdivision: 1,
  every: 8,
  volume: 1,
  mute: false,
  inputLag: 150,
  inputLagEnabled: false,
  isTraining: false,
} as const;
