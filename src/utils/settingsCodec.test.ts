import { defaultBar } from './barLayout'
import { decodeSettings, encodeSettings } from './settingsCodec'
import type { Settings } from './settingsCodec'

const note = (instrument: 'fxMetronome1' | 'fxMetronome2' | 'fxMetronome3' | null) => ({
  instrument,
})

const settings: Settings = {
  tempo: 96,
  layout: {
    subdivisions: [4, 4, 4, 4],
    bar: '1333233323332333'
      .split('')
      .map((code) =>
        note(([null, 'fxMetronome1', 'fxMetronome2', 'fxMetronome3'] as const)[Number(code)]),
      ),
  },
  training: { every: 1, from: 96, to: 96, step: 1 },
}

describe('encodeSettings', () => {
  it('кодирует основные настройки и тренировку в компактный формат', () => {
    expect(encodeSettings(settings)).toBe('m=96.4444&tr=1.96.96.1')
  })

  it('не пишет tr, когда тренировки нет', () => {
    expect(encodeSettings({ ...settings, training: null })).toBe('m=96.4444')
  })

  it('кодирует разную subdivision по долям символами base36 (10..16 → a..g)', () => {
    const layout = {
      subdivisions: [1, 2, 16],
      bar: Array(19).fill(note('fxMetronome1')),
    }

    expect(encodeSettings({ ...settings, layout, training: null })).toBe(
      `m=96.12g.${'1'.repeat(19)}`,
    )
  })

  it('пауза кодируется нулём', () => {
    const layout = { subdivisions: [2], bar: [note('fxMetronome1'), note(null)] }

    expect(encodeSettings({ ...settings, layout, training: null })).toBe('m=96.2.10')
  })

  it('не пишет ноты, если такт совпадает с шаблоном по умолчанию', () => {
    const layout = { subdivisions: [3, 3, 3, 6], bar: defaultBar([3, 3, 3, 6]) }

    expect(encodeSettings({ ...settings, layout, training: null })).toBe('m=96.3336')
  })

  it('пишет ноты, как только такт отличается от шаблона', () => {
    const bar = defaultBar([3, 3, 3, 6])
    bar[1] = note(null)

    const layout = { subdivisions: [3, 3, 3, 6], bar }

    expect(encodeSettings({ ...settings, layout, training: null })).toBe(
      'm=96.3336.103233233233333',
    )
  })
})

describe('decodeSettings: новый формат', () => {
  it('раунд-трип: decode(encode(x)) возвращает исходные настройки', () => {
    const query = Object.fromEntries(new URLSearchParams(encodeSettings(settings)))

    expect(decodeSettings(query)).toEqual({
      tempo: 96,
      layout: settings.layout,
      training: settings.training,
    })
  })

  it('символ subdivision равен числу нот в доле: 2222 — по две ноты в каждой из четырёх долей', () => {
    const { layout } = decodeSettings({ m: '96.2222.13232323' })

    expect(layout?.subdivisions).toEqual([2, 2, 2, 2])
    expect(layout?.bar).toHaveLength(8)
  })

  it('без нот берётся шаблон: m=96.3336 — три доли по 3 ноты и одна из 6', () => {
    const { tempo, layout } = decodeSettings({ m: '96.3336' })

    expect(tempo).toBe(96)
    expect(layout?.subdivisions).toEqual([3, 3, 3, 6])
    expect(layout?.bar).toEqual(defaultBar([3, 3, 3, 6]))
    expect(layout?.bar).toHaveLength(15)
  })

  it('пустая часть нот после точки равна отсутствию нот', () => {
    expect(decodeSettings({ m: '96.3336.' }).layout).toEqual(
      decodeSettings({ m: '96.3336' }).layout,
    )
  })

  it('явно записанный шаблон читается так же, как сокращённая запись', () => {
    expect(decodeSettings({ m: '96.4444.1333233323332333' }).layout).toEqual(
      decodeSettings({ m: '96.4444' }).layout,
    )
  })

  it('без tr экран тренировки не включается', () => {
    const decoded = decodeSettings({ m: '96.4444.1333233323332333' })

    expect(decoded.training).toBeUndefined()
  })

  it('отбрасывает раскладку, если длина нот не сходится с subdivisions', () => {
    const decoded = decodeSettings({ m: '96.4444.133' })

    expect(decoded.layout).toBeUndefined()
    expect(decoded.tempo).toBe(96)
  })

  it('отбрасывает раскладку с невалидным символом ноты', () => {
    expect(decodeSettings({ m: '96.1.4' }).layout).toBeUndefined()
  })

  it('отбрасывает раскладку с невалидной subdivision', () => {
    expect(decodeSettings({ m: '96.h.11111111111111111' }).layout).toBeUndefined()
  })

  it('отбрасывает раскладку с пустым списком долей', () => {
    expect(decodeSettings({ m: '96..' }).layout).toBeUndefined()
  })

  it('зажимает темп в допустимый диапазон', () => {
    expect(decodeSettings({ m: '999.1.1' }).tempo).toBe(300)
    expect(decodeSettings({ m: '5.1.1' }).tempo).toBe(20)
  })

  it('параметр tempo переключает разбор на старый формат, m игнорируется', () => {
    expect(decodeSettings({ tempo: '100', m: '96.1.1' })).toEqual({
      tempo: 100,
      layout: undefined,
    })
  })

  it('читает частичную тренировку', () => {
    expect(decodeSettings({ m: '96.1.1', tr: '4.80' }).training).toEqual({ every: 4, from: 80 })
  })
})

describe('decodeSettings: старый формат', () => {
  const legacy = {
    tempo: '96',
    beats: '4',
    subdivision: '4',
    bar: '1333233323332333',
    training: '1',
    every: '1',
    from: '96',
    to: '96',
    step: '1',
  }

  it('открывает старые ссылки и раскладывает subdivision на все доли', () => {
    expect(decodeSettings(legacy)).toEqual({
      tempo: 96,
      layout: settings.layout,
      training: { every: 1, from: 96, to: 96, step: 1 },
    })
  })

  it('читает step, который раньше в ссылке терялся', () => {
    expect(decodeSettings({ ...legacy, step: '5' }).training?.step).toBe(5)
  })

  it('без training=1 тренировки нет', () => {
    expect(decodeSettings({ ...legacy, training: '0' }).training).toBeUndefined()
  })

  it('отбрасывает bar, длина которого не равна beats * subdivision', () => {
    expect(decodeSettings({ ...legacy, bar: '1333' }).layout).toBeUndefined()
  })

  it('пустая ссылка даёт пустой результат', () => {
    expect(decodeSettings({})).toEqual({ tempo: undefined, layout: undefined })
  })
})
