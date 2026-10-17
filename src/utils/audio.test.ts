vi.mock('../lib/Logger', () => ({
  createLogger: () => ({
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    on: () => {},
    off: () => {},
  }),
}))

type Listener = () => void

// Минимальный AudioContext: состояние, resume() и statechange
class FakeAudioContext {
  static initialState = 'suspended'

  state = FakeAudioContext.initialState
  private listeners: Listener[] = []

  addEventListener(_type: string, listener: Listener) {
    this.listeners.push(listener)
  }

  async resume() {
    this.setState('running')
  }

  setState(state: string) {
    this.state = state
    this.listeners.forEach((listener) => listener())
  }
}

const load = async () => {
  vi.resetModules()
  vi.stubGlobal('AudioContext', FakeAudioContext)

  const audio = await import('./audio')
  const audioCtx = audio.getAudioContext() as unknown as FakeAudioContext

  return { ...audio, audioCtx }
}

describe('audio: прогрев контекста', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    FakeAudioContext.initialState = 'suspended'
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('пока контекст ни разу не был running, прогрева нет', async () => {
    const { isAudioWarmingUp } = await load()

    expect(isAudioWarmingUp()).toBe(false)
  })

  it('после resumeAudioContext() контекст «холодный» секунду, потом нет', async () => {
    const { resumeAudioContext, isAudioWarmingUp, audioCtx } = await load()

    await resumeAudioContext()

    expect(audioCtx.state).toBe('running')
    expect(isAudioWarmingUp()).toBe(true)

    vi.advanceTimersByTime(999)
    expect(isAudioWarmingUp()).toBe(true)

    vi.advanceTimersByTime(1)
    expect(isAudioWarmingUp()).toBe(false)
  })

  it('переход в running со стороны (statechange) тоже считается пробуждением', async () => {
    const { isAudioWarmingUp, audioCtx } = await load()

    vi.advanceTimersByTime(5000)
    audioCtx.setState('running')

    expect(isAudioWarmingUp()).toBe(true)
  })

  it('interrupted → running (Safari) — пробуждение, suspended — нет', async () => {
    const { resumeAudioContext, isAudioWarmingUp, audioCtx } = await load()

    await resumeAudioContext()
    vi.advanceTimersByTime(5000)
    expect(isAudioWarmingUp()).toBe(false)

    audioCtx.setState('interrupted')
    expect(isAudioWarmingUp()).toBe(false)

    audioCtx.setState('running')
    expect(isAudioWarmingUp()).toBe(true)
  })

  it('контекст running уже при загрузке: прогрев отсчитывается с загрузки', async () => {
    FakeAudioContext.initialState = 'running'
    const { isAudioWarmingUp } = await load()

    expect(isAudioWarmingUp()).toBe(true)
    vi.advanceTimersByTime(1000)
    expect(isAudioWarmingUp()).toBe(false)
  })

  it('resumeAudioContext() на running контексте ничего не делает', async () => {
    const { resumeAudioContext, isAudioWarmingUp, audioCtx } = await load()

    await resumeAudioContext()
    vi.advanceTimersByTime(5000)

    const resume = vi.spyOn(audioCtx, 'resume')
    await resumeAudioContext()

    expect(resume).not.toHaveBeenCalled()
    expect(isAudioWarmingUp()).toBe(false)
  })
})
