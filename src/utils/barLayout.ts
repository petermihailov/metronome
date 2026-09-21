import { DEFAULTS, MINMAX } from '../constants'
import { inRange } from './math'
import type { Bar, Instrument } from '../types/metronome'

// Раскладка такта: subdivisions[i] — сколько нот в доле i.
// Плоский bar устроен так: ноты первой доли, потом второй и т.д.

export interface Layout {
  subdivisions: number[]
  bar: Bar
}

export interface BarMap {
  // Номер доли (с нуля) для каждой ноты такта
  beatOf: number[]
  // Индекс первой ноты каждой доли
  beatStart: number[]
}

export const getBarMap = (subdivisions: number[]): BarMap => {
  const beatOf: number[] = []
  const beatStart: number[] = []

  subdivisions.forEach((sub, beat) => {
    beatStart.push(beatOf.length)
    for (let i = 0; i < sub; i++) {
      beatOf.push(beat)
    }
  })

  return { beatOf, beatStart }
}

// Сколько всего нот в такте
export const totalNotes = (subdivisions: number[]) => {
  return subdivisions.reduce((sum, sub) => sum + sub, 0)
}

// Число долей и subdivision каждой доли лежат в допустимых диапазонах
export const isValidSubdivisions = (value: unknown): value is number[] => {
  return (
    Array.isArray(value) &&
    inRange(value.length, MINMAX.beats) &&
    value.every((sub) => Number.isInteger(sub) && inRange(sub, MINMAX.subdivision))
  )
}

// Доля — tuplet, если нот в ней больше одной и их число не степень двойки
// (3 — триоль, 5 — квинтоль, 6 — секстоль, 7 — септоль и т.д.)
export const isTuplet = (subdivision: number) => {
  return subdivision > 1 && (subdivision & (subdivision - 1)) !== 0
}

const TUPLET_NAMES: Record<number, string> = {
  3: 'triplet',
  5: 'quintuplet',
  6: 'sextuplet',
  7: 'septuplet',
  9: 'nonuplet',
  10: 'decuplet',
}

export const tupletName = (subdivision: number) => {
  return TUPLET_NAMES[subdivision] ?? `${subdivision}-tuplet`
}

export const uniformSubdivisions = (beats: number, subdivision: number) => {
  return Array<number>(beats).fill(subdivision)
}

// Длительность одной ноты в секундах. Доля всегда длится 60 / tempo,
// поэтому чем больше нот в доле, тем короче каждая из них.
export const noteDuration = (tempo: number, subdivision: number) => {
  return 60 / (tempo * subdivision)
}

// Шаблон такта по умолчанию — он НЕ пишется в query-string, поэтому
// считается замороженной частью формата ссылок: правка правила изменит
// звучание уже расшаренных коротких ссылок.
//   первая нота такта — 1 (сильная),
//   начало остальных долей — 2, если в доле больше одной ноты, иначе 3,
//   остальные ноты (пульсация) — 3.
export const defaultBar = (subdivisions: number[]): Bar => {
  return subdivisions.flatMap((sub, beat) => {
    return Array.from({ length: sub }, (_, idx): { instrument: Instrument } => {
      const isBeatStart = idx === 0

      if (beat === 0 && isBeatStart) return { instrument: 'fxMetronome1' }
      if (isBeatStart && sub > 1) return { instrument: 'fxMetronome2' }

      return { instrument: 'fxMetronome3' }
    })
  })
}

// Меняет число долей. Лишние доли отрезаются с конца, новые копируют последнюю долю
// (и её subdivision, и её ноты).
export const resizeBeats = ({ subdivisions, bar }: Layout, beats: number): Layout => {
  if (beats <= subdivisions.length) {
    const next = subdivisions.slice(0, beats)

    return { subdivisions: next, bar: bar.slice(0, totalNotes(next)) }
  }

  const added = beats - subdivisions.length
  const lastSubdivision = subdivisions[subdivisions.length - 1]
  const lastNotes = bar.slice(-lastSubdivision)

  return {
    subdivisions: [...subdivisions, ...uniformSubdivisions(added, lastSubdivision)],
    // Копии нот, чтобы новые доли не делили объекты с последней
    bar: [
      ...bar,
      ...Array.from({ length: added }, () => lastNotes.map((note) => ({ ...note }))).flat(),
    ],
  }
}

// Меняет subdivision одной доли. Ноты остальных долей не трогаем, ноты этой доли
// собираются заново по шаблону (см. defaultBar): их число изменилось, старые
// не ложатся на новую сетку.
export const setBeatSubdivision = (
  { subdivisions, bar }: Layout,
  beat: number,
  subdivision: number,
): Layout => {
  if (!Number.isInteger(beat) || beat < 0 || beat >= subdivisions.length) {
    return { subdivisions, bar }
  }

  const next = subdivisions.map((sub, idx) => (idx === beat ? subdivision : sub))
  const start = totalNotes(subdivisions.slice(0, beat))
  const notes = defaultBar(next).slice(start, start + subdivision)

  return {
    subdivisions: next,
    bar: [...bar.slice(0, start), ...notes, ...bar.slice(start + subdivisions[beat])],
  }
}

// Восстанавливает раскладку из сохранённых настроек. Понимает и новый формат
// (subdivisions), и старый (beats + одна subdivision на весь такт).
// Испорченные данные не роняют приложение: невалидный bar заменяется шаблоном,
// невалидные subdivisions — раскладкой по умолчанию.
export const restoreLayout = (stored: {
  subdivisions?: unknown
  beats?: number
  subdivision?: number
  bar?: Bar
}): Layout => {
  const subdivisions =
    stored.subdivisions ??
    uniformSubdivisions(stored.beats ?? DEFAULTS.beats, stored.subdivision ?? DEFAULTS.subdivision)

  if (!isValidSubdivisions(subdivisions)) {
    const fallback = uniformSubdivisions(DEFAULTS.beats, DEFAULTS.subdivision)

    return { subdivisions: fallback, bar: defaultBar(fallback) }
  }

  const isBarValid = Array.isArray(stored.bar) && stored.bar.length === totalNotes(subdivisions)

  return { subdivisions, bar: isBarValid && stored.bar ? stored.bar : defaultBar(subdivisions) }
}
