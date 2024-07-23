import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useMetronomeStore } from '../store/useMetronomeStore'
import { usePlayingTimeStore } from '../store/usePlayingTimeStore'

export const useTrainingTimeUpdate = () => {
  const refInterval = useRef<number>()

  const { isPlaying } = useMetronomeStore(useShallow(({ isPlaying }) => ({ isPlaying })))

  const { addSecond, resetCurrentTime } = usePlayingTimeStore(
    useShallow(({ addSecond, resetCurrentTime }) => ({ addSecond, resetCurrentTime })),
  )

  useEffect(() => {
    if (isPlaying) {
      resetCurrentTime()
      refInterval.current = window.setInterval(addSecond, 1000)
    }

    return () => {
      window.clearInterval(refInterval.current)
    }
  }, [addSecond, isPlaying, resetCurrentTime])
}
