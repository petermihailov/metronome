import { memo, useCallback, useMemo } from 'react'

import { useMetronomeStore } from '../../../store/useMetronomeStore'
import { useTickStore } from '../../../store/useTickStore'
import type { Instrument } from '../../../types/metronome'
import { Note } from '../../ui/Note'
import { DisplayBar } from '../DisplayBar'
import { TupletBrackets } from '../TupletBrackets'

import classes from './Display.module.css'

const disabledMap: Record<Instrument, Instrument | null> = {
  fxMetronome1: 'fxMetronome2',
  fxMetronome2: 'fxMetronome3',
  fxMetronome3: null,
}

const Display = () => {
  const { bar, subdivisions, switchInstrumentAction } = useMetronomeStore(
    ({ bar, subdivisions, switchInstrumentAction }) => ({
      bar,
      subdivisions,
      switchInstrumentAction,
    }),
  )

  const beats = useMemo(() => {
    let start = 0

    return subdivisions.map((subdivision) => {
      const notes = bar
        .slice(start, start + subdivision)
        .map((note, i) => ({ note, idx: start + i }))
      start += subdivision

      return notes
    })
  }, [bar, subdivisions])

  const clickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const target = e.target as HTMLElement
      const index = Number(target.dataset.index)

      // Клик мимо ноты (например, в зазор между нотами) игнорируем
      if (Number.isFinite(index)) {
        const currentInstrument = bar[index].instrument
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
    [bar, switchInstrumentAction],
  )

  // В тишине подсветки нет — иначе нота подсказывала бы момент вступления
  const { activeId } = useTickStore(({ position, muted }) => ({
    activeId: muted ? -1 : position.idx,
  }))

  // Один зазор и между долями, и между нотами: для равномерной раскладки вид не меняется
  const gapStyle = { gap: `min(var(--size-1), calc(var(--size-1) / ${0.2 * bar.length}))` }

  return (
    <div className={classes.display}>
      <div className={classes.bar} style={gapStyle} onClick={clickHandler}>
        {beats.map((notes, beat) => (
          <div key={beat} className={classes.beat} style={gapStyle}>
            {notes.map(({ note, idx }) => (
              <Note
                key={idx}
                active={activeId === idx}
                className={classes.note}
                data-index={idx}
                note={note}
              />
            ))}
          </div>
        ))}
      </div>

      <TupletBrackets style={gapStyle} subdivisions={subdivisions} />

      <DisplayBar />
    </div>
  )
}

export default memo(Display)
