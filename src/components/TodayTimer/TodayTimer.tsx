import { useShallow } from 'zustand/react/shallow';

import { useTrainingStore } from '../../store/useTrainingStore';
import { timeFormat } from '../../utils/format';

import classes from './TodayTimer.module.css';

const TodayTimer = () => {
  const { dayTime } = useTrainingStore(
    useShallow(({ time }) => ({ dayTime: timeFormat(time.day) })),
  );

  return <time className={classes.root}>{dayTime}</time>;
};

export default TodayTimer;
