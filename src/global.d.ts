import type { State } from './context/MetronomeContext';

export {};

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    _STATE_: State;
  }
}
