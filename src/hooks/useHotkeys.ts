import { useEffect } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'
import { useScreenStore } from '../store/useScreenStore'

const tapTempo = {
  prev: 0,
  tap() {
    const now = Date.now()
    const delta = now - this.prev
    this.prev = now

    if (delta < 3_000) {
      const value = Math.round(60_000 / delta)
      return Math.round(value / 4) * 4
    }

    return null
  },
}

export const useHotkeys = () => {
  const screen = useScreenStore((state) => state.screen)
  const { isPlaying, tempo, setIsPlayingAction, setTempoAction, resetAction } = useMetronomeStore(
    ({ isPlaying, tempo, setIsPlayingAction, setTempoAction, resetAction }) => ({
      isPlaying,
      tempo,
      setIsPlayingAction,
      setTempoAction,
      resetAction,
    }),
  )

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsPlayingAction(!isPlaying)
      }

      if (!(screen === 'training' && isPlaying)) {
        const noModifiers = !event.shiftKey && !event.metaKey && !event.altKey && !event.ctrlKey

        if (event.code === 'KeyT') {
          const tap = tapTempo.tap()
          if (tap) setTempoAction(tap)
        }

        if (noModifiers && event.code === 'KeyR') {
          resetAction()
        }

        if (event.altKey) {
          if (event.code === 'ArrowUp') {
            setTempoAction(tempo + 5)
          }

          if (event.code === 'ArrowDown') {
            setTempoAction(tempo - 5)
          }
        } else if (event.shiftKey) {
          if (event.code === 'ArrowUp') {
            setTempoAction(tempo + 10)
          }

          if (event.code === 'ArrowDown') {
            setTempoAction(tempo - 10)
          }
        } else {
          if (event.code === 'ArrowUp') {
            setTempoAction(tempo + 1)
          }

          if (event.code === 'ArrowDown') {
            setTempoAction(tempo - 1)
          }
        }
      }
    }

    document.addEventListener('keydown', callback)

    return () => {
      document.removeEventListener('keydown', callback)
    }
  }, [isPlaying, resetAction, screen, setIsPlayingAction, setTempoAction, tempo])
}
