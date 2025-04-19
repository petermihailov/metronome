import { memo, useEffect, useState } from 'react'

import { firework } from './firework'
import { InputNumber } from '../../components/ui/InputNumber'
import { InputRange } from '../../components/ui/InputRange'
import { MINMAX } from '../../constants'
import { useTraining } from '../../hooks'
import { useMetronomeStore } from '../../store/useMetronomeStore'
import { useTickStore } from '../../store/useTickStore'
import { useTrainingStore } from '../../store/useTrainingStore'

import classes from './Training.module.css'

const Training = () => {
  useTraining({ onStop: firework })

  const {
    isPlaying,
    beats,
    subdivision,
    tempo,
    setBeatsAction,
    setSubdivisionAction,
    setTempoAction,
  } = useMetronomeStore(
    ({
      beats,
      subdivision,
      tempo,
      isPlaying,
      setBeatsAction,
      setSubdivisionAction,
      setTempoAction,
    }) => ({
      isPlaying,
      beats,
      subdivision,
      tempo,
      setBeatsAction,
      setSubdivisionAction,
      setTempoAction,
    }),
  )

  const { step, every, to, setEveryAction, setToAction, setStepAction } = useTrainingStore(
    ({ step, every, to, setEveryAction, setToAction, setStepAction }) => ({
      every,
      to,
      step,
      setEveryAction,
      setStepAction,
      setToAction,
    }),
  )

  const disabled = isPlaying

  /* Показываем значение из стейта, которое меняестя только на downbeat */

  const isDownbeat = useTickStore(({ position }) => position.downbeat)
  const [values, setValues] = useState({ tempo, beats, subdivision })

  useEffect(() => {
    if (!isPlaying || isDownbeat) {
      setValues({ tempo, beats, subdivision })
    }
  }, [beats, isDownbeat, isPlaying, subdivision, tempo])

  return (
    <div className={classes.training}>
      <InputRange
        active={true}
        disabled={disabled}
        inputOnly={true}
        max={MINMAX.tempo.max}
        min={MINMAX.tempo.min}
        title="tempo"
        value={values.tempo}
        onChange={setTempoAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.beats.max}
        min={MINMAX.beats.min}
        title="beats"
        value={values.beats}
        onChange={setBeatsAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.subdivision.max}
        min={MINMAX.subdivision.min}
        title="subdivision"
        value={values.subdivision}
        onChange={setSubdivisionAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.tempo.max}
        min={MINMAX.tempo.min}
        title="to"
        value={to}
        onChange={setToAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.tempo.max}
        min={1}
        title="step"
        value={step}
        onChange={setStepAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.every.max}
        min={MINMAX.every.min}
        title="every (bars)"
        value={every}
        onChange={setEveryAction}
      />
    </div>
  )
}

export default memo(Training)
