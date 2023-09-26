import clsx from 'clsx';
import type {
  InputHTMLAttributes,
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
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
    const targetValue = event.target.value.replace(/\D/g, '');
    setInputValue(targetValue);

    if (Number(targetValue) >= min && Number(targetValue) <= max) {
      onChange?.(Math.min(Math.max(Number(targetValue), min), max));
    }
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

  const increaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    increase();
  };

  const decreaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    decrease();
  };

  const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (['ArrowUp', 'ArrowDown'].includes(event.code)) {
      event.stopPropagation();
    }

    if (event.code === 'ArrowUp') {
      increase();
    }

    if (event.code === 'ArrowDown') {
      decrease();
    }
  };

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <div className={clsx(className, classes.root)}>
      <label>
        {label && <span className={classes.label}>{label}</span>}
        <input
          className={classes.input}
          inputMode="decimal"
          type="text"
          value={inputValue}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
          {...restProps}
        />
      </label>
      <div className={classes.buttons} onClick={(e) => e.stopPropagation()}>
        <button className={classes.button} onClick={increaseHandler}>
          <Icon name="icon.plus" />
        </button>
        <button className={classes.button} onClick={decreaseHandler}>
          <Icon name="icon.minus" />
        </button>
      </div>
    </div>
  );
};

export default memo(InputNumber);
