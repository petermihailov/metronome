import type { TrainingType } from './Training.types'

interface RangeGeneratorOptions {
  from: number
  to: number
  step?: number
}

export function* rangeGenerator({ from, to, step = 1 }: RangeGeneratorOptions) {
  let iter = 0
  const min = from < to ? from : to
  const max = from > to ? from : to

  while (Math.abs(iter) < Math.abs(Math.ceil((max - min) / step))) {
    iter = iter + (from > to ? -1 : 1)
    yield from + iter * step
  }
}

interface CalculateTimeOptions {
  key: TrainingType
  tempo: number
  beats: number
  every: number
  from: number
  to: number
  step: number
}

export const calculateTime = ({
  key,
  from,
  to,
  every,
  tempo,
  beats,
  step,
}: CalculateTimeOptions) => {
  const values = { tempo, beats, subdivision: 1 }

  if (from > to) [from, to] = [to, from]

  return Math.floor(
    [from, ...rangeGenerator({ from, to, step })].reduce((elapsed, current) => {
      values[key] = current
      elapsed += (60 / values.tempo) * values.beats * every
      return elapsed
    }, 0),
  )
}
