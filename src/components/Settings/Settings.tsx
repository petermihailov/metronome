import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { MINMAX } from '../../constants';
import { useMetronomeStore } from '../../store/useMetronomeStore';
import { InputNumber } from '../InputNumber';
import { Range } from '../Range';

import classes from './Settings.module.css';

const Settings = () => {
  const { beats, subdivision, tempo, setBeatsAction, setSubdivisionAction, setTempoAction } =
    useMetronomeStore(
      useShallow(
        ({ beats, subdivision, tempo, setBeatsAction, setSubdivisionAction, setTempoAction }) => ({
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
    <div className={classes.settings}>
      <Range
        className={classes.bpm}
        label="tempo"
        max={MINMAX.tempo.max}
        min={MINMAX.tempo.min}
        value={tempo}
        onChange={setTempoAction}
      />

      <InputNumber
        label="beats"
        max={MINMAX.beats.max}
        min={MINMAX.beats.min}
        value={beats}
        onChange={setBeatsAction}
      />

      <InputNumber
        label="subdivision"
        max={MINMAX.subdivision.max}
        min={MINMAX.subdivision.min}
        value={subdivision}
        onChange={setSubdivisionAction}
      />
    </div>
  );
};

export default memo(Settings);
