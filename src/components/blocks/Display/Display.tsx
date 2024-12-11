import { memo, useEffect, useRef } from 'react'

import { useBeatStore } from '../../../store/useBeatStore'
import { useMetronomeStore } from '../../../store/useMetronomeStore'
// import { DisplayBar } from '../DisplayBar';
import { Note } from '../../ui/Note'

import classes from './Display.module.css'

const Display = () => {
  const { notes, switchInstrumentAction, isPlaying } = useMetronomeStore(
    ({ notes, switchInstrumentAction, isPlaying }) => ({
      notes,
      switchInstrumentAction,
      isPlaying,
    }),
  )

  const { beat } = useBeatStore(({ beat }) => ({ beat }))

  const refIndicator = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!beat.isSubdivision) {
      refIndicator.current?.classList.remove(classes.accent, classes.regular)
      refIndicator.current?.offsetTop

      if (beat.index === 0) {
        refIndicator.current?.classList.add(classes.accent)
      } else {
        refIndicator.current?.classList.add(classes.regular)
      }
    }
  }, [beat.index, beat.isSubdivision])

  useEffect(() => {
    refIndicator.current?.classList.remove(classes.accent, classes.regular)
    refIndicator.current?.offsetTop
    refIndicator.current?.classList.add(classes.accent)
  }, [isPlaying])

  return (
    <div className={classes.display}>
      <div
        className={classes.notes}
        style={{
          gap: `min(var(--size-1), calc(var(--size-1) / ${0.2 * notes.length}))`,
        }}
      >
        {notes.map((note, idx) => (
          <Note
            key={idx}
            active={Boolean(beat.index === idx)}
            className={classes.note}
            note={note}
            onClick={() => switchInstrumentAction(idx)}
          />
        ))}
      </div>

      <div ref={refIndicator} className={classes.indicator} />

      {/*<DisplayBar />*/}
    </div>
  )
}

export default memo(Display)
