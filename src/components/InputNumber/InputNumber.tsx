import clsx from 'clsx';
import type {
  InputHTMLAttributes,
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  FocusEventHandler,
} from 'react';
import { memo, useEffect, useRef, useState } from 'react';

import { minMax } from '../../utils/math';
import { ButtonIcon } from '../ButtonIcon';

import classes from './InputNumber.module.css';

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  active?: boolean;
  title?: string;
  min?: number;
  max?: number;
}

const InputNumber = ({
  className,
  title,
  value,
  min = -Infinity,
  max = +Infinity,
  active,
  onChange,
  ...restProps
}: InputNumberProps) => {
  const [textValue, setTextValue] = useState(String(value));

  const inputRef = useRef<HTMLInputElement>(null);
  const increaseButtonRef = useRef<HTMLButtonElement>(null);
  const decreaseButtonRef = useRef<HTMLButtonElement>(null);

  const setValue = (value: number) => onChange(minMax(value, { min, max }));

  const increase = () => setValue(value + 1);
  const decrease = () => setValue(value - 1);

  const increaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    if (value !== max) {
      increase();
    }
  };

  const decreaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    if (value !== min) {
      decrease();
    }
  };

  const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (['ArrowUp', 'ArrowDown'].includes(event.code)) {
      event.stopPropagation();
    }

    if (event.shiftKey) {
      if (event.code === 'ArrowUp') {
        setValue(value + 10);
      }

      if (event.code === 'ArrowDown') {
        setValue(value - 10);
      }
    } else {
      if (event.code === 'ArrowUp') {
        increase();
      }

      if (event.code === 'ArrowDown') {
        decrease();
      }
    }
  };

  const onFocusHandler: FocusEventHandler<HTMLInputElement> = (e) => {
    e.target.select();
  };

  const onBlurHandler = () => {
    if (+textValue < min || +textValue > max) {
      setValue(+textValue);
    } else {
      setTextValue(String(value));
    }
  };

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const maxDigit = Math.max(String(min).length, String(max).length);

    const stateValue = Number(event.target.value);
    const inputValue =
      event.target.value === ''
        ? event.target.value
        : String(Number(event.target.value.replace(/\D/, '')));

    if (!isNaN(stateValue) && String(stateValue).length <= maxDigit) {
      setTextValue(inputValue);

      if (stateValue >= min && stateValue <= max) {
        setValue(stateValue);
      }
    }
  };

  useEffect(() => {
    if (min || max) {
      const val = minMax(value, { min, max });
      onChange(val);
      setTextValue(String(val));
    }
  }, [max, min, onChange, value]);

  return (
    <div className={clsx(className, classes.inputNumber)}>
      <label className={classes.label}>
        {title && <span className={classes.title}>{title}</span>}
        <input
          ref={inputRef}
          className={clsx(classes.input, { [classes.active]: active })}
          inputMode="decimal"
          type="text"
          value={textValue}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          onKeyDown={onKeyDownHandler}
          {...restProps}
        />
      </label>
      <div className={classes.buttons} onClick={(e) => e.stopPropagation()}>
        <ButtonIcon
          ref={decreaseButtonRef}
          aria-label="decrease"
          className={clsx(classes.button, { [classes.disabled]: value === min })}
          disabled={value === min}
          icon="icon.minus"
          tabIndex={-1}
          onClick={decreaseHandler}
        />
        <ButtonIcon
          ref={increaseButtonRef}
          aria-label="increase"
          className={clsx(classes.button, { [classes.disabled]: value === max })}
          disabled={value === max}
          icon="icon.plus"
          tabIndex={-1}
          onClick={increaseHandler}
        />
      </div>
    </div>
  );
};

export default memo(InputNumber);
