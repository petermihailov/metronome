import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

import classes from './ButtonIcon.module.css';

export interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // required
  active?: boolean;
  disabled?: boolean;
}

const ButtonIcon = ({ className, active, ...restProps }: ButtonIconProps) => {
  const title = restProps['aria-label'];

  return (
    <button
      className={clsx(className, classes.root, { [classes.active]: active })}
      title={title}
      {...restProps}
    />
  );
};

export default ButtonIcon;
