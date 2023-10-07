import clsx from 'clsx';
import type {
  InputHTMLAttributes,
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import { memo, useEffect, useRef, useState } from 'react';

import { ButtonIcon } from '../ButtonIcon';

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
  const increaseButtonRef = useRef<HTMLButtonElement>(null);
  const decreaseButtonRef = useRef<HTMLButtonElement>(null);

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

    let button;

    if (event.code === 'ArrowUp') {
      button = increaseButtonRef.current;
      increase();
    }

    if (event.code === 'ArrowDown') {
      button = decreaseButtonRef.current;
      decrease();
    }

    // Blink animation
    button?.classList.remove(classes.blink);
    button?.offsetTop;
    button?.classList.add(classes.blink);
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
        <ButtonIcon
          ref={increaseButtonRef}
          aria-label="increase"
          className={classes.button}
          color="accent1"
          icon="icon.plus"
          onClick={increaseHandler}
        />
        <ButtonIcon
          ref={decreaseButtonRef}
          aria-label="decrease"
          className={classes.button}
          color="accent1"
          icon="icon.minus"
          onClick={decreaseHandler}
        />
      </div>
    </div>
  );
};

export default memo(InputNumber);
