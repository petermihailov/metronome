import { useCallback, useEffect, useRef } from 'react'

import { rangeGenerator } from '../components/blocks/Settings/Training/Training.utils'
import { useBeatStore } from '../store/useBeatStore'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useTrainingStore } from '../store/useTrainingStore'

type Options = Partial<{
  onStop: () => void
}>

export const useTraining = ({ onStop }: Options = {}) => {
  const { every, from, to, step, count, type, setFrom } = useTrainingStore(
    ({ every, from, to, step, count, type, setFrom }) => ({
      every,
      from,
      to,
      step,
      count,
      type,
      setFrom,
    }),
  )

  const {
    beats,
    isPlaying,
    isTraining,
    notes,
    applyGridAlignment,
    setBeatsAction,
    setSubdivisionAction,
    setTempoAction,
    subdivision,
    tempo,
  } = useMetronomeStore(
    ({
      beats,
      isPlaying,
      isTraining,
      notes,
      applyGridAlignment,
      setBeatsAction,
      setIsPlayingAction,
      setSubdivisionAction,
      setTempoAction,
      subdivision,
      tempo,
    }) => ({
      beats,
      isPlaying,
      isTraining,
      notes,
      applyGridAlignment,
      setBeatsAction,
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
  const refCanStop = useRef(false)

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
      setFrom({ beats, tempo, subdivision }[type])
    }
  }, [beats, tempo, subdivision, isTraining, isPlaying, type, setFrom])

  // Training loop
  // Изменяет значение на последнюю ноту последнего такта
  useEffect(() => {
    if (
      barsPlayed > count &&
      isTraining &&
      isPlaying &&
      beat.index === notes.length - 1 &&
      barsPlayed % every === 0 &&
      refTrainingGenerator.current
    ) {
      const { value, done } = refTrainingGenerator.current.next()

      if (value && !done) {
        onChange(value)
        applyGridAlignment()
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
        //     applyGridAlignment()
        //   }
        // } else {

        // доигрываем такт и стопаем
        if (refCanStop.current) {
          onStop?.()
        }
        refCanStop.current = true
        // }
      }
    }
  }, [
    applyGridAlignment,
    barsPlayed,
    beat.index,
    count,
    every,
    isPlaying,
    isTraining,
    notes.length,
    onChange,
    onStop,
  ])
}
