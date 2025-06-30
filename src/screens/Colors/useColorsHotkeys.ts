import { useMemo } from 'react'
import type { HslColor } from 'react-colorful'

import type { HotkeysMap } from '../../hooks/useHotkeys'
import { useHotkeys } from '../../hooks/useHotkeys'
import { minMax } from '../../utils/math'

const stayInRange = (value: number, range: number) => {
  range = range + 1
  return ((value % range) + range) % range
}

interface Callbacks {
  setHslColor: (hsl: HslColor) => void
  nextColor: () => void
  prevColor: () => void
  resetColor: () => void
}

export const useColorsHotkeys = (hsl: HslColor, callbacks: Callbacks) => {
  const hotkeys: HotkeysMap = useMemo(() => {
    const increaseActiveValue = (increase: number) => () => {
      const name = (document.activeElement as HTMLInputElement)?.name

      switch (name) {
        case 'hue': {
          callbacks.setHslColor({ ...hsl, h: stayInRange(hsl.h + increase, 360) })
          break
        }

        case 'saturation': {
          callbacks.setHslColor({ ...hsl, s: minMax(hsl.s + increase, { min: 0, max: 100 }) })
          break
        }

        case 'lightness': {
          callbacks.setHslColor({ ...hsl, l: minMax(hsl.l + increase, { min: 0, max: 100 }) })
          break
        }
      }
    }

    return {
      // разные приращения децимальных значений:
      'alt+ArrowUp': increaseActiveValue(5),
      'alt+ArrowDown': increaseActiveValue(-5),
      'shift+ArrowUp': increaseActiveValue(10),
      'shift+ArrowDown': increaseActiveValue(-10),
      ArrowUp: increaseActiveValue(1),
      ArrowDown: increaseActiveValue(-1),
      ArrowLeft: callbacks.prevColor,
      ArrowRight: callbacks.nextColor,
      KeyR: callbacks.resetColor,
    }
  }, [callbacks, hsl])

  useHotkeys(hotkeys)
}
