type SharedReturnType = Promise<'copied' | 'shared'>;

export const share = (title = 'GrooveApp'): SharedReturnType => {
  const url = location.href;

  const fallback = (): SharedReturnType => navigator.clipboard.writeText(url).then(() => 'copied');

  if (navigator.share) {
    return navigator.share({ title, url }).then(() => 'shared');
  }

  return fallback();
};
