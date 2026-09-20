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
}: {
  tempo: number
  subdivisions: number[]
  bar?: ReturnType<typeof defaultBar>
  ms: number
}) => {
  const ticks: Tick[] = []
  const player = new Player()

  player.setKit(kit)
  player.setTempo(tempo)
  player.setLayout(subdivisions, bar)
  player.setOnTick((tick) => ticks.push(tick))

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
