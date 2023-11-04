import clsx from 'clsx';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useShallow } from 'zustand/react/shallow';

import { useMetronomeStore } from '../../store/useMetronomeStore';
import { useTrainingStore } from '../../store/useTrainingStore';
import { timeFormat } from '../../utils/format';
import { ButtonIcon } from '../ButtonIcon';
import { ButtonPlay } from '../ButtonPlay';
// import { Switch } from '../Switch';

import classes from './MainControl.module.css';

const MainControl = () => {
  const { isPlaying, setIsPlayingAction } = useMetronomeStore(
    useShallow(({ isPlaying, setIsPlayingAction }) => ({
      isPlaying,
      setIsPlayingAction,
    })),
  );

  const { currentTime } = useTrainingStore(
    useShallow(({ time }) => ({ currentTime: timeFormat(time.current) })),
  );

  const {
    needRefresh: [isVisibleUpdate],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <div className={classes.mainControl}>
      <div className={classes.playing}>
        <ButtonPlay
          active
          withoutHighlight
          className={clsx(classes.playButton, { [classes.isPlaying]: isPlaying })}
          playing={isPlaying}
          onClick={() => setIsPlayingAction(!isPlaying)}
        />
        <span className={classes.time}>{currentTime}</span>
      </div>

      <div className={classes.helpers}>
        {/*<Switch />*/}
        {isVisibleUpdate && (
          <ButtonIcon
            aria-label="update"
            className={classes.update}
            icon="icon.download"
            onClick={() => updateServiceWorker()}
          />
        )}
      </div>
    </div>
  );
};

export default MainControl;
