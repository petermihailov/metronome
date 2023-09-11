import { useEffect } from 'react';

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
