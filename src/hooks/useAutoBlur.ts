import { useEffect } from 'react'

const TIMEOUT = 3_500 // ms

// Снимает фокус с активного элемента через timeout мс после последнего взаимодействия
export function useAutoBlur(timeout = TIMEOUT) {
  useEffect(() => {
    let timeoutId: number | undefined

    const blurActive = () => {
      const el = document.activeElement

      if (el instanceof HTMLElement && el !== document.body) {
        el.blur()
      }
    }

    const resetTimer = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(blurActive, timeout)
    }

    // capture: чтобы stopPropagation в обработчиках компонентов не глушил продление таймера
    const events = ['pointerup', 'focusin', 'keydown', 'input'] as const
    events.forEach((name) => document.addEventListener(name, resetTimer, true))

    return () => {
      window.clearTimeout(timeoutId)
      events.forEach((name) => document.removeEventListener(name, resetTimer, true))
    }
  }, [timeout])
}
