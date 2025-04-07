import clsx from 'clsx'
import type { HTMLAttributes, MouseEventHandler } from 'react'
import { memo, forwardRef } from 'react'

import type { IconName } from '../../../types/icons'
import { Icon } from '../Icon'

import classes from './ButtonIcon.module.css'

export interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  'aria-label': string // required
  active?: boolean
  disabled?: boolean
  icon?: IconName
  color?: 'accent1' | 'accent2'
  withoutHighlight?: boolean
  withoutDisabledOpacity?: boolean
}

const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (
    {
      className,
      active,
      icon,
      children,
      color,
      withoutHighlight,
      withoutDisabledOpacity,
      disabled,
      onClick,
      ...restProps
    },
    ref,
  ) => {
    const title = restProps['aria-label']

    const clickHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
      const button = e.currentTarget

      if (disabled) {
        button.classList.remove(classes.headShake)

        window.requestAnimationFrame(() => {
          button.classList.add(classes.headShake)
        })
      } else {
        onClick?.(e)
      }
    }

    return (
      <button
        ref={ref}
        aria-disabled={disabled}
        className={clsx(className, classes.buttonIcon, {
          [classes.disabled]: disabled && !withoutDisabledOpacity,
          [classes.highlight]: !withoutHighlight,
          [classes.active]: active,
          [classes[color || '']]: color,
        })}
        title={title}
        type="button"
        onClick={clickHandler}
        {...restProps}
      >
        {icon ? <Icon name={icon} /> : null}
        <span className={classes.buttonIconContent}>{children}</span>
      </button>
    )
  },
)

ButtonIcon.displayName = 'ButtonIcon'

export default memo(ButtonIcon)
