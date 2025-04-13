import type { Logger } from './lib/Logger'

export {}

interface Debug {
  player: Player
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
    logs: Record<string, Logger>
  }
}
