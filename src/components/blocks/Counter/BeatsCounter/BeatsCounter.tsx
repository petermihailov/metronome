import clsx from 'clsx'
import { memo, useEffect, useRef, useState } from 'react'

import { Modal } from '../../../ui/Modal'

import classes from './BeatsCounter.module.css'

export interface BeatsCounterProps {
  className?: string
  playing?: boolean
  value: number
  beats: number
}

const BeatsCounter = ({ className, playing, value, beats }: BeatsCounterProps) => {
  const valueRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation>()
  const [fullscreen, setFullscreen] = useState(false)

  const clickHandler = () => {
    setFullscreen((prev) => !prev)
  }

  useEffect(() => {
    // отменяем предыдущую анимацию, если есть
    if (animationRef.current) {
      animationRef.current.currentTime = 0
      animationRef.current?.cancel()
    }

    if (playing && valueRef.current) {
      animationRef.current = valueRef.current.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0.8, transform: 'scale(0.9)' },
        ],
        {
          duration: 4_000,
          easing: 'cubic-bezier(0, 0.5, 0.8 , 1)',
          fill: 'backwards',
        },
      )
    }
  }, [playing, value])

  useEffect(() => {
    if (!playing) {
      animationRef.current?.finish()
    }
  }, [playing])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className={clsx(className, classes.beatsCounter, { [classes.playing]: playing })}
      onClick={clickHandler}
    >
      {fullscreen ? (
        <Modal>
          <div className={classes.beatValueFullscreen}>
            {/* ToDo: вынеси в компонент сегментный шрифт и placeholder */}
            <div className={clsx(classes.segment, { [classes.lengthTwo]: beats > 9 })}>
              <span className={classes.segmentPlaceholder}>{beats > 9 ? '18' : 8}</span>
              <span ref={valueRef} className={classes.segmentValue}>
                {value}
              </span>
            </div>
          </div>
        </Modal>
      ) : (
        <span className={classes.value}>{value}</span>
      )}
    </div>
  )
}

export default memo(BeatsCounter)
