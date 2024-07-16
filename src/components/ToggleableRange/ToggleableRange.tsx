import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import type { IconName } from '../../types/icons';
import { ButtonIcon } from '../ButtonIcon';
import type { RangeProps } from '../Range';
import { Range } from '../Range';

import classes from './ToggleableRange.module.css';

const AUTO_HIDE_RANGE_MS = 3000;

interface ToggleableRangeProps {
  label: string;
  icon: IconName;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  rangeProps: RangeProps;
}

const ToggleableRange = ({
  label,
  icon,
  enabled = false,
  rangeProps,
  onToggle,
}: ToggleableRangeProps) => {
  const refTimeout = useRef(0);
  const refContainer = useRef<HTMLDivElement>(null);
  const [displayRange, setDisplayRange] = useState(false);

  const startAutoCloseTimer = () => {
    window.clearTimeout(refTimeout.current);
    refTimeout.current = window.setTimeout(() => setDisplayRange(false), AUTO_HIDE_RANGE_MS);
  };

  const handleClick = () => {
    if (displayRange) {
      // если есть range
      onToggle(!enabled);
    } else {
      setDisplayRange((prev) => !prev);
    }
    startAutoCloseTimer();
  };

  const onChange = (value: number) => {
    onToggle(true);
    rangeProps.onChange(value);
    startAutoCloseTimer();
  };

  useEffect(() => {
    refContainer.current!.addEventListener('mouseenter', () => {
      window.clearTimeout(refTimeout.current);
    });

    refContainer.current!.addEventListener('mouseleave', () => {
      window.clearTimeout(refTimeout.current);
      startAutoCloseTimer();
    });

    return () => window.clearTimeout(refTimeout.current);
  }, []);

  return (
    <div ref={refContainer} className={classes.toggleableRange}>
      <ButtonIcon
        aria-label={label}
        className={clsx(enabled && classes.buttonActive)}
        icon={icon}
        onClick={handleClick}
      />
      {displayRange && (
        <Range
          {...rangeProps}
          className={clsx(rangeProps.className, classes.range)}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default ToggleableRange;
