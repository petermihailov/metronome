import clsx from 'clsx'
import { memo, useEffect, useState } from 'react'

import { Training } from './Training'
import { MINMAX } from '../../../constants'
import { useBeatStore } from '../../../store/useBeatStore'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { useTrainingStore } from '../../../store/useTrainingStore'
import { InputNumber } from '../../ui/InputNumber'
import { InputRange } from '../../ui/InputRange'
import { TodayTimer } from '../TodayTimer'

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

  const isFirstBeat = useBeatStore(({ beat }) => beat.isFirst)
  const type = useTrainingStore(({ type }) => type)

  useEffect(() => {
    if (!isPlaying || isFirstBeat) {
      setValues({ tempo, beats, subdivision })
    }
  }, [beats, isFirstBeat, isPlaying, subdivision, tempo])

  return (
    <div
      className={clsx(classes.settings, {
        [classes.isTraining]: isTraining,
        [classes.isPlaying]: isPlaying,
      })}
    >
      <div className={classes.values}>
        <InputRange
          active={isTraining && type === 'tempo'}
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
          max={MINMAX.subdivision.max}
          min={MINMAX.subdivision.min}
          title="subdivision"
          value={values.subdivision}
          onChange={(value) => {
            setSubdivisionAction(value)
            applyGridAlignmentAction()
          }}
        />

        <TodayTimer />
      </div>

      {isTraining && <Training className={classes.training} />}
    </div>
  )
}

export default memo(Settings)
