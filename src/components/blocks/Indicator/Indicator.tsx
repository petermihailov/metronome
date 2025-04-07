import clsx from 'clsx'
import { memo, useEffect, useRef } from 'react'

import { useTickStore } from '../../../store/useTickStore'

import classes from './Indicator.module.css'

export interface IndicatorProps {
  className?: string
}

const Indicator = ({ className }: IndicatorProps) => {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)

  const beat = useTickStore(({ position }) => position.beat)

  useEffect(() => {
    // отменяем предыдущую анимацию, если есть
    animationRef.current?.cancel()

    if (indicatorRef.current) {
      const greenFrames = [
        { backgroundColor: '#0f0', boxShadow: '0 0 var(--size-2) #0f0a' },
        { backgroundColor: '#0f00', boxShadow: '0 0 var(--size-2) #0f00' },
      ]
      const redFrames = [
        { backgroundColor: '#f00', boxShadow: '0 0 var(--size-2) #f00a' },
        { backgroundColor: '#f000', boxShadow: '0 0 var(--size-2) #f000' },
      ]

      animationRef.current = indicatorRef.current.animate(beat === 1 ? redFrames : greenFrames, {
        duration: 150,
        easing: 'cubic-bezier(0, 0.2, 1, 1)',
        fill: 'both',
      })
    }
  }, [beat])

  return <div ref={indicatorRef} className={clsx(className, classes.indicator)} />
}

export default memo(Indicator)
