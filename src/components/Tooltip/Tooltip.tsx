import clsx from 'clsx';
import React, { memo } from 'react';

import classes from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  children?: React.ReactNode;
  className?: string;
  placement?: TooltipPlacement;
}

const Tooltip = ({ className, placement = 'bottom', ...restProps }: TooltipProps) => {
  if (!restProps.children) {
    return null;
  }

  return <span className={clsx(className, classes.tooltip, classes[placement])} {...restProps} />;
};

export default memo(Tooltip);
