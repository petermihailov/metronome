import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { calculateTime, rangeGenerator } from './Training.utils';
import { useBeatStore } from '../../store/useBeatStore';
import { useMetronomeStore } from '../../store/useMetronomeStore';
import { useTrainingStore } from '../../store/useTrainingStore';
import { timeFormat } from '../../utils/format';

export const useTrainingTime = () => {
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
  const refFrom = useRef(from);
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

  // Handle play/stop
  useEffect(() => {
    if (isTraining) {
      if (isPlaying) {
        refFrom.current = from;
        refTrainingGenerator.current = rangeGenerator({ from, to });
      } else {
        refIsDecrease.current = false;
        onChange(refFrom.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isTraining]);

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
            refTrainingGenerator.current = rangeGenerator({ from: to, to: from });
            refIsDecrease.current = true;
          } else {
            refTrainingGenerator.current = rangeGenerator({ from, to });
            refIsDecrease.current = false;
          }

          const { value, done } = refTrainingGenerator.current.next();
          if (value !== undefined && !done) onChange(value);
        } else {
          // stop?
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
    to,
  ]);

  return {
    trainingTime,
  };
};
