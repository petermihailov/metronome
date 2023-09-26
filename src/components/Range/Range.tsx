import clsx from 'clsx';
import type { ChangeEventHandler, HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';

import { InputNumber } from '../InputNumber';

import classes from './Range.module.css';

const rangeToPercent = (value: number, min: number, max: number) => {
  const percent = value / (max - min) - min / (max - min);
  return `${percent * 100}%`;
};

export interface RangeProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  min?: number;
  max?: number;
  value: number;
  label?: string;
  onChange: (value: number) => void;
}

const Range = ({
  className,
  min = 0,
  max = 100,
  value,
  onChange,
  label,
  ...restInputProps
}: RangeProps) => {
  const decimalRef = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);

  const labelsCount = 1 + (max - min) / 10;

  const handleTrackChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = Math.min(Number(e.target.value), max);
    if (!Number.isNaN(val)) {
      onChange(Math.max(min, val));
      e.target.blur();
    }
  };

  useEffect(() => {
    rangeRef.current?.style.setProperty('--track-fill', rangeToPercent(value, min, max));
    if (decimalRef.current?.value) {
      decimalRef.current.value = String(value);
    }
  }, [value, min, max]);

  return (
    <div className={clsx(className, classes.root)}>
      {label && <span className={classes.label}>{label}</span>}
      <div className={classes.rangeContainer}>
        <InputNumber
          className={classes.value}
          max={max}
          min={min}
          value={value}
          onChange={onChange}
        />
        <div className={classes.range}>
          <input
            ref={rangeRef}
            className={classes.input}
            list="tickmarks"
            max={max}
            min={min}
            type="range"
            value={String(value)}
            onChange={handleTrackChange}
            {...restInputProps}
          />
          <datalist className={classes.labels} id="tickmarks">
            {Array.from(Array(labelsCount)).map((_, idx) => (
              <option
                key={idx}
                label={String(min + idx * 10)}
                value={min + idx * 10}
                onClick={() => {
                  onChange(min + idx * 10);
                }}
              />
            ))}
          </datalist>
        </div>
      </div>
    </div>
  );
};

export default Range;
