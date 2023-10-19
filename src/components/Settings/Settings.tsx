import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { MINMAX } from '../../constants';
import { useMetronomeStore } from '../../store/useMetronomeStore';
import { useTrainingStore } from '../../store/useTrainingStore';
import { timeFormat } from '../../utils/format';
import { ButtonPlay } from '../ButtonPlay';
import { InputNumber } from '../InputNumber';
import { Range } from '../Range';

import classes from './Settings.module.css';

const Settings = () => {
  const {
    beats,
    isPlaying,
    subdivision,
    tempo,
    setBeatsAction,
    setIsPlayingAction,
    setSubdivisionAction,
    setTempoAction,
  } = useMetronomeStore(
    useShallow(
      ({
        beats,
        isPlaying,
        subdivision,
        tempo,
        setBeatsAction,
        setIsPlayingAction,
        setSubdivisionAction,
        setTempoAction,
      }) => ({
        beats,
        isPlaying,
        subdivision,
        tempo,
        setBeatsAction,
        setIsPlayingAction,
        setSubdivisionAction,
        setTempoAction,
      }),
    ),
  );

  const { currentTime } = useTrainingStore(
    useShallow(({ time }) => ({ currentTime: timeFormat(time.current) })),
  );

  return (
    <div className={classes.settings}>
      <div className={classes.player}>
        <ButtonPlay active playing={isPlaying} onClick={() => setIsPlayingAction(!isPlaying)} />
        <span className={classes.time}>{currentTime}</span>
      </div>

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
