import { useCallback, useEffect, useRef } from 'react'

import { rangeGenerator } from '../components/blocks/Settings/Training/Training.utils'
import { useBeatStore } from '../store/useBeatStore'
import { useMetronomeStore } from '../store/useMetronomeStore'
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
    count,
    isPlaying,
    isTraining,
    setBeatsAction,
    setIsCountingAction,
    setSubdivisionAction,
    setTempoAction,
    subdivision,
    tempo,
  } = useMetronomeStore(
    ({
      applyGridAlignmentAction,
      beats,
      count,
      isPlaying,
      isTraining,
      setBeatsAction,
      setIsCountingAction,
      setIsPlayingAction,
      setSubdivisionAction,
      setTempoAction,
      subdivision,
      tempo,
    }) => ({
      applyGridAlignmentAction,
      beats,
      count,
      isPlaying,
      isTraining,
      setBeatsAction,
      setIsCountingAction,
      setIsPlayingAction,
      setSubdivisionAction,
      setTempoAction,
      subdivision,
      tempo,
    }),
  )

  const { beat, barsPlayed } = useBeatStore(({ beat, barsPlayed }) => ({ beat, barsPlayed }))

  const refTrainingGenerator = useRef<Generator<number>>()
  const refIsDecrease = useRef(from > to)

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

  // Update counting
  useEffect(() => {
    if (isPlaying && isTraining) {
      setIsCountingAction(count > 0)
    }
  }, [count, isPlaying, isTraining, setIsCountingAction])

  useEffect(() => {
    // нужно выключить отсчёт на последний удар
    if (beat.isLast) {
      setIsCountingAction(isTraining && barsPlayed < count)
    }
  }, [barsPlayed, beat.isLast, count, isTraining, setIsCountingAction])

  // Training loop
  // Изменяет значение на последнюю ноту последнего такта
  useEffect(() => {
    if (
      barsPlayed > count &&
      isTraining &&
      isPlaying &&
      beat.isLast &&
      barsPlayed % every === 0 &&
      refTrainingGenerator.current
    ) {
      const { value, done } = refTrainingGenerator.current.next()

      if (value && !done) {
        onChange(value)

        if (type === 'subdivision') {
          applyGridAlignmentAction()
        }
      } else {
        // if (alternate) {
        //   if (!refIsDecrease.current) {
        //     refTrainingGenerator.current = rangeGenerator({ from: to, to: from })
        //     refIsDecrease.current = true
        //   } else {
        //     refTrainingGenerator.current = rangeGenerator({ from, to })
        //     refIsDecrease.current = false
        //   }
        //
        //   const { value, done } = refTrainingGenerator.current.next()
        //   if (value !== undefined && !done) {
        //     onChange(value)
        //     applyGridAlignmentAction()
        //   }
        // } else {
        onStop?.()
      }
    }
  }, [
    applyGridAlignmentAction,
    barsPlayed,
    beat.isLast,
    count,
    every,
    isPlaying,
    isTraining,
    onChange,
    onStop,
    type,
  ])
}
