import type { Player } from './lib/Player';

export {};

interface Debug {
  player: Player;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    webkitOfflineAudioContext: typeof OfflineAudioContext;
    DEBUG: Partial<Debug>;
  }
}
