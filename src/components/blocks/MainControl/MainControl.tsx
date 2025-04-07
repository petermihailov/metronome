import { memo } from 'react'
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react'

import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { usePlayingTimeStore } from '../../../store/usePlayingTimeStore'
import { timeFormat } from '../../../utils/format'
import { ButtonIcon } from '../../ui/ButtonIcon'
import { ButtonPlay } from '../../ui/ButtonPlay'
import { Counter } from '../Counter'
import { Indicator } from '../Indicator'

import classes from './MainControl.module.css'

const MainControl = () => {
  const { isPlaying, setIsPlayingAction } = useMetronomeStore(
    ({ isPlaying, setIsPlayingAction }) => ({
      isPlaying,
      setIsPlayingAction,
    }),
  )

  const currentTime = usePlayingTimeStore(({ time }) => timeFormat(time.current))

  const {
    needRefresh: [isVisibleUpdate],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <div className={classes.mainControl}>
      <div className={classes.playing}>
        <ButtonPlay playing={isPlaying} onClick={() => setIsPlayingAction(!isPlaying)} />
        <span className={classes.time}>{currentTime}</span>
      </div>

      <div className={classes.actions}>
        <div className={classes.counter}>
          <Counter />
          <Indicator />
        </div>

        {isVisibleUpdate && (
          <ButtonIcon
            aria-label="update"
            className={classes.update}
            icon="download"
            onClick={() => {
              updateServiceWorker()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default memo(MainControl)
