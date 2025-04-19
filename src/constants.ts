import type { Instrument, Grid } from './types/metronome'
import { minMax } from './utils/math'

export const INSTRUMENTS: Instrument[] = ['fxMetronome1', 'fxMetronome2', 'fxMetronome3']

export const MINMAX = (() => {
  const ranges = {
    tempo: { min: 20, max: 300 },
    beats: { min: 1, max: 16 },
    every: { min: 1, max: 16 },
    step: { min: 1, max: 100 },
    subdivision: { min: 1, max: 16 },
  } as const

  return {
    ...ranges,
    range(key: keyof typeof ranges, value: number) {
      const { min, max } = MINMAX[key]
      return minMax(value, { min, max })
    },
  }
})()

export const DEFAULTS = {
  tempo: 60,
  beats: 4,
  subdivision: 1,
  every: 8,
  step: 1,
  count: 2,
  get grid(): Grid {
    return [
      { instrument: 'fxMetronome1' },
      { instrument: 'fxMetronome3' },
      { instrument: 'fxMetronome3' },
      { instrument: 'fxMetronome3' },
    ]
  },
} as const

export const THEME_DEFAULTS = {
  accent1: '185 100% 50%',
  accent2: '333 100% 50%',
  background: '240 0% 0%',
  backgroundApp: '240 15 15%',
  border: '240 15% 50%',
  text: '0 100% 100%',
}
