import clsx from 'clsx'
import { memo } from 'react'

import { BarsCounter } from './BarsCounter'
import { BeatsCounter } from './BeatsCounter'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { useTickStore } from '../../../store/useTickStore'
import { useTrainingStore } from '../../../store/useTrainingStore'

export interface CounterProps {
  className?: string
}

const Counter = ({ className }: CounterProps) => {
  const { every } = useTrainingStore(({ every }) => ({ every }))
  const { barsPlayed, beat, isCounting } = useTickStore(({ position, played, counting }) => ({
    barsPlayed: played.bars,
    beat: position.beat,
    isCounting: counting,
  }))
  const { isTraining, isPlaying, beats } = useMetronomeStore(
    ({ isTraining, isPlaying, beats }) => ({
      beats,
      isTraining,
      isPlaying,
    }),
  )

  let currentBar = isCounting ? 0 : (barsPlayed % every) + 1
  if (!isPlaying) {
    currentBar = 1
  }

  return (
    <div className={clsx(className)}>
      {isTraining ? (
        <BarsCounter bar={currentBar} bars={every} />
      ) : (
        <BeatsCounter beats={beats} playing={isPlaying} value={beat || beats} />
      )}
    </div>
  )
}

export default memo(Counter)
