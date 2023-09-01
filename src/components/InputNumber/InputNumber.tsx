import clsx from 'clsx';
import type { InputHTMLAttributes, ChangeEventHandler } from 'react';
import { memo, useCallback } from 'react';

import classes from './InputNumber.module.css';

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
}

const InputNumber = ({ className, label, value, onChange, ...restProps }: InputNumberProps) => {
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange?.(Number(event.target.value));
    },
    [onChange],
  );

  const increase = useCallback(() => {
    onChange?.((value || 0) + 1);
  }, [onChange, value]);

  const decrease = useCallback(() => {
    onChange?.((value || 0) - 1);
  }, [onChange, value]);

  return (
    <label className={clsx(className, classes.root)}>
      {label && <span className={classes.label}>{label}</span>}
      <div className={classes.inputWrapper}>
        <input
          className={classes.input}
          inputMode="decimal"
          type="number"
          value={value}
          onChange={onChangeHandler}
          {...restProps}
        />
        <div className={classes.buttons}>
          <button className={classes.button} onClick={increase}>
            +
          </button>
          <button className={classes.button} onClick={decrease}>
            -
          </button>
        </div>
      </div>
    </label>
  );
};

export default memo(InputNumber);
