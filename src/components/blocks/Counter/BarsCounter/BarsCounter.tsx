import clsx from 'clsx'
import { memo } from 'react'

import classes from './BarsCounter.module.css'

export interface BarsCounterProps {
  className?: string
  bar: number
  bars: number
}

const BarsCounter = ({ className, bar, bars }: BarsCounterProps) => {
  return (
    <div className={clsx(className, classes.barsCounter)}>
      {bar === 0 ? '-' : bar}
      <span className={classes.bars}>{bars}</span>
    </div>
  )
}

export default memo(BarsCounter)
