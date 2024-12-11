import { useEffect, useRef, useState } from 'react'

import { useBeatStore } from '../store/useBeatStore'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { usePlayingTimeStore } from '../store/usePlayingTimeStore'
import { useTrainingStore } from '../store/useTrainingStore'

export const usePlayingTimeUpdate = () => {
  const refInterval = useRef<number>()
  const [isTicking, setIsTicking] = useState<boolean>(false)

  const { isPlaying, isTraining } = useMetronomeStore(({ isPlaying, isTraining }) => ({
    isPlaying,
    isTraining,
  }))

  const { addSecond, resetCurrentTime } = usePlayingTimeStore(
    ({ addSecond, resetCurrentTime }) => ({ addSecond, resetCurrentTime }),
  )

  const count = useTrainingStore(({ count }) => count)
  const barsPlayed = useBeatStore(({ barsPlayed }) => barsPlayed)

  useEffect(() => {
    if (isPlaying) {
      resetCurrentTime()
    }
  }, [isPlaying, resetCurrentTime])

  useEffect(() => {
    if (isPlaying && (!isTraining || barsPlayed > count)) {
      setIsTicking(true)
    } else {
      setIsTicking(false)
    }
  }, [barsPlayed, count, isPlaying, isTraining])

  useEffect(() => {
    if (isTicking) {
      refInterval.current = window.setInterval(addSecond, 1000)
    }

    return () => {
      window.clearInterval(refInterval.current)
    }
  }, [addSecond, isTicking])
}
