import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { Storage } from '../lib/LocalStorage'
import { dateFormat } from '../utils/format'

const dayPlayingStorage = new Storage<{ [date: string]: number }>('day-playing', {
  [dateFormat()]: 0,
})

type Seconds = number

interface Store {
  time: {
    current: Seconds
    session: Seconds
    day: Seconds
  }

  addSecond: () => void
  resetCurrentTime: () => void
}

export const usePlayingTimeStore = createWithEqualityFn<Store>((set) => {
  const storageValue = dayPlayingStorage.get()

  return {
    time: {
      current: 0,
      session: 0,
      day: storageValue[dateFormat()],
    },

    addSecond: () => {
      set((state) => {
        dayPlayingStorage.update({ [dateFormat()]: state.time.day + 1 })

        return {
          ...state,
          time: {
            current: state.time.current++,
            session: state.time.session++,
            day: state.time.day++,
          },
        }
      })
    },

    resetCurrentTime: () => {
      set((state) => ({
        ...state,
        time: {
          ...state.time,
          current: 0,
        },
      }))
    },
  }
}, shallow)
