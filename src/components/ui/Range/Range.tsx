import clsx from 'clsx'
import type { ChangeEventHandler, HTMLAttributes } from 'react'
import { memo, useEffect, useRef } from 'react'

import { minMax, percentOfRange } from '../../../utils/math'

import classes from './Range.module.css'

export interface RangeProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  min?: number
  max?: number
  value: number
  labels?: boolean
  popover?: boolean
  onChange: (value: number) => void
}

const Range = ({
  className,
  min = 0,
  max = 100,
  value,
  labels,
  popover,
  onChange,
  ...restInputProps
}: RangeProps) => {
  const decimalRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const popoverTimeoutRef = useRef<number>(0)
  const rangeRef = useRef<HTMLDivElement>(null)
  const labelsCount = 1 + (max - min) / 10

  const setValue = (value: number) => onChange(minMax(value, { min, max }))

  const handleTrackChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = parseInt(e.target.value)
    if (!Number.isNaN(val)) {
      setValue(val)
      e.target.blur()
    }
  }

  useEffect(() => {
    rangeRef.current?.style.setProperty('--track-fill', percentOfRange(value, min, max))
    if (decimalRef.current?.value) {
      decimalRef.current.value = String(value)
    }
  }, [value, min, max])

  useEffect(() => {
    const baseTransform = 'translateX(calc(-1 * var(--track-fill)))'

    if (popoverRef.current) {
      popoverRef.current.style.transform = baseTransform + ' scale(1)'
      popoverRef.current.style.opacity = '1'
      window.clearTimeout(popoverTimeoutRef.current)

      popoverTimeoutRef.current = window.setTimeout(() => {
        if (popoverRef.current) {
          popoverRef.current!.style.transform += ' scale(0)'
          popoverRef.current!.style.opacity = '0'
        }
      }, 1000)
    }
  }, [value])

  return (
    <div ref={rangeRef} className={clsx(className, classes.range)}>
      {popover && (
        <div ref={popoverRef} className={classes.popover}>
          {Math.round(value)}
        </div>
      )}
      <input
        className={classes.input}
        max={max}
        min={min}
        tabIndex={-1}
        type="range"
        value={String(value)}
        onChange={handleTrackChange}
        {...restInputProps}
      />
      {labels && (
        <div aria-hidden className={classes.labels}>
          {Array.from(Array(labelsCount)).map((_, idx) => (
            <span
              key={idx}
              className={classes.label}
              onClick={() => {
                setValue(min + idx * 10)
              }}
            >
              {min + idx * 10}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(Range)
