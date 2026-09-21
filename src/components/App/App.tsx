import React, { memo } from 'react'

import {
  useButtonsPreventSpacePress,
  useHotkeys,
  usePlayer,
  usePlayingTimeUpdate,
  useWakeLock,
} from '../../hooks'
import { useAutoBlur } from '../../hooks/useAutoBlur'
import { useAutoHideCursor } from '../../hooks/useAutoHideCursor'
import { useQuerySync } from '../../hooks/useQuerySync'
import type { Screen as ScreenType } from '../../screens'
import {
  Main,
  Readme,
  Training,
  Polyrhythms,
  Colors,
  Preferences,
  Patterns,
  Silence,
} from '../../screens'
import { useScreenStore } from '../../store/useScreenStore'
// Импорт ради побочного эффекта: при инициализации стор создаёт ключ colors в LS с дефолтными цветами
import '../../store/useThemeStore'
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
  silence: Silence,
  training: Training,
}

const App = () => {
  usePlayer()
  usePlayingTimeUpdate()
  useAutoHideCursor()
  useAutoBlur()
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
