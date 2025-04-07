import { memo, useEffect, useRef } from 'react'

import type { ButtonIconProps } from '../ButtonIcon'
import { ButtonIcon } from '../ButtonIcon'

import classes from './ButtonCounting.module.css'

export interface ButtonCountingProps extends Omit<ButtonIconProps, 'aria-label' | 'color'> {
  count: number
  played: number
  isPlaying: boolean
}

const filterName = 'glow'

const ButtonCounting = ({ count, played = 0, isPlaying, ...restProps }: ButtonCountingProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)
  const animationRef = useRef<Animation>()

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.querySelectorAll('path').forEach((path, idx) => {
        if (isPlaying ? idx < count - played : idx < count) {
          path.classList.add(classes.glowSegment)
        } else {
          path.classList.remove(classes.glowSegment)
        }
      })
    }
  }, [count, isPlaying, played])

  useEffect(() => {
    // отменяем предыдущую анимацию, если есть
    animationRef.current?.cancel()

    if (isPlaying && valueRef.current && count) {
      animationRef.current = valueRef.current.animate(
        [{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
        {
          duration: 400,
          easing: 'ease-out',
          fill: 'both',
        },
      )

      if (played === count) {
        animationRef.current?.cancel()
        animationRef.current = valueRef.current.animate(
          [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0)' },
          ],
          {
            duration: 200,
            easing: 'ease-out',
            fill: 'both',
          },
        )
      }
    }
  }, [count, isPlaying, played])

  return (
    <ButtonIcon aria-label="count" className={classes.buttonCounting} {...restProps}>
      <svg ref={svgRef} viewBox="0 0 24 24">
        <defs>
          <filter height="200%" id={filterName} width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur" stdDeviation="2.5" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M23 10.9091C23.5523 10.9091 24.0047 10.4604 23.9542 9.91048C23.854 8.82024 23.59 7.74936 23.1696 6.73436C22.6213 5.41081 21.8178 4.2082 20.8048 3.1952C19.7918 2.1822 18.5892 1.37864 17.2656 0.830405C16.2506 0.409979 15.1797 0.146022 14.0895 0.0458015C13.5395 -0.00475438 13.0909 0.447715 13.0909 1L13.0909 1.72727C13.0909 2.27956 13.5402 2.72097 14.0884 2.78831C14.8202 2.8782 15.538 3.06677 16.2219 3.35008C17.2146 3.76125 18.1166 4.36392 18.8763 5.12367C19.6361 5.88342 20.2387 6.78538 20.6499 7.77804C20.9332 8.46201 21.1218 9.17981 21.2117 9.91157C21.279 10.4597 21.7204 10.9091 22.2727 10.9091H23Z"
          filter={count > 0 ? `url(#${filterName})` : undefined}
        />
        <path
          d="M23 13.0909C23.5523 13.0909 24.0047 13.5396 23.9542 14.0895C23.854 15.1798 23.59 16.2506 23.1696 17.2656C22.6213 18.5892 21.8178 19.7918 20.8048 20.8048C19.7918 21.8178 18.5892 22.6214 17.2656 23.1696C16.2506 23.59 15.1797 23.854 14.0895 23.9542C13.5395 24.0048 13.0909 23.5523 13.0909 23L13.0909 22.2727C13.0909 21.7204 13.5402 21.279 14.0884 21.2117C14.8202 21.1218 15.538 20.9332 16.2219 20.6499C17.2146 20.2387 18.1166 19.6361 18.8763 18.8763C19.6361 18.1166 20.2387 17.2146 20.6499 16.222C20.9332 15.538 21.1218 14.8202 21.2117 14.0884C21.279 13.5403 21.7204 13.0909 22.2727 13.0909H23Z"
          filter={count > 1 ? `url(#${filterName})` : undefined}
        />
        <path
          d="M1.00003 13.0909C0.44774 13.0909 -0.00472956 13.5396 0.0458264 14.0895C0.146047 15.1798 0.410003 16.2506 0.83043 17.2656C1.37866 18.5892 2.18222 19.7918 3.19522 20.8048C4.20823 21.8178 5.41084 22.6214 6.73439 23.1696C7.74939 23.59 8.82027 23.854 9.9105 23.9542C10.4605 24.0048 10.9091 23.5523 10.9091 23L10.9091 22.2727C10.9091 21.7204 10.4598 21.279 9.9116 21.2117C9.17983 21.1218 8.46204 20.9332 7.77807 20.6499C6.78541 20.2387 5.88345 19.6361 5.1237 18.8763C4.36394 18.1166 3.76128 17.2146 3.3501 16.222C3.06679 15.538 2.87822 14.8202 2.78833 14.0884C2.721 13.5403 2.27958 13.0909 1.7273 13.0909H1.00003Z"
          filter={count > 2 ? `url(#${filterName})` : undefined}
        />
        <path
          d="M1.00003 10.9091C0.44774 10.9091 -0.00472956 10.4604 0.0458264 9.91048C0.146047 8.82024 0.410003 7.74936 0.83043 6.73436C1.37866 5.41081 2.18222 4.2082 3.19522 3.1952C4.20823 2.1822 5.41084 1.37864 6.73439 0.830405C7.74939 0.409979 8.82027 0.146022 9.9105 0.0458015C10.4605 -0.00475438 10.9091 0.447715 10.9091 1L10.9091 1.72727C10.9091 2.27956 10.4598 2.72097 9.9116 2.78831C9.17983 2.8782 8.46204 3.06677 7.77807 3.35008C6.78541 3.76125 5.88345 4.36392 5.1237 5.12367C4.36394 5.88342 3.76128 6.78538 3.3501 7.77804C3.06679 8.46201 2.87822 9.17981 2.78833 9.91157C2.721 10.4597 2.27958 10.9091 1.7273 10.9091H1.00003Z"
          filter={count > 3 ? `url(#${filterName})` : undefined}
        />
      </svg>
      <span ref={valueRef} className={classes.countValue}>
        {(isPlaying && count ? count - played || '1' : count) || ''}
      </span>
    </ButtonIcon>
  )
}

export default memo(ButtonCounting)
