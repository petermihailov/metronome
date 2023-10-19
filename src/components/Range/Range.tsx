import clsx from 'clsx';
import type { ChangeEventHandler, HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';

import { minMax, percentOfRange } from '../../utils/math';
import { InputNumber } from '../InputNumber';

import classes from './Range.module.css';

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

  const setValue = (value: number) => onChange(minMax(value, { min, max }));

  const handleTrackChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = parseInt(e.target.value);
    if (!Number.isNaN(val)) {
      setValue(val);
      e.target.blur();
    }
  };

  useEffect(() => {
    rangeRef.current?.style.setProperty('--track-fill', percentOfRange(value, min, max));
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
            tabIndex={-1}
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
                  setValue(min + idx * 10);
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
