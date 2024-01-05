import clsx from 'clsx';
import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { MINMAX } from '../../constants';
import { useMetronomeStore } from '../../store/useMetronomeStore';
import { InputNumber } from '../InputNumber';
import { InputRange } from '../InputRange';
import { Training } from '../Training';

import classes from './Settings.module.css';

const Settings = () => {
  const {
    isTraining,
    isPlaying,
    beats,
    subdivision,
    tempo,
    setBeatsAction,
    setSubdivisionAction,
    setTempoAction,
  } = useMetronomeStore(
    useShallow(
      ({
        beats,
        subdivision,
        tempo,
        isTraining,
        isPlaying,
        setBeatsAction,
        setSubdivisionAction,
        setTempoAction,
      }) => ({
        isTraining,
        isPlaying,
        beats,
        subdivision,
        tempo,
        setBeatsAction,
        setSubdivisionAction,
        setTempoAction,
      }),
    ),
  );

  return (
    <div
      className={clsx(classes.settings, {
        [classes.isTraining]: isTraining,
        [classes.isPlaying]: isPlaying,
      })}
    >
      <div className={classes.values}>
        <InputRange
          inputOnly={isTraining}
          max={MINMAX.tempo.max}
          min={MINMAX.tempo.min}
          title="tempo"
          value={tempo}
          onChange={setTempoAction}
        />

        <InputNumber
          max={MINMAX.beats.max}
          min={MINMAX.beats.min}
          title="beats"
          value={beats}
          onChange={setBeatsAction}
        />

        <InputNumber
          max={MINMAX.subdivision.max}
          min={MINMAX.subdivision.min}
          title="subdivision"
          value={subdivision}
          onChange={setSubdivisionAction}
        />
      </div>

      {isTraining && <Training className={classes.training} />}
    </div>
  );
};

export default memo(Settings);
