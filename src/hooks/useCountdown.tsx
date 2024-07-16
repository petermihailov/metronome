import { useRef, useState } from 'react';

export const useCountdown = () => {
  const refTimeout = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countDown, setCountDown] = useState(0);

  const stop = () => {
    setIsPlaying(false);
    window.clearTimeout(refTimeout.current);
    setCountDown(0);
  };

  const start = (seconds: number) => {
    window.clearTimeout(refTimeout.current);
    setIsPlaying(true);

    function callback() {
      refTimeout.current = window.setTimeout(() => {
        if (seconds > 0) {
          setCountDown(--seconds);
          callback();
        } else {
          stop();
        }
      }, 1000);
    }

    callback();
  };

  const pause = () => {
    setIsPlaying(false);
    window.clearTimeout(refTimeout.current);
  };

  return {
    isPlaying,
    countDown: {
      minutes: Math.floor((countDown % (60 * 60)) / 60),
      seconds: Math.floor(countDown % 60),
    },
    start,
    pause,
    stop,
  };
};
