import { useEffect, useRef } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'

export function useAutoHideCursor() {
  const isPlaying = useMetronomeStore(({ isPlaying }) => isPlaying)
  const restored = useRef(false)

  useEffect(() => {
    if (!isPlaying) {
      document.body.style.removeProperty('cursor')
      return
    }

    // Скрываем курсор
    document.body.style.setProperty('cursor', 'none', 'important')
    restored.current = false

    const handleMouseMove = () => {
      if (restored.current) return
      restored.current = true
      document.body.style.removeProperty('cursor')
      window.removeEventListener('mousemove', handleMouseMove)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.style.removeProperty('cursor')
    }
  }, [isPlaying])
}
