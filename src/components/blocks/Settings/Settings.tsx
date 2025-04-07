import clsx from 'clsx'
import { memo, useEffect, useState } from 'react'

import { Training } from './Training'
import { MINMAX } from '../../../constants'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { useTickStore } from '../../../store/useTickStore'
import { useTrainingStore } from '../../../store/useTrainingStore'
import { InputNumber } from '../../ui/InputNumber'
import { InputRange } from '../../ui/InputRange'

import classes from './Settings.module.css'

const Settings = () => {
  const {
    isTraining,
    isPlaying,
    beats,
    subdivision,
    tempo,
    setBeatsAction,
    setSubdivisionAction,
    setTempoAction,
    applyGridAlignmentAction,
  } = useMetronomeStore(
    ({
      beats,
      subdivision,
      tempo,
      isTraining,
      isPlaying,
      setBeatsAction,
      setSubdivisionAction,
      setTempoAction,
      applyGridAlignmentAction,
    }) => ({
      isTraining,
      isPlaying,
      beats,
      subdivision,
      tempo,
      setBeatsAction,
      setSubdivisionAction,
      setTempoAction,
      applyGridAlignmentAction,
    }),
  )

  const [values, setValues] = useState({
    tempo,
    beats,
    subdivision,
  })

  const disabled = isTraining && isPlaying
  const isFirst = useTickStore(({ position }) => position.first)
  const type = useTrainingStore(({ type }) => type)

  useEffect(() => {
    if (!isTraining || !isPlaying || isFirst) {
      setValues({ tempo, beats, subdivision })
    }
  }, [beats, isFirst, isPlaying, isTraining, subdivision, tempo])

  return (
    <div
      className={clsx(classes.settings, {
        [classes.isTraining]: isTraining,
      })}
    >
      <div className={classes.values}>
        <InputRange
          active={isTraining && type === 'tempo'}
          disabled={disabled}
          inputOnly={isTraining}
          max={MINMAX.tempo.max}
          min={MINMAX.tempo.min}
          title="tempo"
          value={values.tempo}
          onChange={(value) => {
            setTempoAction(value)
          }}
        />

        <InputNumber
          active={isTraining && type === 'beats'}
          disabled={disabled}
          max={MINMAX.beats.max}
          min={MINMAX.beats.min}
          title="beats"
          value={values.beats}
          onChange={(value) => {
            setBeatsAction(value)
            applyGridAlignmentAction()
          }}
        />

        <InputNumber
          active={isTraining && type === 'subdivision'}
          disabled={disabled}
          max={MINMAX.subdivision.max}
          min={MINMAX.subdivision.min}
          title="subdivision"
          value={values.subdivision}
          onChange={(value) => {
            setSubdivisionAction(value)
            applyGridAlignmentAction()
          }}
        />
      </div>

      {isTraining && <Training className={classes.training} disabled={disabled} />}
    </div>
  )
}

export default memo(Settings)
