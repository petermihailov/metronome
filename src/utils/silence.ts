// Такт (0-based, после отсчёта) тихий, если он попадает в последние `mute` тактов цикла из `play + mute`.
// Во время отсчёта `barIndex` отрицательный — его не глушим.
export const isMutedBar = (barIndex: number, play: number, mute: number) =>
  barIndex >= 0 && mute > 0 && barIndex % (play + mute) >= play
