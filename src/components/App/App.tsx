import { memo } from 'react'

import {
  useButtonsPreventSpacePress,
  useHotkeys,
  usePlayer,
  useTrainingTimeUpdate,
  useWakeLock,
} from '../../hooks'
import { Display } from '../features/Display'
import { MainControl } from '../features/MainControl'
import { Settings } from '../features/Settings'
import { TodayTimer } from '../features/TodayTimer'

import classes from './App.module.css'

const App = () => {
  usePlayer()
  useTrainingTimeUpdate()
  useHotkeys()
  useWakeLock()
  useButtonsPreventSpacePress()

  return (
    <div className={classes.app}>
      <Display />
      <MainControl />
      <Settings />
      <TodayTimer />
    </div>
  )
}

export default memo(App)
