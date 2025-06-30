import { useEffect, useRef } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'

export function useAutoHideCursor() {
  const timerRef = useRef<number | null>(null)
  const isPlaying = useMetronomeStore((state) => state.isPlaying)

  useEffect(() => {
    if (!isPlaying) {
      document.body.style.removeProperty('cursor')
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      return
    }

    const hideCursor = () => {
      document.body.style.setProperty('cursor', 'none', 'important')
    }

    const resetCursorTimer = () => {
      document.body.style.removeProperty('cursor')
      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = window.setTimeout(() => {
        if (isPlaying) hideCursor()
      }, 3000)
    }

    hideCursor()
    window.addEventListener('mousemove', resetCursorTimer)

    return () => {
      window.removeEventListener('mousemove', resetCursorTimer)
      document.body.style.removeProperty('cursor')
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isPlaying])
}
