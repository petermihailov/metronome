import { useCallback, useEffect, useRef } from 'react'

import { rangeGenerator } from '../components/blocks/Settings/Training/Training.utils'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useTickStore } from '../store/useTickStore'
import { useTrainingStore } from '../store/useTrainingStore'

type Options = Partial<{
  onStop: () => void
}>

export const useTraining = ({ onStop }: Options = {}) => {
  const { every, from, to, step, type, setFromAction } = useTrainingStore(
    ({ every, from, to, step, type, setFromAction }) => ({
      every,
      from,
      to,
      step,
      type,
      setFromAction,
    }),
  )

  const {
    applyGridAlignmentAction,
    beats,
    isPlaying,
    isTraining,
    setBeatsAction,
    setSubdivisionAction,
    setTempoAction,
    subdivision,
    tempo,
  } = useMetronomeStore(
    ({
      applyGridAlignmentAction,
      beats,
      isPlaying,
      isTraining,
      setBeatsAction,
      setIsPlayingAction,
      setSubdivisionAction,
      setTempoAction,
      subdivision,
      tempo,
    }) => ({
      applyGridAlignmentAction,
      beats,
      isPlaying,
      isTraining,
      setBeatsAction,
      setIsPlayingAction,
      setSubdivisionAction,
      setTempoAction,
      subdivision,
      tempo,
    }),
  )

  const { isFirst, isSecond, isCounting, barsPlayed } = useTickStore(
    ({ counting, willBeScheduled }) => ({
      isFirst: willBeScheduled?.position.first || false,
      isSecond: willBeScheduled?.position.idx === 1 || false,
      isCounting: willBeScheduled?.counting || counting,
      barsPlayed: willBeScheduled?.played.bars || 0,
    }),
  )

  const refTrainingGenerator = useRef<Generator<number>>()
  const refIsDecrease = useRef(from > to)
  const refDone = useRef<boolean | undefined>(undefined)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    {
      tempo: setTempoAction,
      subdivision: setSubdivisionAction,
      beats: setBeatsAction,
    }[type],
    [type],
  )

  // Handle play/stop
  useEffect(() => {
    if (isTraining) {
      if (isPlaying) {
        refTrainingGenerator.current = rangeGenerator({ from, to, step })
      } else {
        refIsDecrease.current = false
        refDone.current = false
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isTraining])

  // Update 'from'
  useEffect(() => {
    if (!isPlaying && isTraining) {
      setFromAction({ beats, tempo, subdivision }[type])
    }
  }, [beats, tempo, subdivision, isTraining, isPlaying, type, setFromAction])

  // Training loop
  // Изменяет значение на последнюю ноту последнего такта
  useEffect(() => {
    if (
      !isCounting &&
      isTraining &&
      isPlaying &&
      isFirst &&
      barsPlayed % every === 0 &&
      refTrainingGenerator.current
    ) {
      const { value, done } = refTrainingGenerator.current.next()
      refDone.current = done

      if (!done && value) {
        onChange(value)

        if (type === 'subdivision') {
          applyGridAlignmentAction()
        }
      }
    }
  }, [
    applyGridAlignmentAction,
    barsPlayed,
    every,
    isCounting,
    isFirst,
    isPlaying,
    isTraining,
    onChange,
    type,
  ])

  // stop callback
  useEffect(() => {
    if (!isCounting && isTraining && isPlaying && isSecond && refDone.current) {
      onStop?.()
    }
  }, [isCounting, isSecond, isPlaying, isTraining, onStop])
}
