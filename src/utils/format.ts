export const lead0 = (n: number) => ('0' + n).slice(-2)

export const timeFormat = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60)
  const seconds = totalSeconds - hours * 3600 - minutes * 60

  const ss = lead0(seconds)
  const mm = lead0(minutes)

  // Без пробелов вокруг двоеточия: в сегментном шрифте DSEG7 нет узкого неразрывного пробела (U+202F),
  // и iOS подставляет для него системный шрифт с широким пробелом
  return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
}

export const dateFormat = (date = new Date()) => {
  const d = date.getDate()
  const mm = lead0(date.getMonth() + 1)
  const yyyy = date.getFullYear()

  return `${d}.${mm}.${yyyy}`
}
