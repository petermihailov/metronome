import clsx from 'clsx'
import { memo } from 'react'

import { BarsCounter } from './BarsCounter'
import { BeatsCounter } from './BeatsCounter'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { useScreenStore } from '../../../store/useScreenStore'
import { useSilenceStore } from '../../../store/useSilenceStore'
import { useTickStore } from '../../../store/useTickStore'
import { useTrainingStore } from '../../../store/useTrainingStore'

export interface CounterProps {
  className?: string
}

const Counter = ({ className }: CounterProps) => {
  const { every } = useTrainingStore(({ every }) => ({ every }))
  const { play, mute } = useSilenceStore(({ play, mute }) => ({ play, mute }))
  const { barsPlayed, beat, isCounting, isMuted } = useTickStore(
    ({ position, played, counting, muted }) => ({
      barsPlayed: played.bars,
      beat: position.beat,
      isCounting: counting,
      isMuted: muted,
    }),
  )

  const screen = useScreenStore((state) => state.screen)
  const { isPlaying, beats } = useMetronomeStore(({ isPlaying, subdivisions }) => ({
    beats: subdivisions.length,
    isPlaying,
  }))

  let currentBar = isCounting ? 0 : (barsPlayed % every) + 1
  if (!isPlaying) {
    currentBar = 1
  }

  // В режиме тишины считаем такты внутри цикла «играем + молчим»; в тишине значение заморожено стором
  const silenceBars = play + mute
  let silenceBar = isCounting ? 0 : (barsPlayed % silenceBars) + 1
  if (!isPlaying) {
    silenceBar = 1
  }

  return (
    <div className={clsx(className)}>
      {screen === 'training' ? (
        <BarsCounter bar={currentBar} bars={every} />
      ) : screen === 'silence' ? (
        <BarsCounter bar={isMuted ? null : silenceBar} bars={silenceBars} />
      ) : (
        <BeatsCounter beats={beats} playing={isPlaying && !isMuted} value={beat || beats} />
      )}
    </div>
  )
}

export default memo(Counter)
