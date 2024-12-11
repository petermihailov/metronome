import { memo, useEffect, useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react'

import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { usePlayingTimeStore } from '../../../store/usePlayingTimeStore'
import { useTrainingStore } from '../../../store/useTrainingStore'
import { timeFormat } from '../../../utils/format'
import { ButtonIcon } from '../../ui/ButtonIcon'
import { ButtonPlay } from '../../ui/ButtonPlay'
import { Checkbox } from '../../ui/Checkbox'
import { calculateTime } from '../Settings/Training/Training.utils'

import classes from './MainControl.module.css'

const MainControl = () => {
  const { isPlaying, isTraining, setIsPlayingAction, setIsTrainingAction } = useMetronomeStore(
    ({ isPlaying, isTraining, setIsPlayingAction, setIsTrainingAction }) => ({
      isTraining,
      isPlaying,
      setIsPlayingAction,
      setIsTrainingAction,
    }),
  )

  const { every, to, step, type } = useTrainingStore(({ every, to, step, type }) => ({
    every,
    to,
    step,
    type,
  }))

  const { beats, subdivision, tempo } = useMetronomeStore(({ beats, subdivision, tempo }) => ({
    beats,
    subdivision,
    tempo,
  }))

  const [trainingTime, setTrainingTime] = useState('00:00')
  useEffect(() => {
    if (!isPlaying) {
      const from = { beats, tempo, subdivision }[type]
      const time = calculateTime({ key: type, from, to, every, tempo, beats, step })
      setTrainingTime(timeFormat(time))
    }
  }, [beats, subdivision, every, isPlaying, tempo, to, type, step])

  const currentTime = usePlayingTimeStore(({ time }) => timeFormat(time.current))

  const {
    needRefresh: [isVisibleUpdate],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <div className={classes.mainControl}>
      <div className={classes.playing}>
        <ButtonPlay
          active
          withoutHighlight
          className={classes.playButton}
          playing={isPlaying}
          onClick={() => setIsPlayingAction(!isPlaying)}
        />
        <span className={classes.time}>{currentTime}</span>
      </div>

      <div className={classes.actions}>
        <div className={classes.training} onClick={() => setIsTrainingAction(!isTraining)}>
          <Checkbox
            checked={isTraining}
            className={classes.trainingButton}
            disabled={isPlaying}
            label="training"
          />
          {isTraining && <time className={classes.trainingTime}>{trainingTime}</time>}
        </div>
        {isVisibleUpdate && (
          <ButtonIcon
            aria-label="update"
            className={classes.update}
            icon="icon.download"
            onClick={() => {
              window.localStorage.clear()
              updateServiceWorker()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default memo(MainControl)
