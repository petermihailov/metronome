import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useMetronomeStore } from '../store/useMetronomeStore';

const tapTempo = {
  prev: 0,
  tap() {
    const now = Date.now();
    const delta = now - this.prev;
    this.prev = now;

    if (delta < 3_000) {
      const value = Math.round(60_000 / delta);
      return Math.round(value / 4) * 4;
    }

    return null;
  },
};

export const useHotkeys = () => {
  const { isPlaying, tempo, setIsPlayingAction, setTempoAction, resetAction, mute, setMuteAction } =
    useMetronomeStore(
      useShallow(
        ({
          isPlaying,
          tempo,
          setIsPlayingAction,
          setTempoAction,
          resetAction,
          mute,
          setMuteAction,
        }) => ({
          isPlaying,
          tempo,
          setIsPlayingAction,
          setTempoAction,
          resetAction,
          mute,
          setMuteAction,
        }),
      ),
    );

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsPlayingAction(!isPlaying);
      }

      if (event.code === 'KeyT') {
        const tap = tapTempo.tap();
        if (tap) setTempoAction(tap);
      }

      if (event.code === 'KeyR') {
        resetAction();
      }

      if (event.code === 'KeyM') {
        setMuteAction(!mute);
      }

      if (event.shiftKey) {
        if (event.code === 'ArrowUp') {
          setTempoAction(tempo + 10);
        }

        if (event.code === 'ArrowDown') {
          setTempoAction(tempo - 10);
        }
      } else {
        if (event.code === 'ArrowUp') {
          setTempoAction(tempo + 1);
        }

        if (event.code === 'ArrowDown') {
          setTempoAction(tempo - 1);
        }
      }
    };
    // event = keyup or keydown
    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [isPlaying, mute, resetAction, setIsPlayingAction, setMuteAction, setTempoAction, tempo]);
};
