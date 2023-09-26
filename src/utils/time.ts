export const timeFormat = (seconds: number) => {
  const lead0 = (n: number) => [0, ...String(n)].join('').slice(-2);

  const ss = lead0(seconds % 60);
  const mm = lead0(seconds >= 60 ? Math.floor(seconds / 60) % 60 : 0);
  const hh = lead0(seconds >= 24 * 60 ? Math.floor((seconds / 24) * 60) % 24 : 0);

  return hh === '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
};
