export class TimeoutManager {
  private timeouts = new Set<number>()

  set(fn: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      this.timeouts.delete(id)
      fn()
    }, delay)
    this.timeouts.add(id)
    return id
  }

  clear(id: number) {
    window.clearTimeout(id)
    this.timeouts.delete(id)
  }

  clearAll() {
    for (const id of this.timeouts) {
      window.clearTimeout(id)
    }
    this.timeouts.clear()
  }

  hasActive() {
    return this.timeouts.size > 0
  }
}
