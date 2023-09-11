import { memo } from 'react';

import { tempoMax, tempoMin } from '../../constants';
import { ButtonPlay } from '../ButtonPlay';
import { InputNumber } from '../InputNumber';
import { Range } from '../Range';

import classes from './Settings.module.css';

export interface SettingsProps {
  beatsPerBar: number;
  isPlaying: boolean;
  setBeats: (beats: number) => void;
  setSubdivision: (subdivision: number) => void;
  setTempo: (tempo: number) => void;
  subdivision: number;
  tempo: number;
  togglePlaying: () => void;
}

const Settings = ({
  beatsPerBar,
  isPlaying,
  setBeats,
  setSubdivision,
  setTempo,
  subdivision,
  tempo,
  togglePlaying,
}: SettingsProps) => {
  return (
    <div className={classes.settings}>
      <div className={classes.tempo}>
        <ButtonPlay active playing={isPlaying} onClick={togglePlaying} />
        <Range
          className={classes.bpm}
          max={tempoMax}
          min={tempoMin}
          value={tempo}
          onChange={setTempo}
        />
      </div>

      <InputNumber label="beats" min={1} value={beatsPerBar} onChange={setBeats} />
      <InputNumber label="subdivision" min={1} value={subdivision} onChange={setSubdivision} />
    </div>
  );
};

export default memo(Settings);
