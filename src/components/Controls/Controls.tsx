import clsx from 'clsx';
import { memo } from 'react';

import { tempoMax, tempoMin } from '../../constants';
import type { Groove } from '../../types/instrument';
import { ButtonShare } from '../ButtonShare';
import { Range } from '../Range';

import classes from './Controls.module.css';

export interface ControlsProps {
  className?: string;
  groove: Groove;
  onSetTempo: (tempo: number) => void;
  onTogglePlaying: () => void;
  playing: boolean;
}

const Controls = ({ className, groove, onSetTempo }: ControlsProps) => {
  return (
    <div className={clsx(className, classes.root)}>
      <div className={classes.row}>
        <Range
          className={classes.bpm}
          max={tempoMax}
          min={tempoMin}
          value={groove.tempo}
          onChange={onSetTempo}
        />
      </div>

      <div className={clsx(classes.row, classes.other)}>
        <ButtonShare />
      </div>
    </div>
  );
};

export default memo(Controls);
