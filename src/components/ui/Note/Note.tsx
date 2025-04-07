import clsx from 'clsx'
import { memo } from 'react'

import type { Note as NoteType } from '../../../types/common'

import classes from './Note.module.css'

export interface NoteProps {
  className?: string
  note: NoteType
  controls?: boolean
  beat?: boolean
  active?: boolean
  onClick?: () => void
}

const Note = ({ className, note, beat, active, ...restProps }: NoteProps) => {
  return (
    <button
      className={clsx(className, classes.note, {
        [classes.beat]: beat,
        [classes.active]: active,
        [classes.sound1]: note.instrument === 'fxMetronome1',
        [classes.sound2]: note.instrument === 'fxMetronome2',
        [classes.sound3]: note.instrument === 'fxMetronome3',
      })}
      {...restProps}
    />
  )
}

export default memo(Note)
