interface MinMaxOptions {
  min?: number
  max?: number
}
export const minMax = (value: number, { min = -1 * Infinity, max = Infinity }: MinMaxOptions) => {
  return Math.min(Math.max(Number(value), min), max)
}

export const inRange = (value: number, { min = -1 * Infinity, max = Infinity }: MinMaxOptions) => {
  return !Number.isNaN(value) && value >= min && value <= max
}

export const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const percentOfRange = (
  value: number,
  { min = -1 * Infinity, max = Infinity }: MinMaxOptions,
) => {
  const percent = 100 * (value / (max - min) - min / (max - min))
  return `${percent}%`
}
