import { useEffect, useRef } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'

export const useWakeLock = () => {
  const refLockWindow = useRef<WakeLockSentinel>()

  const isPlaying = useMetronomeStore(({ isPlaying }) => isPlaying)

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
