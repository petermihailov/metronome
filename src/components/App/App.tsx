import React, { memo } from 'react'

import {
  useAutoHideCursor,
  useButtonsPreventSpacePress,
  usePlayingTimeUpdate,
  useQuerySync,
  useWakeLock,
  usePlayer,
} from '../../hooks'
import type { Screen as ScreenType } from '../../screens'
import { Main, Readme, Training, Polyrhythms, Colors, Preferences, Patterns } from '../../screens'
import { useScreenStore } from '../../store/useScreenStore'

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
  useWakeLock()
  useButtonsPreventSpacePress()
  useQuerySync()

  const screen = useScreenStore(({ screen }) => screen)
  const Screen = screenMap[screen]

  return (
    <div className={classes.app}>
      <Screen />
    </div>
  )
}

export default memo(App)
