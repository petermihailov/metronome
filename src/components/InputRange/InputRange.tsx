import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

import { InputNumber } from '../InputNumber';
import { Range } from '../Range';

import classes from './InputRange.module.css';

export interface InputRangeProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  min?: number;
  max?: number;
  value: number;
  label?: string;
  onChange: (value: number) => void;
}

const InputRange = ({ className, label, max = 100, min = 0, value, onChange }: InputRangeProps) => {
  return (
    <div className={clsx(className, classes.root)}>
      <InputNumber
        className={classes.input}
        label={label}
        max={max}
        min={min}
        value={value}
        onChange={onChange}
      />
      <Range className={classes.range} max={max} min={min} value={value} onChange={onChange} />
    </div>
  );
};

export default InputRange;
