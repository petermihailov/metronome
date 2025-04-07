import { memo, useCallback } from 'react'

import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { useTickStore } from '../../../store/useTickStore'
import type { Instrument } from '../../../types/common'
import { Note } from '../../ui/Note'
import { DisplayBar } from '../DisplayBar'

import classes from './Display.module.css'

const disabledMap: Record<Instrument, Instrument | null> = {
  fxMetronome1: 'fxMetronome2',
  fxMetronome2: 'fxMetronome3',
  fxMetronome3: null,
}

const Display = () => {
  const { grid, switchInstrumentAction } = useMetronomeStore(
    ({ grid, switchInstrumentAction }) => ({
      grid,
      switchInstrumentAction,
    }),
  )

  const clickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const target = e.target as HTMLElement
      const index = Number(target.dataset.index)
      const currentInstrument = grid[index].instrument

      if (Number.isFinite(index)) {
        const { top, bottom } = target.getBoundingClientRect()

        const y = e.clientY - top
        const part = (bottom - top) / 3
        const zone = Math.floor(y / part)

        const instrument: Instrument =
          zone === 0 ? 'fxMetronome1' : zone === 1 ? 'fxMetronome2' : 'fxMetronome3'

        const nextInstrument =
          currentInstrument === instrument ? disabledMap[currentInstrument] : instrument

        switchInstrumentAction(index, nextInstrument)
      }
    },
    [grid, switchInstrumentAction],
  )

  const { activeId } = useTickStore(({ position }) => ({ activeId: position.idx }))

  return (
    <div className={classes.display}>
      <div
        className={classes.grid}
        style={{
          gap: `min(var(--size-1), calc(var(--size-1) / ${0.2 * grid.length}))`,
        }}
        onClick={clickHandler}
      >
        {grid.map((note, idx) => (
          <Note
            key={idx}
            active={activeId === idx}
            className={classes.note}
            data-index={idx}
            note={note}
          />
        ))}
      </div>

      <DisplayBar />
    </div>
  )
}

export default memo(Display)
