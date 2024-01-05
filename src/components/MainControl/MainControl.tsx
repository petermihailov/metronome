import clsx from 'clsx';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useShallow } from 'zustand/react/shallow';

import { useMetronomeStore } from '../../store/useMetronomeStore';
import { useTrainingStore } from '../../store/useTrainingStore';
import { timeFormat } from '../../utils/format';
import { ButtonIcon } from '../ButtonIcon';
import { ButtonPlay } from '../ButtonPlay';
import { Checkbox } from '../Checkbox';
import { useTraining } from '../Training/useTraining';

import classes from './MainControl.module.css';

const MainControl = () => {
  const { isPlaying, isTraining, setIsPlayingAction, setIsTrainingAction } = useMetronomeStore(
    useShallow(({ isPlaying, isTraining, setIsPlayingAction, setIsTrainingAction }) => ({
      isTraining,
      isPlaying,
      setIsPlayingAction,
      setIsTrainingAction,
    })),
  );

  const { currentTime } = useTrainingStore(
    useShallow(({ time }) => ({ currentTime: timeFormat(time.current) })),
  );

  const { playTraining } = useTraining();

  const handlePlay = () => {
    const isPlayingNew = !isPlaying;

    if (isPlayingNew && isTraining) {
      playTraining();
    } else {
      setIsPlayingAction(isPlayingNew);
    }
  };

  const {
    needRefresh: [isVisibleUpdate],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <div className={clsx(classes.mainControl, { [classes.isPlaying]: isPlaying })}>
      <div className={classes.playing}>
        <ButtonPlay
          active
          withoutHighlight
          className={classes.playButton}
          playing={isPlaying}
          onClick={handlePlay}
        />
        <span className={classes.time}>{currentTime}</span>
      </div>

      <div className={classes.helpers}>
        <Checkbox
          checked={isTraining}
          className={classes.training}
          disabled={isPlaying}
          label="training"
          onClick={() => setIsTrainingAction(!isTraining)}
        />
        {/*<ButtonIcon*/}
        {/*  aria-label="bluetooth input lag"*/}
        {/*  // className={classes.update}*/}
        {/*  icon="icon.bluetooth"*/}
        {/*  onClick={() => {}}*/}
        {/*/>*/}
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
