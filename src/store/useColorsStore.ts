import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { COLORS_DEFAULTS } from '../constants'
import { Storage } from '../lib/LocalStorage'
import type { ColorName } from '../types/colors'

const colorsStorage = new Storage<typeof COLORS_DEFAULTS>('colors', { ...COLORS_DEFAULTS })
const storage = colorsStorage.get()

interface Store {
  colors: typeof COLORS_DEFAULTS
  setColorAction: (key: ColorName, color: string) => void
  resetColorsAction: (key?: ColorName) => void
}

export const useColorsStore = createWithEqualityFn<Store>((set) => {
  return {
    colors: {
      accent1: storage.accent1,
      accent2: storage.accent2,
      background: storage.background,
      backgroundApp: storage.backgroundApp,
      border: storage.border,
      text: storage.text,
    },

    setColorAction: (key, color) => {
      set((state) => {
        return { ...state, colors: { ...state.colors, [key]: color } }
      })

      colorsStorage.update({ [key]: color })
    },

    resetColorsAction: (key) => {
      if (key) {
        set((state) => ({ ...state, colors: { ...state.colors, [key]: COLORS_DEFAULTS[key] } }))
        colorsStorage.update({ [key]: COLORS_DEFAULTS[key] })
      } else {
        set((state) => ({ ...state, colors: { ...COLORS_DEFAULTS } }))
        colorsStorage.update({ ...COLORS_DEFAULTS })
      }
    },
  }
}, shallow)
