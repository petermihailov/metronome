export type SpringNamespace = `--${string}`
export type SpringValue = number

export interface SpringOptions {
  namespace: SpringNamespace
  mass: number
  tension: number
  friction: number
  startVelocity: number
}

export interface SpringUpdateCallbackParams {
  namespace: SpringNamespace
  value: SpringValue
}

export type SpringUpdateCallback = (params: SpringUpdateCallbackParams) => void
export type SpringFinishCallback = (value?: unknown) => void

export interface SpringPhysicsConstructorParams {
  from: SpringValue
  to: SpringValue
  options: Partial<SpringOptions>
  onUpdate: SpringUpdateCallback
  onFinish?: SpringFinishCallback
}

export const DEFAULTS: SpringOptions = {
  namespace: '--physics',
  mass: 1,
  tension: 100,
  friction: 10,
  startVelocity: 0,
}

// modified https://webkit.org/demos/spring/spring.js
class SpringSolver {
  private readonly m_w0: number
  private readonly m_wd: number
  private readonly m_zeta: number
  private readonly m_A: number
  private readonly m_B: number

  constructor({ tension, mass, friction, startVelocity }: SpringOptions) {
    this.m_w0 = Math.sqrt(tension / mass)
    this.m_zeta = friction / (2 * Math.sqrt(tension * mass))

    if (this.m_zeta < 1) {
      this.m_wd = this.m_w0 * Math.sqrt(1 - this.m_zeta * this.m_zeta)
      this.m_A = 1
      this.m_B = (this.m_zeta * this.m_w0 + -startVelocity) / this.m_wd
    } else {
      this.m_wd = 0
      this.m_A = 1
      this.m_B = -startVelocity + this.m_w0
    }
  }

  solver(t: number) {
    if (this.m_zeta < 1) {
      t =
        Math.exp(-t * this.m_zeta * this.m_w0) *
        (this.m_A * Math.cos(this.m_wd * t) + this.m_B * Math.sin(this.m_wd * t))
    } else {
      t = (this.m_A + this.m_B * t) * Math.exp(-t * this.m_w0)
    }

    return 1 - t
  }
}

export class SpringPhysics {
  private readonly options: SpringOptions
  private readonly onUpdate: SpringUpdateCallback
  private readonly onFinish?: SpringFinishCallback
  private readonly springSolver: SpringSolver
  private from: SpringValue = 0
  private to: SpringValue = 0
  private tickValue: SpringValue = 0
  private inMotion = false
  private startTime = 0
  private frameId = 0

  constructor({ from, to, options, onUpdate, onFinish }: SpringPhysicsConstructorParams) {
    this.from = from
    this.to = to
    this.options = { ...DEFAULTS, ...options }
    this.onUpdate = onUpdate
    this.onFinish = onFinish
    this.springSolver = new SpringSolver(this.options)
  }

  go(to?: SpringValue) {
    if (this.tickValue) this.from = this.tickValue
    if (to) this.to = to

    this.inMotion = true
    this.startTime = Date.now() / 1000

    window.requestAnimationFrame(this.tick.bind(this))
  }

  private tick() {
    if (!this.inMotion) return

    const elapsed = Date.now() / 1000 - this.startTime
    const change = this.springSolver.solver(elapsed)

    this.tickValue = this.from + (this.to - this.from) * change
    this.onUpdate({
      namespace: this.options.namespace,
      value: +this.tickValue.toFixed(4),
    })

    if (elapsed < 5 || change !== 1) {
      this.frameId = window.requestAnimationFrame(this.tick.bind(this))
    } else {
      this.inMotion = false
      this.onFinish?.()
      window.cancelAnimationFrame(this.frameId)
    }
  }
}
