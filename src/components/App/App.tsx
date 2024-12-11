import { memo } from 'react'

import {
  useButtonsPreventSpacePress,
  useHotkeys,
  usePlayer,
  usePlayingTimeUpdate,
  useWakeLock,
  useTraining,
} from '../../hooks'
import { Display } from '../blocks/Display'
import { MainControl } from '../blocks/MainControl'
import { Settings } from '../blocks/Settings'

import classes from './App.module.css'

const App = () => {
  usePlayer()
  usePlayingTimeUpdate()
  useTraining()
  useHotkeys()
  useWakeLock()
  useButtonsPreventSpacePress()

  return (
    <div className={classes.app}>
      <Display />
      <MainControl />
      <Settings />
    </div>
  )
}

export default memo(App)
