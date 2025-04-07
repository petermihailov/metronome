export const share = () => {
  const url = location.href

  return navigator.clipboard.writeText(url).then(() => 'link copied')
}
