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
  const { step, every, to, type, setEvery, setTo, setStep, setType } = useTrainingStore(
    ({ step, every, to, type, setEvery, setTo, setStep, setType }) => ({
      every,
      to,
      type,
      step,
      setEvery,
      setStep,
      setTo,
      setType,
    }),
  )

  return (
    <div className={clsx(className, classes.training)}>
      <Select
        options={typeValues.map((key) => ({ value: key, label: key }))}
        title="change"
        value={type}
        onChange={setType}
      />
      <InputNumber
        max={MINMAX[type].max}
        min={MINMAX[type].min}
        title="to"
        value={to}
        onChange={setTo}
      />
      <InputNumber
        max={MINMAX.every.max}
        min={MINMAX.every.min}
        title="every (bars)"
        value={every}
        onChange={setEvery}
      />
      <InputNumber max={MINMAX[type].max} min={1} title="step" value={step} onChange={setStep} />
    </div>
  )
}

export default memo(Training)
