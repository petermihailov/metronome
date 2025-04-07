import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import type { Tick } from '../types/common'

const zeroTick: Tick = {
  counting: true,
  note: null,
  played: {
    notes: 0,
    beats: 0,
    bars: 0,
  },
  position: {
    idx: 0,
    beat: 0,
    subdivision: 0,
    first: true,
    last: false,
  },
}

interface Store extends Tick {
  willBeScheduled: Tick | null
  // Actions
  onTickAction: (tick: Tick) => void
  onBeforeScheduledAction: (tick: Tick) => void
  resetAction: () => void
}

export const useTickStore = createWithEqualityFn<Store>((set) => {
  return {
    ...zeroTick,
    played: { ...zeroTick.played },
    position: { ...zeroTick.position },

    willBeScheduled: null,

    onBeforeScheduledAction: (tick: Tick) => {
      set((state) => ({ ...state, willBeScheduled: tick }))
    },

    onTickAction: (tick) => {
      set((state) => ({ ...state, ...tick }))
    },

    resetAction: () => {
      set((state) => ({ ...state, ...zeroTick }))
    },
  }
}, shallow)
