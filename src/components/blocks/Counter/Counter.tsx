import clsx from 'clsx'
import { memo } from 'react'

import { BarsCounter } from './BarsCounter'
import { BeatsCounter } from './BeatsCounter'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { useScreenStore } from '../../../store/useScreenStore'
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

  const screen = useScreenStore((state) => state.screen)
  const { isPlaying, beats } = useMetronomeStore(({ isPlaying, beats }) => ({
    beats,
    isPlaying,
  }))

  let currentBar = isCounting ? 0 : (barsPlayed % every) + 1
  if (!isPlaying) {
    currentBar = 1
  }

  return (
    <div className={clsx(className)}>
      {screen === 'training' ? (
        <BarsCounter bar={currentBar} bars={every} />
      ) : (
        <BeatsCounter beats={beats} playing={isPlaying} value={beat || beats} />
      )}
    </div>
  )
}

export default memo(Counter)
