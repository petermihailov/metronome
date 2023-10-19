import type { TrainingType } from './Training.types';

interface RangeGeneratorOptions {
  from: number;
  to: number;
  step?: number;
}

export function* rangeGenerator({ from, to, step = 1 }: RangeGeneratorOptions) {
  let iter = 0;

  while (Math.abs(iter) < Math.abs(Math.ceil((to - from) / step))) {
    iter = iter + (from > to ? -1 : 1);
    yield from + iter * step;
  }
}

interface CalculateTimeOptions {
  key: TrainingType;
  tempo: number;
  beats: number;
  every: number;
  from: number;
  to: number;
}

export const calculateTime = ({ key, from, to, every, tempo, beats }: CalculateTimeOptions) => {
  const map = { tempo, beats, subdivision: 1 };

  if (from > to) [from, to] = [to, from];

  return Math.floor(
    [from, ...rangeGenerator({ from, to })].reduce((elapsed, value) => {
      map[key] = value;
      elapsed += (60 / tempo) * beats * every;
      return elapsed;
    }, 0),
  );
};
