import clsx from 'clsx';
import type { InputHTMLAttributes, ChangeEventHandler } from 'react';
import { memo, useEffect, useState } from 'react';

import { Icon } from '../Icon';

import classes from './InputNumber.module.css';

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const InputNumber = ({
  className,
  label,
  value,
  min = -Infinity,
  max = Infinity,
  onChange,
  ...restProps
}: InputNumberProps) => {
  const [inputValue, setInputValue] = useState(String(value));

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const targetValue = event.target.value;
    setInputValue(targetValue);
    onChange?.(Math.min(Math.max(Number(targetValue), min), max));
  };

  const onBlurHandler = () => {
    setInputValue(String(value));
  };

  const increase = () => {
    onChange?.((value || 0) + 1);
  };

  const decrease = () => {
    onChange?.((value || 0) - 1);
  };

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <label className={clsx(className, classes.root)}>
      {label && <span className={classes.label}>{label}</span>}
      <div className={classes.inputWrapper}>
        <input
          className={classes.input}
          inputMode="decimal"
          type="number"
          value={inputValue}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          {...restProps}
        />
        <div className={classes.buttons}>
          <button className={classes.button} onClick={increase}>
            <Icon name="icon.plus" />
          </button>
          <button className={classes.button} onClick={decrease}>
            <Icon name="icon.minus" />
          </button>
        </div>
      </div>
    </label>
  );
};

export default memo(InputNumber);
