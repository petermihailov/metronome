import clsx from 'clsx'
import { memo } from 'react'

import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { usePlayingTimeStore } from '../../../store/usePlayingTimeStore'
import { timeFormat } from '../../../utils/format'

import classes from './TodayTimer.module.css'

const TodayTimer = () => {
  const { isTraining } = useMetronomeStore(({ isTraining }) => ({ isTraining }))
  const { dayTime } = usePlayingTimeStore(({ time }) => ({ dayTime: timeFormat(time.day) }))

  return (
    <time className={clsx(classes.todayTimer, { [classes.center]: isTraining })}>
      Total today: {dayTime}
    </time>
  )
}

export default memo(TodayTimer)
