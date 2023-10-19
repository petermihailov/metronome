import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { rangeGenerator } from './Training.utils';
import { useBeatStore } from '../../store/useBeatStore';
import { useMetronomeStore } from '../../store/useMetronomeStore';

interface UseTrainingOptions {
  every: number;
  from: number;
  to: number;
  alternate?: boolean;
  onChange: (value: number) => void;
}

export const useTraining = ({ every, from, to, alternate, onChange }: UseTrainingOptions) => {
  const { notes, setIsPlayingAction } = useMetronomeStore(
    useShallow(({ notes, setIsPlayingAction }) => ({ notes, setIsPlayingAction })),
  );

  const { beat, barsPlayed } = useBeatStore(
    useShallow(({ beat, barsPlayed }) => ({ beat, barsPlayed })),
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const refTrainingGenerator = useRef<Generator<number>>();
  const refIsDecrease = useRef(from > to);

  const play = () => {
    setIsPlaying(true);
    setIsPlayingAction(true);
    refTrainingGenerator.current = rangeGenerator({ from, to });
  };

  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsPlayingAction(false);
  }, [setIsPlayingAction]);

  useEffect(() => {
    if (
      isPlaying &&
      beat.index === notes.length - 1 &&
      barsPlayed % every === 0 &&
      refTrainingGenerator.current
    ) {
      const { value, done } = refTrainingGenerator.current.next();

      console.log(value, to);

      if (value && !done) {
        if (value === to) {
          console.log('to');
        }

        if (value === from) {
          console.log('from');
        }

        onChange(value);
      } else {
        if (alternate) {
          if (!refIsDecrease.current) {
            // switch to decrease
            refTrainingGenerator.current = rangeGenerator({ from: to, to: from });
            refIsDecrease.current = true;
          } else {
            // switch to increase
            refTrainingGenerator.current = rangeGenerator({ from, to });
            refIsDecrease.current = false;
          }

          const { value, done } = refTrainingGenerator.current.next();
          if (value !== undefined && !done) onChange(value);
        } else {
          stop();
        }
      }
    }
  }, [alternate, barsPlayed, beat.index, every, from, isPlaying, notes.length, onChange, stop, to]);

  return {
    isPlaying,
    play,
    stop,
  };
};
