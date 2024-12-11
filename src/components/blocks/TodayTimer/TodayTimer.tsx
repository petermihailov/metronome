import { memo } from 'react'

import { usePlayingTimeStore } from '../../../store/usePlayingTimeStore'
import { timeFormat } from '../../../utils/format'

import classes from './TodayTimer.module.css'

const TodayTimer = () => {
  const { dayTime } = usePlayingTimeStore(({ time }) => ({ dayTime: timeFormat(time.day) }))

  return <time className={classes.todayTimer}>Total today: {dayTime}</time>
}

export default memo(TodayTimer)
