import {
  defaultBar,
  getBarMap,
  isTuplet,
  isValidSubdivisions,
  noteDuration,
  resizeBeats,
  restoreLayout,
  setBeatSubdivision,
  totalNotes,
  tupletName,
  uniformSubdivisions,
} from './barLayout'
import { DEFAULTS } from '../constants'

const codes = (subdivisions: number[]) => {
  const map = { fxMetronome1: '1', fxMetronome2: '2', fxMetronome3: '3' } as const

  return defaultBar(subdivisions)
    .map((note) => (note.instrument ? map[note.instrument] : '0'))
    .join('')
}

describe('getBarMap', () => {
  it('раскладывает доли разной длины: [3, 3, 3, 6]', () => {
    const { beatOf, beatStart } = getBarMap([3, 3, 3, 6])

    expect(beatOf).toEqual([0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3])
    expect(beatStart).toEqual([0, 3, 6, 9])
  })

  it('равномерная раскладка совпадает со старой арифметикой через деление', () => {
    const { beatOf, beatStart } = getBarMap([4, 4, 4])

    beatOf.forEach((beat, idx) => expect(beat).toBe(Math.floor(idx / 4)))
    beatStart.forEach((start, beat) => expect(start).toBe(beat * 4))
  })

  it('пустая раскладка даёт пустые массивы', () => {
    expect(getBarMap([])).toEqual({ beatOf: [], beatStart: [] })
  })
})

describe('noteDuration', () => {
  it('доля длится 60 / tempo независимо от числа нот', () => {
    ;[1, 3, 4, 6].forEach((sub) => {
      expect(noteDuration(120, sub) * sub).toBeCloseTo(0.5)
    })
  })

  it('такт [3, 3, 3, 6] на 96 bpm равен четырём долям', () => {
    const subdivisions = [3, 3, 3, 6]
    const { beatOf } = getBarMap(subdivisions)
    const total = beatOf.reduce((sum, beat) => sum + noteDuration(96, subdivisions[beat]), 0)

    expect(total).toBeCloseTo((60 / 96) * 4)
  })

  it('ноты в шестиольной доле вдвое короче, чем в триольной', () => {
    expect(noteDuration(96, 6)).toBeCloseTo(noteDuration(96, 3) / 2)
  })

  it('совпадает со старой формулой для равномерной раскладки', () => {
    const tempo = 120
    const beats = 4
    const sub = 4
    const oldInterval = 60 / ((tempo * (beats * sub)) / beats)

    expect(noteDuration(tempo, sub)).toBeCloseTo(oldInterval)
  })
})

// Эти тесты фиксируют шаблон по умолчанию: он не хранится в ссылках,
// так что его смена молча поменяет звучание уже расшаренных ссылок.
describe('defaultBar (замороженный шаблон)', () => {
  it('4 доли по 1 ноте: сильная 1, дальше пульсация 3', () => {
    expect(codes([1, 1, 1, 1])).toBe('1333')
  })

  it('4 доли по 4 ноты: 1 на сильной, 2 на началах долей, 3 на пульсации', () => {
    expect(codes([4, 4, 4, 4])).toBe('1333233323332333')
  })

  it('[3, 3, 3, 6]', () => {
    expect(codes([3, 3, 3, 6])).toBe('133233233233333')
  })

  it('доля из одной ноты в середине такта получает 3, а не 2', () => {
    expect(codes([2, 1, 2])).toBe('13323')
  })
})

describe('isValidSubdivisions', () => {
  it('принимает раскладки в допустимых диапазонах', () => {
    expect(isValidSubdivisions([3, 3, 3, 6])).toBe(true)
    expect(isValidSubdivisions([16])).toBe(true)
  })

  it('отвергает пустую раскладку, лишние доли, выход за диапазон и не числа', () => {
    expect(isValidSubdivisions([])).toBe(false)
    expect(isValidSubdivisions(Array(17).fill(1))).toBe(false)
    expect(isValidSubdivisions([0])).toBe(false)
    expect(isValidSubdivisions([17])).toBe(false)
    expect(isValidSubdivisions([1.5])).toBe(false)
    expect(isValidSubdivisions(['3'])).toBe(false)
    expect(isValidSubdivisions('3336')).toBe(false)
  })
})

describe('resizeBeats', () => {
  const layout = (subdivisions: number[]) => ({ subdivisions, bar: defaultBar(subdivisions) })

  it('уменьшение отрезает доли с конца вместе с их нотами', () => {
    const result = resizeBeats(layout([3, 3, 3, 6]), 2)

    expect(result.subdivisions).toEqual([3, 3])
    expect(result.bar).toEqual(defaultBar([3, 3]))
  })

  it('увеличение копирует последнюю долю: и subdivision, и ноты', () => {
    const source = layout([2, 3])
    source.bar[3] = { instrument: 'fxMetronome1' }

    const result = resizeBeats(source, 4)

    expect(result.subdivisions).toEqual([2, 3, 3, 3])
    expect(result.bar).toHaveLength(totalNotes(result.subdivisions))
    expect(result.bar.slice(-3)).toEqual(source.bar.slice(2, 5))
  })

  it('новые доли не делят объекты нот с последней', () => {
    const result = resizeBeats(layout([2]), 3)

    expect(result.bar[2]).not.toBe(result.bar[0])
    expect(result.bar[4]).not.toBe(result.bar[2])
  })

  it('то же число долей ничего не меняет', () => {
    const source = layout([3, 6])

    expect(resizeBeats(source, 2)).toEqual(source)
  })
})

