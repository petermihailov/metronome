import clsx from 'clsx'
import { memo } from 'react'

import type { TrainingType } from './Training.types'
import { MINMAX } from '../../../../constants'
import { useTrainingStore } from '../../../../store/useTrainingStore'
import { InputNumber } from '../../../ui/InputNumber'
import { Select } from '../../../ui/Select'

import classes from './Training.module.css'

const typeValues: TrainingType[] = ['tempo', 'subdivision']

interface TrainingProps {
  className?: string
}

const Training = ({ className }: TrainingProps) => {
  const { step, every, to, type, setEveryAction, setToAction, setStepAction, setTypeAction } =
    useTrainingStore(
      ({ step, every, to, type, setEveryAction, setToAction, setStepAction, setTypeAction }) => ({
        every,
        to,
        type,
        step,
        setEveryAction,
        setStepAction,
        setToAction,
        setTypeAction,
      }),
    )

  return (
    <div className={clsx(className, classes.training)}>
      <Select
        options={typeValues.map((key) => ({ value: key, label: key }))}
        title="change"
        value={type}
        onChange={setTypeAction}
      />
      <InputNumber
        max={MINMAX[type].max}
        min={MINMAX[type].min}
        title="to"
        value={to}
        onChange={setToAction}
      />
      <InputNumber
        max={MINMAX[type].max}
        min={1}
        title="step"
        value={step}
        onChange={setStepAction}
      />
      <InputNumber
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
