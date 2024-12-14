import { memo } from 'react'

import type { ButtonIconProps } from '../ButtonIcon'
import { ButtonIcon } from '../ButtonIcon'

import classes from './ButtonCounting.module.css'

export interface ButtonCountingProps extends Omit<ButtonIconProps, 'aria-label' | 'color'> {
  count: number
}

const ButtonCounting = ({ count, ...restProps }: ButtonCountingProps) => {
  return (
    <ButtonIcon aria-label="count" className={classes.buttonCounting} {...restProps}>
      {count}
    </ButtonIcon>
  )
}

export default memo(ButtonCounting)
