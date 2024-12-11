import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS } from '../constants'
import type { Beat } from '../types/common'

interface Store {
  // Values
  beat: Beat
  beatsPlayed: number
  barsPlayed: number

  // Actions
  setBeatAction: (beat: Beat) => void
  resetAction: () => void
}

export const useBeatStore = createWithEqualityFn<Store>((set) => {
  return {
    beat: DEFAULTS.beat,
    beatsPlayed: 0,
    barsPlayed: 0,

    setBeatAction: (beat) => {
      set(({ beatsPlayed, barsPlayed }) => ({
        beat,
        beatsPlayed: beatsPlayed + 1,
        barsPlayed: barsPlayed + Number(beat.index === 0),
      }))
    },

    resetAction: () => {
      set(() => ({
        beat: DEFAULTS.beat,
        barsPlayed: 0,
        beatsPlayed: 0,
      }))
    },
  }
}, shallow)
