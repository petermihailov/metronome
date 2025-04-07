import clsx from 'clsx'
import { memo } from 'react'

import { MINMAX } from '../../../../constants'
import { useTrainingStore } from '../../../../store/useTrainingStore'
import { InputNumber } from '../../../ui/InputNumber'

import classes from './Training.module.css'

interface TrainingProps {
  className?: string
  disabled?: boolean
}

const Training = ({ className, disabled }: TrainingProps) => {
  const { step, every, to, type, setEveryAction, setToAction, setStepAction } = useTrainingStore(
    ({ step, every, to, type, setEveryAction, setToAction, setStepAction }) => ({
      every,
      to,
      type,
      step,
      setEveryAction,
      setStepAction,
      setToAction,
    }),
  )

  return (
    <div className={clsx(className, classes.training)}>
      <InputNumber
        disabled={disabled}
        max={MINMAX[type].max}
        min={MINMAX[type].min}
        title="to"
        value={to}
        onChange={setToAction}
      />
      <InputNumber
        disabled={disabled}
        max={MINMAX[type].max}
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
