import { isMutedBar } from './silence'

describe('isMutedBar', () => {
  it('играет первые N тактов и молчит следующие M, затем цикл повторяется', () => {
    const muted = Array.from({ length: 8 }, (_, bar) => isMutedBar(bar, 2, 2))

    expect(muted).toEqual([false, false, true, true, false, false, true, true])
  })

  it('поддерживает разные N и M', () => {
    const muted = Array.from({ length: 8 }, (_, bar) => isMutedBar(bar, 3, 1))

    expect(muted).toEqual([false, false, false, true, false, false, false, true])
  })

  it('не глушит отсчёт (отрицательный номер такта)', () => {
    expect(isMutedBar(-1, 1, 3)).toBe(false)
    expect(isMutedBar(-2, 1, 3)).toBe(false)
  })

  it('не глушит ничего, если mute = 0', () => {
    expect(isMutedBar(5, 2, 0)).toBe(false)
  })
})
