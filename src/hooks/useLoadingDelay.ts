import { useState, useEffect, useRef } from 'react';

export const useLoadingDelay = (loading: boolean, minLoadingDuration = 200): boolean => {
  const timer = useRef<number>();
  const [state, setState] = useState<'PENDING' | 'EXPIRE'>('PENDING');

  useEffect(() => {
    if (loading) {
      setState('PENDING');
      window.clearTimeout(timer.current);

      timer.current = window.setTimeout(() => {
        setState('EXPIRE');
      }, minLoadingDuration);
    }
  }, [loading, minLoadingDuration, state]);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  return !(state === 'EXPIRE' && !loading);
};