describe('restoreLayout', () => {
  it('читает новый формат сохранённых настроек', () => {
    const bar = defaultBar([3, 6])

    expect(restoreLayout({ subdivisions: [3, 6], bar })).toEqual({ subdivisions: [3, 6], bar })
  })

  it('мигрирует старый формат: beats + одна subdivision на весь такт', () => {
    const bar = defaultBar([4, 4, 4])

    expect(restoreLayout({ beats: 3, subdivision: 4, bar })).toEqual({
      subdivisions: [4, 4, 4],
      bar,
    })
  })

  it('без сохранённых данных возвращает раскладку по умолчанию', () => {
    expect(restoreLayout({})).toEqual({
      subdivisions: uniformSubdivisions(DEFAULTS.beats, DEFAULTS.subdivision),
      bar: defaultBar(uniformSubdivisions(DEFAULTS.beats, DEFAULTS.subdivision)),
    })
  })

  it('bar не сходится с раскладкой — берёт шаблон под сохранённые subdivisions', () => {
    expect(restoreLayout({ subdivisions: [3, 6], bar: defaultBar([2]) })).toEqual({
      subdivisions: [3, 6],
      bar: defaultBar([3, 6]),
    })
  })

  it('испорченные subdivisions не роняют: раскладка по умолчанию', () => {
    expect(restoreLayout({ subdivisions: 'мусор' }).subdivisions).toEqual(
      uniformSubdivisions(DEFAULTS.beats, DEFAULTS.subdivision),
    )
    expect(restoreLayout({ subdivisions: [99] }).subdivisions).toEqual(
      uniformSubdivisions(DEFAULTS.beats, DEFAULTS.subdivision),
    )
  })

  it('новый формат имеет приоритет над устаревшими beats и subdivision', () => {
    const result = restoreLayout({ subdivisions: [3, 6], beats: 4, subdivision: 1 })

    expect(result.subdivisions).toEqual([3, 6])
  })
})

describe('isTuplet', () => {
  it('степени двойки — не tuplet', () => {
    ;[1, 2, 4, 8, 16].forEach((sub) => expect(isTuplet(sub)).toBe(false))
  })

  it('остальные — tuplet', () => {
    ;[3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15].forEach((sub) => expect(isTuplet(sub)).toBe(true))
  })
})

describe('tupletName', () => {
  it('знает имена основных tuplet', () => {
    expect(tupletName(3)).toBe('triplet')
    expect(tupletName(5)).toBe('quintuplet')
    expect(tupletName(6)).toBe('sextuplet')
    expect(tupletName(7)).toBe('septuplet')
  })

  it('для редких tuplet отдаёт запасное имя', () => {
    expect(tupletName(11)).toBe('11-tuplet')
  })
})

describe('setBeatSubdivision', () => {
  const layout = (subdivisions: number[]) => ({ subdivisions, bar: defaultBar(subdivisions) })

  it('меняет subdivision только у одной доли', () => {
    const result = setBeatSubdivision(layout([2, 2, 2]), 1, 3)

    expect(result.subdivisions).toEqual([2, 3, 2])
    expect(result.bar).toHaveLength(totalNotes(result.subdivisions))
  })

  it('ноты остальных долей остаются как были, в том числе правки пользователя', () => {
    const source = layout([2, 2, 2])
    source.bar[0] = { instrument: null }
    source.bar[5] = { instrument: 'fxMetronome1' }

    const result = setBeatSubdivision(source, 1, 4)

    expect(result.bar[0]).toEqual({ instrument: null })
    expect(result.bar[result.bar.length - 1]).toEqual({ instrument: 'fxMetronome1' })
  })

  it('ноты изменённой доли собираются по шаблону', () => {
    const result = setBeatSubdivision(layout([1, 1]), 1, 3)

    expect(result.bar.slice(1).map((note) => note.instrument)).toEqual([
      'fxMetronome2',
      'fxMetronome3',
      'fxMetronome3',
    ])
  })

  it('уменьшение отрезает ноты доли', () => {
    const result = setBeatSubdivision(layout([3, 3]), 0, 1)

    expect(result.subdivisions).toEqual([1, 3])
    expect(result.bar).toHaveLength(4)
  })

  it('несуществующая доля — раскладка без изменений', () => {
    const source = layout([2, 2])

    expect(setBeatSubdivision(source, 5, 3)).toEqual(source)
  })
})
