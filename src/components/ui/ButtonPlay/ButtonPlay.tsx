import clsx from 'clsx'
import { forwardRef, memo, useEffect, useRef } from 'react'

import type { ButtonIconProps } from '../ButtonIcon'
import { ButtonIcon } from '../ButtonIcon'

import classes from './ButtonPlay.module.css'

export interface ButtonPlayProps extends Omit<ButtonIconProps, 'aria-label' | 'color'> {
  playing: boolean
}

const animationProps = {
  begin: 'indefinite',
  fill: 'freeze',
  attributeName: 'points',
  dur: '150ms',
}

const playPolygon = '6 6, 18 12, 18 12, 6 18'
const stopPolygon = '6 6, 18 6, 18 18, 6 18'

const ButtonPlay = forwardRef<HTMLButtonElement, ButtonPlayProps>(function ButtonPlay(
  { className, playing, ...restProps },
  ref,
) {
  const playAnimationRef = useRef<SVGAnimateElement>(null)
  const stopAnimationRef = useRef<SVGAnimateElement>(null)

  useEffect(() => {
    if (playing) {
      stopAnimationRef.current?.beginElement()
    } else {
      playAnimationRef.current?.beginElement()
    }
  }, [playing])

  return (
    <ButtonIcon
      ref={ref}
      active
      aria-label={''}
      className={clsx(className, classes.buttonPlay, { [classes.isPlaying]: playing })}
      color={playing ? 'accent2' : 'accent1'}
      onFocus={(n) => n.currentTarget.blur()}
      {...restProps}
    >
      <svg fill="currentColor" height="24" stroke="currentColor" viewBox="0 0 24 24" width="24">
        <polygon points={playPolygon} strokeLinejoin="round" strokeWidth="5">
          <animate ref={stopAnimationRef} to={stopPolygon} {...animationProps} />
          <animate ref={playAnimationRef} to={playPolygon} {...animationProps} />
        </polygon>
      </svg>
    </ButtonIcon>
  )
})

export default memo(ButtonPlay)
