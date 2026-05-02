import { calculateTime, rangeGenerator } from './training'

describe('rangeGenerator', () => {
  it('перечисляет темпы вверх с шагом 1, не включая стартовый', () => {
    expect([...rangeGenerator({ from: 60, to: 64, step: 1 })]).toEqual([61, 62, 63, 64])
  })

  it('перечисляет темпы вниз с шагом 1', () => {
    expect([...rangeGenerator({ from: 64, to: 60, step: 1 })]).toEqual([63, 62, 61, 60])
  })

  it('не выходит за `to`, когда (to - from) не делится нацело на step', () => {
    // 60 -> 63 шагом 2: должны получить только 62, без 64
    expect([...rangeGenerator({ from: 60, to: 63, step: 2 })]).toEqual([62])
  })

  it('возвращает пустую последовательность при from === to', () => {
    expect([...rangeGenerator({ from: 60, to: 60, step: 1 })]).toEqual([])
  })

  it('использует step=1 по умолчанию', () => {
    expect([...rangeGenerator({ from: 60, to: 62 })]).toEqual([61, 62])
  })
})

describe('calculateTime', () => {
  it('считает время для постоянного темпа (from === to)', () => {
    // Один блок: every=2 такта по beats=3 доли при 60 BPM = 60/60 * 3 * 2 = 6 сек
    expect(calculateTime({ tempo: 60, from: 60, to: 60, step: 1, every: 2, beats: 3 })).toBe(6)
  })

  it('считает время для линейного ramp с шагом 1', () => {
    // Темпы: [60, 61, 62, 63, 64], каждый блок = 1 такт * 4 доли
    // Σ (60/t * 4) ≈ 4 + 3.9344 + 3.8710 + 3.8095 + 3.75 = 19.3649 → floor = 19
    expect(calculateTime({ tempo: 60, from: 60, to: 64, step: 1, every: 1, beats: 4 })).toBe(19)
  })

  it('даёт тот же результат при обратном направлении (from > to)', () => {
    const up = calculateTime({ tempo: 60, from: 60, to: 64, step: 1, every: 1, beats: 4 })
    const down = calculateTime({ tempo: 64, from: 64, to: 60, step: 1, every: 1, beats: 4 })
    expect(down).toBe(up)
  })

  it('масштабирует время линейно по every', () => {
    const one = calculateTime({ tempo: 60, from: 60, to: 60, step: 1, every: 1, beats: 4 })
    const four = calculateTime({ tempo: 60, from: 60, to: 60, step: 1, every: 4, beats: 4 })
    expect(one).toBe(4)
    expect(four).toBe(16)
  })

  it('не учитывает темп за границей `to` при шаге, не делящем интервал нацело', () => {
    // from=60, to=63, step=2 -> темпы [60, 62] (без 64)
    // Σ (60/60 + 60/62) * 4 ≈ 4 + 3.8710 = 7.8710 → floor = 7
    expect(calculateTime({ tempo: 60, from: 60, to: 63, step: 2, every: 1, beats: 4 })).toBe(7)
  })

  it('использует именно текущий темп каждого блока, а не стартовый', () => {
    // Регрессия на старый баг: раньше `values.tempo` фиксировался на старте,
    // и время считалось как N_блоков * (60/from) * beats * every.
    // Для from=60, to=120, step=60, every=1, beats=4:
    //   старое поведение: 2 блока * (60/60) * 4 = 8 сек
    //   правильное:       (60/60 + 60/120) * 4 = 4 + 2 = 6 сек
    expect(calculateTime({ tempo: 60, from: 60, to: 120, step: 60, every: 1, beats: 4 })).toBe(6)
  })
})
