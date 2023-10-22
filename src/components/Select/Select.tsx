import clsx from 'clsx';
import type { ChangeEventHandler, HTMLAttributes, ReactNode } from 'react';
import { memo } from 'react';

import classes from './Select.module.css';

export interface SelectOption<T> {
  value: T;
  label: string | number;
  customLabel?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T>
  extends Omit<HTMLAttributes<HTMLSelectElement>, 'onChange' | 'children'> {
  value?: T;
  options: SelectOption<T>[];
  onChange?: (value: T) => void;
}

const Select = <T,>({ className, value, options, onChange, ...restProps }: SelectProps<T>) => {
  const selectedIndex = options.findIndex((option) => option.value === value);

  const changeHandler: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const option = options[Number(e.target.value)];
    onChange?.(option.value);
  };

  return (
    <div className={clsx(className, classes.select)}>
      <select
        className={classes.selectNative}
        value={selectedIndex}
        onChange={changeHandler}
        {...restProps}
      >
        {options.map((option, idx) => (
          <option key={idx} value={idx}>
            {option.label}
          </option>
        ))}
      </select>

      <div aria-hidden="true">
        {options[selectedIndex]?.customLabel || options[selectedIndex]?.label}
      </div>
    </div>
  );
};

export default memo(Select) as typeof Select;
