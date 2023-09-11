import clsx from 'clsx';
import type { InputHTMLAttributes, ChangeEventHandler, KeyboardEventHandler } from 'react';
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

  // useEffect(() => {
  //   const callback = (event: KeyboardEvent) => {
  //     const eventTarget = event.target as HTMLInputElement | null;
  //
  //     if (eventTarget?.tagName === 'INPUT' && eventTarget?.type === 'number') {
  //       return;
  //     }
  //
  //     if (event.code === 'Space') {
  //       const eventTarget = event.target as HTMLInputElement | null;
  //
  //       if (eventTarget?.tagName === 'INPUT' && eventTarget?.type === 'number') {
  //         eventTarget.blur();
  //       }
  //
  //       togglePlaying();
  //     }
  //
  //     if (event.shiftKey) {
  //       if (event.code === 'ArrowUp') {
  //         setTempo(tempo + 10);
  //       }
  //
  //       if (event.code === 'ArrowDown') {
  //         setTempo(tempo - 10);
  //       }
  //     } else {
  //       if (event.code === 'ArrowUp') {
  //         setTempo(tempo + 1);
  //       }
  //
  //       if (event.code === 'ArrowDown') {
  //         setTempo(tempo - 1);
  //       }
  //     }
  //   };
  //   // event = keyup or keydown
  //   document.addEventListener('keydown', callback);
  //
  //   return () => {
  //     document.removeEventListener('keydown', callback);
  //   };
  // }, []);

  return (
    <label className={clsx(className, classes.root)}>
      {label && <span className={classes.label}>{label}</span>}
      <div className={classes.inputWrapper}>
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
