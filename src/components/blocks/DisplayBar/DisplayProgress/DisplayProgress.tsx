import clsx from 'clsx'
import { memo, useEffect, useRef } from 'react'

import { useTrainingTime } from '../../../../hooks/useTrainingTime'
import { useMetronomeStore } from '../../../../store/useMetronomeStore'

import classes from './DisplayProgress.module.css'

const DisplayProgress = ({ className }: { className?: string }) => {
  const { isPlaying } = useMetronomeStore(({ isPlaying }) => ({ isPlaying }))
  const total = useTrainingTime() as number
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return

    // сбрасываем без анимации перед стартом новой transition
    el.style.transitionDuration = '0ms'
    el.style.inlineSize = '0%'

    if (isPlaying && total > 0) {
      // форсируем рефлоу, чтобы сброс применился до того, как включим анимацию
      void el.offsetWidth

      el.style.transitionDuration = `${total}s`
      el.style.inlineSize = '100%'
    }
  }, [isPlaying, total])

  return (
    <div className={clsx(className, classes.progress)}>
      <div ref={fillRef} className={classes.fill} />
    </div>
  )
}

export default memo(DisplayProgress)
