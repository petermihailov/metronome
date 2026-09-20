import type { Logger } from './lib/Logger'

export {}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
    logs: Record<string, Logger>
  }
}
