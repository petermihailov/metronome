import { useShallow } from 'zustand/react/shallow';

import { useMetronomeStore } from '../../store/useMetronomeStore';
import { ButtonIcon } from '../ButtonIcon';
import { Range } from '../Range';

import classes from './DisplayBar.module.css';

const DisplayBar = () => {
  const { volume, setVolumeAction } = useMetronomeStore(
    useShallow(({ volume, setVolumeAction }) => ({
      volume,
      setVolumeAction,
    })),
  );

  return (
    <div className={classes.displayBar}>
      <div className={classes.volume}>
        <ButtonIcon aria-label="mute" icon="icon.volume" />
        <Range
          className={classes.range}
          value={100 * volume}
          onChange={(value) => {
            setVolumeAction(0.01 * value);
          }}
        />
      </div>
    </div>
  );
};

export default DisplayBar;
