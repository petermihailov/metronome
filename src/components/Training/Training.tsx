import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';

import type { TrainingType } from './Training.types';
import { useTraining } from './useTraining';
import { MINMAX } from '../../constants';
import { useTrainingStore } from '../../store/useTrainingStore';
import { InputNumber } from '../InputNumber';
import { Select } from '../Select';

import classes from './Training.module.css';

const typeValues: TrainingType[] = ['tempo', 'subdivision', 'beats'];

interface TrainingProps {
  className?: string;
}

const Training = ({ className }: TrainingProps) => {
  const { every, to, type, setEvery, setTo, setType } = useTrainingStore(
    useShallow(
      ({ alternate, every, from, to, type, setAlternate, setEvery, setFrom, setTo, setType }) => ({
        alternate,
        every,
        from,
        to,
        type,
        setAlternate,
        setEvery,
        setFrom,
        setTo,
        setType,
      }),
    ),
  );

  const { trainingTime } = useTraining();

  return (
    <>
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
        <InputNumber max={12} min={1} title="every (bars)" value={every} onChange={setEvery} />
        {/*<Checkbox*/}
        {/*  checked={alternate}*/}
        {/*  label="alternate"*/}
        {/*  onClick={() => setAlternate((prev) => !prev)}*/}
        {/*/>*/}
        <time className={classes.time}>{trainingTime}</time>
      </div>
    </>
  );
};

export default Training;
