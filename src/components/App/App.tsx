import { memo, useRef } from 'react'

import {
  useButtonsPreventSpacePress,
  useHotkeys,
  usePlayer,
  usePlayingTimeUpdate,
  useWakeLock,
  useTraining,
  useScale,
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

  const container = useRef<HTMLDivElement>(null)
  useScale(container)

  return (
    <div ref={container} className={classes.app}>
      <Display />
      <MainControl />
      <Settings />
    </div>
  )
}

export default memo(App)
