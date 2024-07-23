import clsx from 'clsx'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'

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
  const { every, to, type, setEvery, setTo, setType } = useTrainingStore(
    useShallow(({ every, to, type, setEvery, setTo, setType }) => ({
      every,
      to,
      type,
      setEvery,
      setTo,
      setType,
    })),
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
    </div>
  )
}

export default memo(Training)
