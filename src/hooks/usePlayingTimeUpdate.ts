import { useEffect, useRef } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'
import { usePlayingTimeStore } from '../store/usePlayingTimeStore'
import { useTickStore } from '../store/useTickStore'

export const usePlayingTimeUpdate = () => {
  const refInterval = useRef<number>()

  const isCounting = useTickStore(({ counting }) => counting)
  const isPlaying = useMetronomeStore(({ isPlaying }) => isPlaying)

  const { addSecondAction, resetCurrentTimeAction } = usePlayingTimeStore(
    ({ addSecondAction, resetCurrentTimeAction }) => ({ addSecondAction, resetCurrentTimeAction }),
  )

  useEffect(() => {
    if (isPlaying) {
      resetCurrentTimeAction()
    }

    return () => {
      window.clearInterval(refInterval.current)
    }
  }, [isPlaying, resetCurrentTimeAction])

  useEffect(() => {
    if (isPlaying && !isCounting) {
      refInterval.current = window.setInterval(addSecondAction, 1000)
    }

    return () => {
      window.clearInterval(refInterval.current)
    }
  }, [addSecondAction, isCounting, isPlaying])
}
