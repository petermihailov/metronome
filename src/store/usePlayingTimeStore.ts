import { produce } from 'immer'
import { create } from 'zustand'

import { Storage } from '../lib/LocalStorage'
import { dateFormat } from '../utils/format'

const TIME_DEFAULT = { current: 0, session: 0, day: 0 }

const currentDate = dateFormat()
const playingStorage = new Storage<{ [date: string]: number }>('playing')
const storageValue = playingStorage.get()

if (!storageValue) {
  playingStorage.set({ [currentDate]: 0 })
} else {
  if (storageValue[currentDate]) {
    TIME_DEFAULT.day = storageValue[currentDate]
  }
}

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

export const usePlayingTimeStore = create<Store>((set) => {
  return {
    time: TIME_DEFAULT,

    addSecond: () =>
      set((state) => {
        return produce(state, (draft) => {
          draft.time.current++
          draft.time.session++
          draft.time.day++

          playingStorage.update({ [currentDate]: draft.time.day })
        })
      }),

    resetCurrentTime: () =>
      set((state) => {
        return produce(state, (draft) => {
          draft.time.current = 0
        })
      }),
  }
})
