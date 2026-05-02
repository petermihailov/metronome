interface RangeGeneratorOptions {
  from: number
  to: number
  step?: number
}

export function* rangeGenerator({ from, to, step = 1 }: RangeGeneratorOptions) {
  let iter = 0
  const min = from < to ? from : to
  const max = from > to ? from : to

  // Используем floor, чтобы не перешагнуть `to`, когда (to - from) не делится нацело на step
  while (Math.abs(iter) < Math.abs(Math.floor((max - min) / step))) {
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

export const calculateTime = ({ from, to, every, beats, step }: CalculateTimeOptions) => {
  if (from > to) [from, to] = [to, from]

  // На каждом темпе из последовательности играется `every` тактов по `beats` долей.
  // Длительность одной доли = 60 / current (секунд). Темп меняется на каждом блоке.
  return Math.floor(
    [from, ...rangeGenerator({ from, to, step })].reduce(
      (elapsed, current) => elapsed + (60 / current) * beats * every,
      0,
    ),
  )
}
