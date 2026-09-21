import clsx from 'clsx'
import { memo } from 'react'

import classes from './Tabs.module.css'

export interface TabsOption<T extends string> {
  value: T
  label: string
}

export interface TabsProps<T extends string> {
  className?: string
  disabled?: boolean
  options: TabsOption<T>[]
  value: T
  onChange: (value: T) => void
}

const Tabs = <T extends string>({
  className,
  disabled,
  options,
  value,
  onChange,
}: TabsProps<T>) => {
  return (
    <div className={clsx(className, classes.tabs)} role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          aria-selected={option.value === value}
          className={clsx(classes.tab, {
            [classes.active]: option.value === value,
            [classes.disabled]: disabled && option.value !== value,
          })}
          disabled={disabled}
          role="tab"
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default memo(Tabs) as typeof Tabs
