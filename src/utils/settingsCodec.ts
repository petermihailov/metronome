import { MINMAX } from '../constants'
import { defaultBar, isValidSubdivisions, totalNotes } from './barLayout'
import type { Layout } from './barLayout'
import type { Bar, Instrument } from '../types/metronome'

// Компактный формат:
//   m=<tempo>.<subdivisions>[.<notes>]  — основные настройки
//   tr=<every>.<from>.<to>.<step>       — тренировка, наличие параметра включает экран
//
// subdivisions — по одному символу base36 на долю: число нот в доле как есть,
// 1..9 → '1'..'9', 10..16 → 'a'..'g' (символ '4' — четыре ноты в доле),
// notes — по одному символу на ноту (0 — пауза, 1..3 — инструмент).
// Если такт совпадает с шаблоном по умолчанию (см. defaultBar), notes не пишутся,
// а при чтении без notes шаблон восстанавливается.
// Пример: m=96.3336&tr=1.96.96.1 и явный вариант m=96.4444.1333233323332333
//
// Старый формат (tempo=&beats=&subdivision=&bar=&training=&every=&from=&to=&step=)
// только читается, чтобы уже расшаренные ссылки продолжали открываться.
// Определяется по наличию параметра `tempo`: в новом формате его нет.

const NOTE_CODES: (Instrument | null)[] = [null, 'fxMetronome1', 'fxMetronome2', 'fxMetronome3']

export interface TrainingSettings {
  every: number
  from: number
  to: number
  step: number
}

export interface Settings {
  tempo: number
  layout: Layout
  training: TrainingSettings | null
}

// Что удалось прочитать из ссылки: каждое поле независимо, невалидное просто отсутствует.
// training определён — значит, ссылка открывает экран тренировки.
export interface DecodedSettings {
  tempo?: number
  layout?: Layout
  training?: Partial<TrainingSettings>
}

const parseInteger = (value: string | undefined) => {
  return value !== undefined && /^\d+$/.test(value) ? Number(value) : null
}

const parseTempo = (value: string | undefined) => {
  const num = parseInteger(value)
  return num === null ? undefined : MINMAX.range('tempo', num)
}

const barToCodes = (bar: Bar) => {
  return bar.map((note) => Math.max(NOTE_CODES.indexOf(note.instrument), 0)).join('')
}

// Собирает раскладку, только если всё согласовано: диапазоны и длина такта.
// noteCodes не передан — берётся шаблон по умолчанию.
const buildLayout = (subdivisions: number[], noteCodes?: string): Layout | undefined => {
  if (!isValidSubdivisions(subdivisions)) return undefined

  if (noteCodes === undefined) {
    return { subdivisions, bar: defaultBar(subdivisions) }
  }

  if (noteCodes.length !== totalNotes(subdivisions) || !/^[0-3]+$/.test(noteCodes)) {
    return undefined
  }

  return {
    subdivisions,
    bar: noteCodes.split('').map((code) => ({ instrument: NOTE_CODES[Number(code)] })),
  }
}

const decodeMain = (value: string): Pick<DecodedSettings, 'tempo' | 'layout'> => {
  const [tempo, subdivisions, notes] = value.split('.')

  const subs = (subdivisions ?? '').split('').map((char) => parseInt(char, 36))

  return {
    tempo: parseTempo(tempo),
    // Пустая строка после последней точки (`m=96.3336.`) — то же, что отсутствие нот
    layout: buildLayout(subs, notes || undefined),
  }
}

const decodeTraining = (value: string): Partial<TrainingSettings> => {
  const [every, from, to, step] = value.split('.').map(parseInteger)

  return {
    ...(every !== null && every !== undefined && { every: MINMAX.range('every', every) }),
    ...(from !== null && from !== undefined && { from: MINMAX.range('tempo', from) }),
    ...(to !== null && to !== undefined && { to: MINMAX.range('tempo', to) }),
    ...(step !== null && step !== undefined && { step: MINMAX.range('step', step) }),
  }
}

const decodeLegacy = (query: Record<string, string>): DecodedSettings => {
  const beats = parseInteger(query.beats)
  const subdivision = parseInteger(query.subdivision)

  const layout =
    beats !== null && subdivision !== null && query.bar !== undefined
      ? buildLayout(Array(beats).fill(subdivision), query.bar)
      : undefined

  const decoded: DecodedSettings = { tempo: parseTempo(query.tempo), layout }

  if (query.training === '1') {
    decoded.training = decodeTraining(
      [query.every, query.from, query.to, query.step].map((v) => v ?? '').join('.'),
    )
  }

  return decoded
}

export const decodeSettings = (query: Record<string, string>): DecodedSettings => {
  if (query.tempo !== undefined) {
    return decodeLegacy(query)
  }

  return {
    ...(query.m !== undefined && decodeMain(query.m)),
    ...(query.tr !== undefined && { training: decodeTraining(query.tr) }),
  }
}

// Возвращает query-строку без ведущего `?`
export const encodeSettings = ({ tempo, layout, training }: Settings): string => {
  const subdivisions = layout.subdivisions.map((sub) => sub.toString(36)).join('')
  const notes = barToCodes(layout.bar)
  const isDefaultBar = notes === barToCodes(defaultBar(layout.subdivisions))

  const parts = [`m=${tempo}.${subdivisions}${isDefaultBar ? '' : `.${notes}`}`]

  if (training) {
    const { every, from, to, step } = training
    parts.push(`tr=${every}.${from}.${to}.${step}`)
  }

  return parts.join('&')
}
