import clsx from 'clsx';
import type { ChangeEventHandler, HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';

import { minMax, percentOfRange } from '../../utils/math';

import classes from './Range.module.css';

export interface RangeProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
}

const Range = ({
  className,
  min = 0,
  max = 100,
  value,
  onChange,
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
    <div className={clsx(className, classes.range)}>
      <input
        ref={rangeRef}
        className={classes.input}
        max={max}
        min={min}
        tabIndex={-1}
        type="range"
        value={String(value)}
        onChange={handleTrackChange}
        {...restInputProps}
      />
      <div aria-hidden className={classes.labels}>
        {Array.from(Array(labelsCount)).map((_, idx) => (
          <span
            key={idx}
            className={classes.label}
            onClick={() => {
              setValue(min + idx * 10);
            }}
          >
            {min + idx * 10}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Range;
