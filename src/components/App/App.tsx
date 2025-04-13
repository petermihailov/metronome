import { memo } from 'react'

import { firework } from './firework'
import {
  useButtonsPreventSpacePress,
  useHotkeys,
  usePlayer,
  usePlayingTimeUpdate,
  useWakeLock,
  useTraining,
} from '../../hooks'
import { useAutoHideCursor } from '../../hooks/useAutoHideCursor'
import { useQuerySync } from '../../hooks/useQuerySync'
import { Display } from '../blocks/Display'
import { MainControl } from '../blocks/MainControl'
import { Settings } from '../blocks/Settings'

import classes from './App.module.css'

const App = () => {
  usePlayer()
  usePlayingTimeUpdate()
  useAutoHideCursor()
  useTraining({ onStop: firework })
  useHotkeys()
  useWakeLock()
  useButtonsPreventSpacePress()
  useQuerySync()

  return (
    <div className={classes.app}>
      <Display />
      <MainControl />
      <Settings />
    </div>
  )
}

export default memo(App)
