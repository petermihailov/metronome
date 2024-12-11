export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

const prefix = 'mn'

export interface IStorage<T = unknown> {
  clear: () => boolean
  get: () => T | null
  set: (value: T) => boolean
}

export class Storage<T extends Record<string, unknown>> implements IStorage<T> {
  private readonly key: string
  private readonly defaults: T

  constructor(key: string, defaults: T) {
    this.key = `${prefix}_${key}`
    this.defaults = defaults

    const current = this.get()

    if (current) {
      // sync keys
      this.set({ ...defaults, ...current } as T)
    } else {
      this.set(defaults)
    }
  }

  public clear() {
    try {
      window.localStorage.removeItem(this.key)

      return true
    } catch (e) {
      return false
    }
  }

  public get() {
    try {
      const json = window.localStorage.getItem(this.key)

      if (json) {
        return JSON.parse(json) as T
      }
    } catch (e) {
      /* empty */
    }

    return this.defaults
  }

  public set(value: T) {
    try {
      const json = JSON.stringify(value)

      window.localStorage.setItem(this.key, json)

      return true
    } catch (e) {
      return false
    }
  }

  public update(value: Partial<T>) {
    const prev = this.get() || {}
    return this.set({ ...prev, ...value } as T)
  }
}
