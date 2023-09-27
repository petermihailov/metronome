import { useEffect } from 'react';

const tapTempo = {
  prev: 0,
  tap() {
    const now = Date.now();
    const delta = now - this.prev;
    this.prev = now;

    if (delta < 3_000) {
      return Math.round(60_000 / delta);
    }

    return null;
  },
};

export const useHotkeys = (
  tempo: number,
  setTempo: (tempo: number) => void,
  togglePlaying: () => void,
) => {
  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        togglePlaying();
      }

      if (event.code === 'KeyT') {
        const tap = tapTempo.tap();
        if (tap) setTempo(tap);
      }

      if (event.shiftKey) {
        if (event.code === 'ArrowUp') {
          setTempo(tempo + 10);
        }

        if (event.code === 'ArrowDown') {
          setTempo(tempo - 10);
        }
      } else {
        if (event.code === 'ArrowUp') {
          setTempo(tempo + 1);
        }

        if (event.code === 'ArrowDown') {
          setTempo(tempo - 1);
        }
      }
    };
    // event = keyup or keydown
    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [setTempo, tempo, togglePlaying]);
};
