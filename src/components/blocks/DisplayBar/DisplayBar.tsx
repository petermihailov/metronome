import clsx from 'clsx'
import { memo, useEffect, useRef, useState } from 'react'

import { useTrainingTime } from '../../../hooks/useTrainingTime'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { usePlayingTimeStore } from '../../../store/usePlayingTimeStore'
import { useTickStore } from '../../../store/useTickStore'
import { timeFormat } from '../../../utils/format'
import { ButtonCounting } from '../../ui/ButtonCounting'
import { ButtonIcon } from '../../ui/ButtonIcon'

import classes from './DisplayBar.module.css'

const duration = 800

const DisplayBar = () => {
  const { dayTime } = usePlayingTimeStore(({ time }) => ({ dayTime: timeFormat(time.day) }))
  const trainingTime = useTrainingTime(timeFormat) as string
  const segmentRef = useRef<HTMLDivElement>(null)

  const [messageIsVisible, setMessageIsVisible] = useState(false)

  const { count, isPlaying, isTraining, setCountAction, setIsTrainingAction } = useMetronomeStore(
    ({ count, isPlaying, isTraining, setCountAction, setIsTrainingAction }) => ({
      count,
      isPlaying,
      isTraining,
      setCountAction,
      setIsTrainingAction,
    }),
  )

  const time = isTraining ? trainingTime : dayTime
  const timeLabel = isTraining ? 'training time' : 'total today'
  const displayText = messageIsVisible ? 'copied' : time

  const { barsPlayed } = useTickStore(({ played }) => ({
    barsPlayed: played.bars,
  }))

  const playedCountingBars = barsPlayed < 0 ? count + barsPlayed : count

  useEffect(() => {
    if (messageIsVisible && segmentRef.current) {
      segmentRef.current.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }],
        {
          duration: duration,
          fill: 'backwards',
        },
      )
    }
  }, [messageIsVisible])

  return (
    <div
      className={clsx(classes.displayBar, {
        [classes.isPlaying]: isPlaying,
        [classes.isTraining]: isTraining,
      })}
    >
      <div className={classes.left}>
        <ButtonIcon
          withoutDisabledOpacity
          // withoutHighlight
          aria-label="copy link"
          className={classes.icon}
          disabled={isPlaying}
          icon="share"
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard
                // ToDo - положи ссылку в env
                .writeText(`https://petermihailov.github.io/metronome/${window.location.search}`)
                .then(() => {
                  setMessageIsVisible(true)
                  window.setTimeout(() => {
                    setMessageIsVisible(false)
                  }, duration)
                })
                .catch()
            }
          }}
        />
        <div ref={segmentRef} className={classes.segment} title={timeLabel}>
          <span className={classes.segmentPlaceholder}>
            {displayText.replace(/[a-z0-9]/g, '8')}
          </span>
          <span className={classes.time}>{displayText}</span>
        </div>
      </div>
      <div className={classes.right}>
        <ButtonCounting
          withoutDisabledOpacity
          // withoutHighlight
          count={count}
          disabled={isPlaying}
          isPlaying={isPlaying}
          played={playedCountingBars}
          onClick={() => setCountAction(count === 4 ? 0 : count + 1)}
        />
        <ButtonIcon
          withoutDisabledOpacity
          // withoutHighlight
          aria-label="toggle training"
          className={clsx(classes.icon, { [classes.iconActive]: isTraining })}
          disabled={isPlaying}
          icon="training"
          onClick={() => setIsTrainingAction(!isTraining)}
        />
      </div>
    </div>
  )
}

export default memo(DisplayBar)
