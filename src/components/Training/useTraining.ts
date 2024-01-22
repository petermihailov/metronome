import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { calculateTime, rangeGenerator } from './Training.utils';
import { useBeatStore } from '../../store/useBeatStore';
import { useMetronomeStore } from '../../store/useMetronomeStore';
import { useTrainingStore } from '../../store/useTrainingStore';
import { timeFormat } from '../../utils/format';

export const useTraining = () => {
  const [trainingTime, setTrainingTime] = useState('00:00');

  const { alternate, every, from, to, type, setFrom } = useTrainingStore(
    useShallow(({ alternate, every, from, to, type, setFrom }) => ({
      alternate,
      every,
      from,
      to,
      type,
      setFrom,
    })),
  );

  const {
    beats,
    isPlaying,
    isTraining,
    notes,
    setBeatsAction,
    setIsPlayingAction,
    setSubdivisionAction,
    setTempoAction,
    subdivision,
    tempo,
  } = useMetronomeStore(
    useShallow(
      ({
        beats,
        isPlaying,
        isTraining,
        notes,
        setBeatsAction,
        setIsPlayingAction,
        setSubdivisionAction,
        setTempoAction,
        subdivision,
        tempo,
      }) => ({
        beats,
        isPlaying,
        isTraining,
        notes,
        setBeatsAction,
        setIsPlayingAction,
        setSubdivisionAction,
        setTempoAction,
        subdivision,
        tempo,
      }),
    ),
  );

  const { beat, barsPlayed } = useBeatStore(
    useShallow(({ beat, barsPlayed }) => ({ beat, barsPlayed })),
  );

  const refTrainingGenerator = useRef<Generator<number>>();
  const refIsDecrease = useRef(from > to);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    {
      tempo: setTempoAction,
      subdivision: setSubdivisionAction,
      beats: setBeatsAction,
    }[type],
    [type],
  );

  const playTraining = () => {
    refTrainingGenerator.current = rangeGenerator({ from, to });
    setIsPlayingAction(true);
  };

  const stop = useCallback(() => {
    setIsPlayingAction(false);
  }, [setIsPlayingAction]);

  // Update 'from'
  useEffect(() => {
    if (!isPlaying && isTraining) {
      setFrom({ beats, tempo, subdivision }[type]);
    }
  }, [beats, tempo, subdivision, isTraining, isPlaying, type, setFrom]);

  //Calculate time
  useEffect(() => {
    if (!isPlaying) {
      const from = { beats, tempo, subdivision }[type];
      const time = calculateTime({ key: type, from, to, every, tempo, beats });
      setTrainingTime(timeFormat(time));
    }
  }, [beats, subdivision, every, isPlaying, tempo, to, type]);

  // Training loop
  useEffect(() => {
    if (
      isTraining &&
      isPlaying &&
      beat.index === notes.length - 1 &&
      barsPlayed % every === 0 &&
      refTrainingGenerator.current
    ) {
      const { value, done } = refTrainingGenerator.current.next();

      if (value && !done) {
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
          // stop();
        }
      }
    }
  }, [
    alternate,
    barsPlayed,
    beat.index,
    every,
    from,
    isPlaying,
    isTraining,
    notes.length,
    onChange,
    stop,
    to,
  ]);

  return {
    trainingTime,
    playTraining,
  };
};
