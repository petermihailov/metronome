import clsx from 'clsx'
import { memo } from 'react'

import imgLedDisabled from './led-black.png'
import imgLedEnabled from './led-red.png'
// import imgEnabled from './toggleswitch-down.png';
// import imgDisabled from './toggleswitch-up.png';

import classes from './Checkbox.module.css'

interface CheckboxProps {
  className?: string
  label: string
  checked?: boolean
  onClick?: () => void
  disabled?: boolean
}

const Checkbox = ({ className, label, checked, disabled, onClick }: CheckboxProps) => {
  return (
    <button
      className={clsx(className, classes.checkbox, { [classes.checked]: checked })}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={classes.title}>
        <img alt="" aria-hidden="true" className={classes.led} src={imgLedDisabled} />
        <img
          alt=""
          aria-hidden="true"
          className={clsx(classes.led, classes.ledEnabled)}
          src={imgLedEnabled}
        />
        {label}
      </span>

      {/*<img*/}
      {/*  alt={checked ? 'enabled' : 'disabled'}*/}
      {/*  className={classes.toggler}*/}
      {/*  src={checked ? imgEnabled : imgDisabled}*/}
      {/*/>*/}
    </button>
  )
}

export default memo(Checkbox)
