import { useEffect, useRef } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'
import { useTickStore } from '../store/useTickStore'
import { useTrainingStore } from '../store/useTrainingStore'
import { rangeGenerator } from '../utils/training'

type Options = Partial<{
  onStop: () => void
}>

export const useTraining = ({ onStop }: Options = {}) => {
  const { every, from, to, step, setFromAction } = useTrainingStore(
    ({ every, from, to, step, setFromAction }) => ({
      every,
      from,
      to,
      step,
      setFromAction,
    }),
  )

  const { isPlaying, setTempoAction, tempo } = useMetronomeStore(
    ({ isPlaying, setIsPlayingAction, setTempoAction, tempo }) => ({
      isPlaying,
      setIsPlayingAction,
      setTempoAction,
      tempo,
    }),
  )

  const { isDownbeat, isSecond, isCounting, barsPlayed } = useTickStore(
    ({ counting, willBeScheduled }) => ({
      isDownbeat: willBeScheduled?.position.downbeat || false,
      isSecond: willBeScheduled?.position.idx === 1 || false,
      isCounting: willBeScheduled?.counting || counting,
      barsPlayed: willBeScheduled?.played.bars || 0,
    }),
  )

  const refTrainingGenerator = useRef<Generator<number>>()
  const refIsDecrease = useRef(from > to)
  const refDone = useRef<boolean | undefined>(undefined)

  // Handle play/stop
  useEffect(() => {
    if (isPlaying) {
      refTrainingGenerator.current = rangeGenerator({ from, to, step })
    } else {
      refIsDecrease.current = false
      refDone.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  // Update 'from'
  useEffect(() => {
    if (!isPlaying) {
      setFromAction(tempo)
    }
  }, [isPlaying, setFromAction, tempo])

  // Training loop
  // Изменяет значение на последнюю ноту последнего такта
  useEffect(() => {
    if (
      !isCounting &&
      isPlaying &&
      isDownbeat &&
      barsPlayed % every === 0 &&
      refTrainingGenerator.current
    ) {
      const { value, done } = refTrainingGenerator.current.next()
      refDone.current = done

      if (!done && value) {
        setTempoAction(value)
      }
    }
  }, [barsPlayed, every, isCounting, isDownbeat, isPlaying, setTempoAction])

  // stop callback
  useEffect(() => {
    if (!isCounting && isPlaying && isSecond && refDone.current) {
      onStop?.()
    }
  }, [isCounting, isSecond, isPlaying, onStop])
}
