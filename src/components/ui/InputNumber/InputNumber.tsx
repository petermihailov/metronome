import clsx from 'clsx'
import type {
  InputHTMLAttributes,
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  FocusEventHandler,
} from 'react'
import { useCallback, memo, useEffect, useRef, useState } from 'react'

import { inRange, minMax } from '../../../utils/math'
import { ButtonIcon } from '../ButtonIcon'

import classes from './InputNumber.module.css'

const TIMEOUT = 3_000 // ms

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
  active?: boolean
  title?: string
  min?: number
  max?: number
}

const InputNumber = ({
  className,
  title,
  value,
  min = -Infinity,
  max = +Infinity,
  active,
  onChange,
  ...restProps
}: InputNumberProps) => {
  const [textValue, setTextValue] = useState(String(minMax(value, { min, max })))

  const inputRef = useRef<HTMLInputElement>(null)
  const increaseButtonRef = useRef<HTMLButtonElement>(null)
  const decreaseButtonRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<number>()

  const resetTimer = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      inputRef.current?.blur()
    }, TIMEOUT)
  }, [])

  const setValue = (value: number, force?: boolean) => {
    if (force) {
      onChange(minMax(value, { min, max }))
    } else if (inRange(value, { min, max })) {
      onChange(value)
    }
  }

  const increase = () => setValue(value + 1)
  const decrease = () => setValue(value - 1)

  const increaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur()
    if (value !== max) {
      increase()
    }
  }

  const decreaseHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur()
    if (value !== min) {
      decrease()
    }
  }

  const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (['ArrowUp', 'ArrowDown'].includes(e.code)) {
      e.stopPropagation()
    }

    if (e.shiftKey) {
      if (e.code === 'ArrowUp') {
        setValue(value + 10)
      }

      if (e.code === 'ArrowDown') {
        setValue(value - 10)
      }
    } else {
      if (e.code === 'ArrowUp') {
        increase()
      }

      if (e.code === 'ArrowDown') {
        decrease()
      }

      if (e.code === 'Enter') {
        e.currentTarget.blur()
      }
    }
  }

  const onFocusHandler: FocusEventHandler<HTMLInputElement> = (e) => {
    e.target.select()
    resetTimer()
  }

  const onBlurHandler = () => {
    const val: number = Number(textValue)
    if (textValue !== '') {
      setValue(val, true)
    } else {
      setTextValue(String(value))
    }
  }

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const maxDigits = String(max).length

    const targetValue = Number(e.target.value.replace(/\D/, ''))
    const inputValue = e.target.value === '' ? '' : String(targetValue)

    if (inputValue.length <= maxDigits) {
      setTextValue(inputValue)
      setValue(targetValue)
    }
  }

  useEffect(() => {
    setTextValue(String(value))
  }, [value])

  useEffect(() => {
    if (!inRange(value, { min, max })) {
      setValue(value, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max, min, value])

  useEffect(() => {
    resetTimer()
  }, [textValue, resetTimer])

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className={clsx(className, classes.inputNumber)} onClick={resetTimer}>
      <label className={classes.label}>
        {title && <span className={classes.title}>{title}</span>}
        <input
          ref={inputRef}
          className={clsx(classes.input, { [classes.active]: active })}
          inputMode="decimal"
          type="text"
          value={textValue}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          onKeyDown={onKeyDownHandler}
          {...restProps}
        />
      </label>
      <div className={classes.buttons} onClick={(e) => e.stopPropagation()}>
        <ButtonIcon
          ref={decreaseButtonRef}
          aria-label="decrease"
          className={clsx(classes.button, { [classes.disabled]: value === min })}
          disabled={value === min}
          icon="icon.minus"
          tabIndex={-1}
          onClick={decreaseHandler}
        />
        <ButtonIcon
          ref={increaseButtonRef}
          aria-label="increase"
          className={clsx(classes.button, { [classes.disabled]: value === max })}
          disabled={value === max}
          icon="icon.plus"
          tabIndex={-1}
          onClick={increaseHandler}
        />
      </div>
    </div>
  )
}

export default memo(InputNumber)
