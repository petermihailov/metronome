import { useEffect, useRef, useState } from 'react';

import { timeFormat } from '../utils/time';

const defaults = { current: 0, session: 0 };

export const useTrainingTime = (isPlaying: boolean) => {
  const [elapsed, setElapsed] = useState(defaults);
  const refInterval = useRef<number>();

  useEffect(() => {
    const callback = () => {
      setElapsed((prev) => ({
        current: prev.current + 1,
        session: prev.session + 1,
      }));
    };

    if (isPlaying) {
      setElapsed((prev) => ({
        current: 0,
        session: prev.session,
      }));
      refInterval.current = window.setInterval(callback, 1000);
    }

    return () => {
      window.clearInterval(refInterval.current);
    };
  }, [isPlaying]);

  return {
    current: timeFormat(elapsed.current),
    session: timeFormat(elapsed.session),
  };
};
