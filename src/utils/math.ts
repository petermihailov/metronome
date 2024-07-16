interface MinMaxOptions {
  min?: number;
  max?: number;
}
export const minMax = (value: number, { min = -1 * Infinity, max = Infinity }: MinMaxOptions) => {
  return Math.min(Math.max(Number(value), min), max);
};

export const percentOfRange = (value: number, min: number, max: number) => {
  const percent = 100 * (value / (max - min) - min / (max - min));
  return `${percent}%`;
};
