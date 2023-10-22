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

const blinkAnimationStart = (element: HTMLElement | null) => {
  element?.classList.remove(classes.blink);
  element?.offsetTop; // force repaint
  element?.classList.add(classes.blink);
};

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

const InputNumber = ({
  className,
  label,
  value,
  min,
  max,
  onChange,
  ...restProps
}: InputNumberProps) => {
  const [textValue, setTextValue] = useState(String(value));

  const increaseButtonRef = useRef<HTMLButtonElement>(null);
  const decreaseButtonRef = useRef<HTMLButtonElement>(null);

  const setValue = (value: number) => onChange(minMax(value, { min, max }));

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTextValue(event.target.value);
    const updatedValue = parseInt(event.target.value);

    if (!Number.isNaN(updatedValue)) {
      setValue(updatedValue);
    }
  };

  const increase = () => setValue(value + 1);
  const decrease = () => setValue(value - 1);

  const increaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    if (value !== max) {
      blinkAnimationStart(increaseButtonRef.current);
      increase();
    }
  };

  const decreaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    if (value !== min) {
      blinkAnimationStart(decreaseButtonRef.current);
      decrease();
    }
  };

  const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (['ArrowUp', 'ArrowDown'].includes(event.code)) {
      event.stopPropagation();
    }

    if (event.code === 'ArrowUp') {
      blinkAnimationStart(increaseButtonRef.current);
      increase();
    }

    if (event.code === 'ArrowDown') {
      blinkAnimationStart(decreaseButtonRef.current);
      decrease();
    }
  };

  const onFocusHandler: FocusEventHandler<HTMLInputElement> = (e) => {
    e.target.select();
  };

  const onBlurHandler = () => {
    const updatedValue = parseInt(textValue);

    if (!Number.isNaN(updatedValue)) {
      setTextValue(String(minMax(updatedValue, { min, max })));
    } else {
      setTextValue(String(min));
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
      <label>
        {label && <span className={classes.label}>{label}</span>}
        <input
          className={classes.input}
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
          className={classes.button}
          color="accent1"
          disabled={value === min}
          icon="icon.minus"
          tabIndex={-1}
          onClick={decreaseHandler}
        />
        <ButtonIcon
          ref={increaseButtonRef}
          aria-label="increase"
          className={classes.button}
          color="accent1"
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
