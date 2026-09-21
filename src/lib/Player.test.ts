import { Player } from './Player'
import type { SoundMap, Tick } from '../types/metronome'
import { defaultBar } from '../utils/barLayout'

const mocks = vi.hoisted(() => {
  const starts: number[] = []
  const clock = { base: 0 }

  const audioCtx = {
    state: 'running',
    outputLatency: 0,
    destination: {},
    // Время AudioContext идёт вместе с поддельными таймерами
    get currentTime() {
      return (Date.now() - clock.base) / 1000
    },
    createGain: () => ({ gain: { value: 1 }, connect: () => {}, disconnect: () => {} }),
    createBufferSource: () => ({
      buffer: null,
      onended: null,
      connect: () => {},
      disconnect: () => {},
      stop: () => {},
      start: (when: number) => {
        starts.push(when)
      },
    }),
  }

  return { starts, clock, audioCtx }
})

vi.mock('./Logger', () => ({
  createLogger: () => ({
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    on: () => {},
    off: () => {},
  }),
}))

vi.mock('../utils/audio', () => ({
  getAudioContext: () => mocks.audioCtx,
}))

const kit = {
  fxMetronome1: {},
  fxMetronome2: {},
  fxMetronome3: {},
} as unknown as SoundMap

const diffs = (times: number[]) => times.slice(1).map((time, idx) => time - times[idx])

// Проигрывает такт заданное время и возвращает моменты запуска нот и тики
const run = async ({
  tempo,
  subdivisions,
  bar = defaultBar(subdivisions),
  ms,
  count,
  silence,
}: {
  tempo: number
  subdivisions: number[]
  bar?: ReturnType<typeof defaultBar>
  ms: number
  count?: number
  silence?: { play: number; mute: number }
}) => {
  const ticks: Tick[] = []
  const player = new Player()

  player.setKit(kit)
  player.setTempo(tempo)
  player.setLayout(subdivisions, bar)
  player.setOnTick((tick) => ticks.push(tick))
  if (count) player.setCounting(count)
  if (silence) player.setSilence(silence)

  await player.play()
  vi.advanceTimersByTime(ms)
  player.stop()

  return { starts: [...mocks.starts], ticks }
}

describe('Player: разная subdivision по долям', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('window', globalThis)
    mocks.clock.base = Date.now()
    mocks.starts.length = 0
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('[3, 3, 3, 6] на 96 bpm: три доли по 3 ноты, последняя вмещает 6 нот той же длительности', async () => {
    const { starts } = await run({ tempo: 96, subdivisions: [3, 3, 3, 6], ms: 3000 })
    const d = diffs(starts)

    const triplet = 60 / (96 * 3)
    const sextuplet = 60 / (96 * 6)

    d.slice(0, 9).forEach((value) => expect(value).toBeCloseTo(triplet, 6))
    d.slice(9, 15).forEach((value) => expect(value).toBeCloseTo(sextuplet, 6))

    // 15 нот такта, следующий такт начинается ровно через четыре доли
    expect(starts[15] - starts[0]).toBeCloseTo((60 / 96) * 4, 6)
  })

  it('каждая доля длится ровно 60 / tempo, сколько бы нот в ней ни было', async () => {
    const { starts } = await run({ tempo: 96, subdivisions: [3, 3, 3, 6], ms: 3000 })

    // Индексы первых нот долей: 0, 3, 6, 9 и начало следующего такта — 15
    const beatStarts = [0, 3, 6, 9, 15].map((idx) => starts[idx])

    diffs(beatStarts).forEach((value) => expect(value).toBeCloseTo(60 / 96, 6))
  })

  it('равномерная раскладка играет как раньше: [4, 4, 4, 4] на 120 bpm', async () => {
    const { starts } = await run({ tempo: 120, subdivisions: [4, 4, 4, 4], ms: 3000 })

    diffs(starts)
      .slice(0, 16)
      .forEach((value) => expect(value).toBeCloseTo(60 / (120 * 4), 6))
  })

  it('тики получают номер доли и номер ноты внутри своей доли', async () => {
    const { ticks } = await run({ tempo: 96, subdivisions: [3, 3, 3, 6], ms: 3000 })
    const first = ticks.slice(0, 16)

    expect(first.map((tick) => tick.position.beat)).toEqual([
      1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 1,
    ])
    expect(first.map((tick) => tick.position.subdivision)).toEqual([
      1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 4, 5, 6, 1,
    ])
    expect(first[14].position.last).toBe(true)
    expect(first[15].position.downbeat).toBe(true)
  })

  it('раскладка, не сходящаяся с bar, игнорируется', async () => {
    const player = new Player()

    player.setKit(kit)
    player.setTempo(120)
    player.setLayout([4], defaultBar([4]))
    // 2 + 2 = 4 доли нот, а в bar три ноты — такая раскладка не должна примениться
    player.setLayout([2, 2], defaultBar([3]))

    await player.play()
    vi.advanceTimersByTime(1000)
    player.stop()

    diffs([...mocks.starts])
      .slice(0, 8)
      .forEach((value) => expect(value).toBeCloseTo(60 / (120 * 4), 6))
  })
})

describe('Player: режим тишины', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('window', globalThis)
    mocks.clock.base = Date.now()
    mocks.starts.length = 0
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  // 4 доли по 0.5 с (120 bpm) = 2 с на такт
  const bar = 2

  it('играет N тактов, молчит M и повторяет цикл: тики помечаются muted', async () => {
    const { ticks } = await run({
      tempo: 120,
      subdivisions: [1, 1, 1, 1],
      silence: { play: 2, mute: 1 },
      ms: bar * 6 * 1000 - 100,
    })

    // Первая нота каждого такта
    const downbeats = ticks.filter((tick) => tick.position.downbeat)
    expect(downbeats.map((tick) => tick.muted)).toEqual([false, false, true, false, false, true])

    // Тишина держится на всех четырёх нотах такта
    const mutedBars = ticks.filter((tick) => tick.muted).map((tick) => tick.played.bars)
    expect(new Set(mutedBars)).toEqual(new Set([2, 5]))
  })

  it('в тихих тактах звук не планируется', async () => {
    const { starts } = await run({
      tempo: 120,
      subdivisions: [1, 1, 1, 1],
      silence: { play: 1, mute: 1 },
      // 3 такта: играет, молчит, играет
      ms: bar * 3 * 1000 - 100,
    })

    // 4 доли + 4 доли, второй такт пропущен
    expect(starts).toHaveLength(8)
    expect(starts[4] - starts[3]).toBeCloseTo(0.5 + bar, 6)
  })

  it('отсчёт не глушится, тишина начинается с первого такта после него', async () => {
    const { starts, ticks } = await run({
      tempo: 120,
      subdivisions: [1, 1, 1, 1],
      count: 1,
      silence: { play: 1, mute: 1 },
      // отсчёт, играет, молчит
      ms: bar * 3 * 1000 - 100,
    })

    // Первая нота четвёртого такта планируется заранее, поэтому считаем только звуки первых трёх
    expect(starts.filter((time) => time < 0.05 + bar * 3)).toHaveLength(8)
    expect(ticks.filter((tick) => tick.counting).every((tick) => !tick.muted)).toBe(true)
    expect(ticks.filter((tick) => tick.muted).every((tick) => tick.played.bars === 1)).toBe(true)
  })

  it('без silence ничего не глушится', async () => {
    const { ticks } = await run({
      tempo: 120,
      subdivisions: [1, 1, 1, 1],
      ms: bar * 3 * 1000 - 100,
    })

    expect(ticks.some((tick) => tick.muted)).toBe(false)
  })
})
