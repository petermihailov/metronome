import clsx from 'clsx'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Training } from './Training'
import { MINMAX } from '../../../constants'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
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
  } = useMetronomeStore(
    useShallow(
      ({
        beats,
        subdivision,
        tempo,
        isTraining,
        isPlaying,
        setBeatsAction,
        setSubdivisionAction,
        setTempoAction,
      }) => ({
        isTraining,
        isPlaying,
        beats,
        subdivision,
        tempo,
        setBeatsAction,
        setSubdivisionAction,
        setTempoAction,
      }),
    ),
  )

  const { type } = useTrainingStore(
    useShallow(({ type }) => ({
      type,
    })),
  )

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
          value={tempo}
          onChange={setTempoAction}
        />

        <InputNumber
          active={isTraining && type === 'beats'}
          max={MINMAX.beats.max}
          min={MINMAX.beats.min}
          title="beats"
          value={beats}
          onChange={setBeatsAction}
        />

        <InputNumber
          active={isTraining && type === 'subdivision'}
          max={MINMAX.subdivision.max}
          min={MINMAX.subdivision.min}
          title="subdivision"
          value={subdivision}
          onChange={setSubdivisionAction}
        />
      </div>

      {isTraining && <Training className={classes.training} />}
    </div>
  )
}

export default memo(Settings)
