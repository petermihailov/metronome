import clsx from 'clsx'
import { memo } from 'react'

import classes from './FormRow.module.css'

interface FormRowProps {
  className?: string
  title?: string
  active?: boolean
  disabled?: boolean
  children?: React.ReactNode
  before?: React.ReactNode
  after?: React.ReactNode
}

const FormRow = ({ className, title, disabled, active, after, before, children }: FormRowProps) => {
  return (
    <div
      className={clsx(className, classes.formRow, {
        [classes.disabled]: disabled,
        [classes.active]: active,
      })}
    >
      <label className={classes.label}>
        {title && <span className={classes.title}>{title}</span>}
        <div className={classes.control}>{children}</div>
      </label>
      {before && <div className={classes.before}>{before}</div>}
      {after && <div className={classes.after}>{after}</div>}
    </div>
  )
}

export default memo(FormRow)
