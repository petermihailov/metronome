import { useShallow } from 'zustand/react/shallow';

import { useMetronomeStore } from '../../store/useMetronomeStore';
import { useTrainingStore } from '../../store/useTrainingStore';
import { timeFormat } from '../../utils/format';
import { ButtonPlay } from '../ButtonPlay';

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

  return (
    <div className={classes.mainControl}>
      <ButtonPlay active playing={isPlaying} onClick={() => setIsPlayingAction(!isPlaying)} />
      <span className={classes.time}>{currentTime}</span>
    </div>
  );
};

export default MainControl;
