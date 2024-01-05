import { memo } from 'react';

import {
  useButtonsPreventSpacePress,
  useHotkeys,
  usePlayer,
  useTrainingTimeUpdate,
  useWakeLock,
} from '../../hooks';
import { Display } from '../Display';
import { MainControl } from '../MainControl';
import { Settings } from '../Settings';
import { TodayTimer } from '../TodayTimer';

import classes from './App.module.css';

const App = () => {
  usePlayer();
  useTrainingTimeUpdate();
  useHotkeys();
  useWakeLock();
  useButtonsPreventSpacePress();

  return (
    <div className={classes.app}>
      <Display />
      <MainControl />
      <Settings />
      <TodayTimer />
    </div>
  );
};

export default memo(App);
