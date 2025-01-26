import confetti from 'canvas-confetti'
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

const onStop = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['00eaff', 'ff357f'],
  }

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 50,
      scalar: 1.25,
      shapes: ['star'],
    })

    confetti({
      ...defaults,
      particleCount: 15,
      scalar: 1,
      shapes: ['circle'],
    })
  }

  shoot()

  setTimeout(shoot, Math.round(Math.random() * 100))
  setTimeout(shoot, 100 + Math.round(Math.random() * 100))
}

const App = () => {
  usePlayer()
  usePlayingTimeUpdate()
  useTraining({ onStop })
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
