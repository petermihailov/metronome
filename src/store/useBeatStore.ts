import { create } from 'zustand';

import { BEAT_DEFAULT } from '../constants';
import type { Beat } from '../types/common';

interface Store {
  beat: Beat;
  beatsPlayed: number;
  barsPlayed: number;

  setBeatAction: (beat: Beat) => void;
  reset: () => void;
}

export const useBeatStore = create<Store>((set) => {
  return {
    beat: BEAT_DEFAULT,
    beatsPlayed: 0,
    barsPlayed: 0,

    setBeatAction: (beat) =>
      set(({ beatsPlayed, barsPlayed }) => ({
        beat,
        beatsPlayed: beatsPlayed + 1,
        barsPlayed: barsPlayed + Number(beat.index === 0),
      })),

    reset: () =>
      set(() => ({
        beat: BEAT_DEFAULT,
        barsPlayed: 0,
        beatsPlayed: 0,
      })),
  };
});
