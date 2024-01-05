import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

import { InputNumber } from '../InputNumber';
import { Range } from '../Range';

import classes from './InputRange.module.css';

export interface InputRangeProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  inputOnly?: boolean;
  min?: number;
  max?: number;
  value: number;
  title?: string;
  onChange: (value: number) => void;
}

const InputRange = ({
  className,
  title,
  max = 100,
  min = 0,
  value,
  inputOnly,
  onChange,
}: InputRangeProps) => {
  return (
    <div className={clsx(className, classes.inputRange)}>
      <InputNumber
        className={classes.input}
        max={max}
        min={min}
        title={title}
        value={value}
        onChange={onChange}
      />
      {!inputOnly && (
        <Range className={classes.range} max={max} min={min} value={value} onChange={onChange} />
      )}
    </div>
  );
};

export default InputRange;
