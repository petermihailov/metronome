import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { Storage } from '../lib/LocalStorage'
import type { Screen } from '../screens'

const screenStorage = new Storage<{ current: Screen }>('screen', { current: 'main' })
const storage = screenStorage.get()

interface Store {
  screen: Screen
  setScreenAction: (screen: Screen) => void
}

export const useScreenStore = createWithEqualityFn<Store>((set) => {
  return {
    screen: storage.current,

    setScreenAction: (screen) => {
      set((state) => {
        return { ...state, screen }
      })

      screenStorage.update({ current: screen })
    },
  }
}, shallow)
