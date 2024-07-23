import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useMetronomeStore } from '../store/useMetronomeStore'

export const useWakeLock = () => {
  const refLockWindow = useRef<WakeLockSentinel>()

  const { isPlaying } = useMetronomeStore(useShallow(({ isPlaying }) => ({ isPlaying })))

  useEffect(() => {
    if ('wakeLock' in navigator) {
      if (isPlaying) {
        navigator.wakeLock.request('screen').then((res) => (refLockWindow.current = res))
      } else {
        refLockWindow.current?.release().then()
      }
    }
  }, [isPlaying])
}
