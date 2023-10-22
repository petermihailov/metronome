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
import { Training } from '../Training';
import { UpdatePrompt } from '../UpdatePrompt';

import classes from './App.module.css';

const App = () => {
  usePlayer();
  useTrainingTimeUpdate();
  useHotkeys();
  useWakeLock();
  useButtonsPreventSpacePress();

  return (
    <div className={classes.root}>
      <Display />
      <MainControl />
      <Settings />
      <TodayTimer />
      <Training />
      <UpdatePrompt />
    </div>
  );
};

export default memo(App);
