import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { THEME_DEFAULTS } from '../constants'
import { Storage } from '../lib/LocalStorage'

const themeStorage = new Storage<{
  accent1: string
  accent2: string
  background: string
  backgroundApp: string
  border: string
  text: string
}>('colors', {
  accent1: THEME_DEFAULTS.accent1,
  accent2: THEME_DEFAULTS.accent2,
  background: THEME_DEFAULTS.background,
  backgroundApp: THEME_DEFAULTS.backgroundApp,
  border: THEME_DEFAULTS.border,
  text: THEME_DEFAULTS.text,
})

const storage = themeStorage.get()

interface Store {
  colors: {
    accent1: string
    accent2: string
    background: string
    backgroundApp: string
    border: string
    text: string
  }

  setColorAction: (
    key: 'accent1' | 'accent2' | 'background' | 'backgroundApp' | 'border' | 'text',
    color: string,
  ) => void

  resetColorsAction: () => void
}

export const useThemeStore = createWithEqualityFn<Store>((set) => {
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

      themeStorage.update({ [key]: color })
    },

    resetColorsAction: () => {
      set(() => ({
        colors: {
          accent1: THEME_DEFAULTS.accent1,
          accent2: THEME_DEFAULTS.accent2,
          background: THEME_DEFAULTS.background,
          backgroundApp: THEME_DEFAULTS.backgroundApp,
          border: THEME_DEFAULTS.border,
          text: THEME_DEFAULTS.text,
        },
      }))

      themeStorage.update({
        accent1: THEME_DEFAULTS.accent1,
        accent2: THEME_DEFAULTS.accent2,
        background: THEME_DEFAULTS.background,
        backgroundApp: THEME_DEFAULTS.backgroundApp,
        border: THEME_DEFAULTS.border,
        text: THEME_DEFAULTS.text,
      })
    },
  }
}, shallow)
