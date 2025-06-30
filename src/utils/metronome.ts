export const tapTempo = {
  prev: 0,
  tap() {
    const now = Date.now()
    const delta = now - this.prev
    this.prev = now

    if (delta < 3_000) {
      const value = Math.round(60_000 / delta)
      return Math.round(value / 4) * 4
    }

    return null
  },
}
