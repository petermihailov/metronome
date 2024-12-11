import { useEffect, useRef } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'
import { usePlayingTimeStore } from '../store/usePlayingTimeStore'

export const usePlayingTimeUpdate = () => {
  const refInterval = useRef<number>()

  const { isPlaying, isCounting } = useMetronomeStore(({ isPlaying, isCounting }) => ({
    isPlaying,
    isCounting,
  }))

  const { addSecondAction, resetCurrentTimeAction } = usePlayingTimeStore(
    ({ addSecondAction, resetCurrentTimeAction }) => ({ addSecondAction, resetCurrentTimeAction }),
  )

  useEffect(() => {
    if (isPlaying && !isCounting) {
      resetCurrentTimeAction()
      refInterval.current = window.setInterval(addSecondAction, 1000)
    }

    return () => {
      window.clearInterval(refInterval.current)
    }
  }, [addSecondAction, isCounting, isPlaying, resetCurrentTimeAction])
}
