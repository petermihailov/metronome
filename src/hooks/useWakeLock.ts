import { useEffect, useRef } from 'react';

export const useWakeLock = (isLock: boolean) => {
  const refLockWindow = useRef<WakeLockSentinel>();

  useEffect(() => {
    if (isLock) {
      navigator.wakeLock.request('screen').then((res) => (refLockWindow.current = res));
      console.log('lock');
    } else {
      refLockWindow.current?.release().then(() => {
        console.log('release');
      });
    }
  }, [isLock]);
};
