import { memo } from 'react'
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useShallow } from 'zustand/react/shallow'

import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { usePlayingTimeStore } from '../../../store/usePlayingTimeStore'
import { timeFormat } from '../../../utils/format'
import { ButtonIcon } from '../../ui/ButtonIcon'
import { ButtonPlay } from '../../ui/ButtonPlay'
import { Checkbox } from '../../ui/Checkbox'
import { useTraining } from '../Settings/Training/useTraining'

import classes from './MainControl.module.css'

const MainControl = () => {
  const { isPlaying, isTraining, setIsPlayingAction, setIsTrainingAction } = useMetronomeStore(
    useShallow(({ isPlaying, isTraining, setIsPlayingAction, setIsTrainingAction }) => ({
      isTraining,
      isPlaying,
      setIsPlayingAction,
      setIsTrainingAction,
    })),
  )

  // const stop = useCallback(() => {
  //   setIsPlayingAction(false);
  // }, [setIsPlayingAction]);

  const { trainingTime } = useTraining()

  const { currentTime } = usePlayingTimeStore(
    useShallow(({ time }) => ({ currentTime: timeFormat(time.current) })),
  )

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
            onClick={() => updateServiceWorker()}
          />
        )}
      </div>
    </div>
  )
}

export default memo(MainControl)