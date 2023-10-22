import { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import type { TrainingType } from './Training.types';
import { calculateTime } from './Training.utils';
import { useTraining } from './useTraining';
import { MINMAX } from '../../constants';
import { useMetronomeStore } from '../../store/useMetronomeStore';
import { timeFormat } from '../../utils/format';
import { ButtonPlay } from '../ButtonPlay';
import { InputNumber } from '../InputNumber';

import classes from './Training.module.css';

const typeValues: TrainingType[] = ['subdivision', 'tempo', 'beats'];

const Training = () => {
  const { beats, tempo, setBeatsAction, setSubdivisionAction, setTempoAction } = useMetronomeStore(
    useShallow(({ beats, tempo, setBeatsAction, setSubdivisionAction, setTempoAction }) => ({
      beats,
      tempo,
      setBeatsAction,
      setSubdivisionAction,
      setTempoAction,
    })),
  );

  const [type, setType] = useState<TrainingType>(typeValues[0]);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(12);
  const [every, setEvery] = useState(4);
  const [alternate, setAlternate] = useState(false);
  const [time, setTime] = useState('02:40');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    {
      tempo: setTempoAction,
      subdivision: setSubdivisionAction,
      beats: setBeatsAction,
    }[type],
    [type],
  );

  const toggle = () => {
    if (isPlaying) stop();
    else {
      onChange(from);
      setTimeout(play, 100);
    }
  };

  const { isPlaying, play, stop } = useTraining({
    alternate,
    from,
    to,
    every,
    onChange,
  });

  /** Calculate time */
  useEffect(() => {
    if (!isPlaying) {
      const time = calculateTime({ key: type, from, to, every, tempo, beats });
      setTime(timeFormat(time));
    }
  }, [beats, every, from, isPlaying, tempo, to, type]);

  /** Start/Stop training */
  useEffect(() => {
    if (isPlaying) {
      onChange(from);
    }
  }, [from, isPlaying, onChange]);

  // useEffect(() => {
  //   setFrom({ tempo, subdivision, beats }[type]);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [type]);

  return (
    <div className={classes.training} style={{ display: 'none' }}>
      <ButtonPlay playing={isPlaying} onClick={toggle} />
      change
      <select
        className={classes.select}
        value={type}
        onChange={(e) => setType(e.target.value as TrainingType)}
      >
        {typeValues.map((prop) => (
          <option key={prop} value={prop}>
            {prop}
          </option>
        ))}
      </select>
      from
      <InputNumber max={MINMAX[type].max} min={MINMAX[type].min} value={from} onChange={setFrom} />
      to
      <InputNumber max={MINMAX[type].max} min={MINMAX[type].min} value={to} onChange={setTo} />
      every
      <InputNumber max={12} min={1} value={every} onChange={setEvery} />
      bars
      <input checked={alternate} type="checkbox" onChange={(e) => setAlternate(e.target.checked)} />
      alternate
      <time>{time}</time>
      {/*<div>{current}</div>*/}
    </div>
  );
};

export default Training;
