import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import type { IconName } from '../../types/icons';
import { Icon } from '../Icon';

import classes from './ButtonIcon.module.css';

export interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // required
  active?: boolean;
  disabled?: boolean;
  icon?: IconName;
  color?: 'accent1' | 'accent2';
}

const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  ({ className, active, icon, children, color = 'accent1', ...restProps }, ref) => {
    const title = restProps['aria-label'];

    return (
      <button
        ref={ref}
        className={clsx(className, classes.root, {
          [classes.active]: active,
          [classes[color]]: color,
        })}
        title={title}
        {...restProps}
      >
        {icon ? <Icon className={classes.icon} name={icon} /> : children}
      </button>
    );
  },
);

ButtonIcon.displayName = 'ButtonIcon';

export default ButtonIcon;
