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
  tempo: number
  beats: number
  every: number
  from: number
  to: number
  step: number
}

export const calculateTime = ({ from, to, every, tempo, beats, step }: CalculateTimeOptions) => {
  let value = tempo

  if (from > to) [from, to] = [to, from]

  return Math.floor(
    [from, ...rangeGenerator({ from, to, step })].reduce((elapsed, current) => {
      value = current
      elapsed += (60 / value) * beats * every
      return elapsed
    }, 0),
  )
}
