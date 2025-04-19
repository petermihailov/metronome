import React, { memo } from 'react'

import {
  useButtonsPreventSpacePress,
  useHotkeys,
  usePlayer,
  usePlayingTimeUpdate,
  useWakeLock,
} from '../../hooks'
import { useAutoHideCursor } from '../../hooks/useAutoHideCursor'
import { useQuerySync } from '../../hooks/useQuerySync'
import type { Screen as ScreenType } from '../../screens'
import { Main, Readme, Training, Polyrhythms, Colors, Preferences, Patterns } from '../../screens'
import { useScreenStore } from '../../store/useScreenStore'
import { Display } from '../blocks/Display'
import { MainControl } from '../blocks/MainControl'

import classes from './App.module.css'

const screenMap: Record<ScreenType, React.ComponentType> = {
  colors: Colors,
  main: Main,
  patterns: Patterns,
  polyrhythms: Polyrhythms,
  preferences: Preferences,
  readme: Readme,
  training: Training,
}

const App = () => {
  usePlayer()
  usePlayingTimeUpdate()
  useAutoHideCursor()
  useHotkeys()
  useWakeLock()
  useButtonsPreventSpacePress()
  useQuerySync()

  const screen = useScreenStore(({ screen }) => screen)
  const Screen = screenMap[screen]

  return (
    <div className={classes.app}>
      <Display />
      <MainControl />
      <Screen />
    </div>
  )
}

export default memo(App)
