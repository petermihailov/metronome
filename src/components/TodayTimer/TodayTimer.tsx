import { useShallow } from 'zustand/react/shallow';

import { usePlayingTimeStore } from '../../store/usePlayingTimeStore';
import { timeFormat } from '../../utils/format';

import classes from './TodayTimer.module.css';

const TodayTimer = () => {
  const { dayTime } = usePlayingTimeStore(
    useShallow(({ time }) => ({ dayTime: timeFormat(time.day) })),
  );

  return <time className={classes.todayTimer}>Total today: {dayTime}</time>;
};

export default TodayTimer;
