import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import type { Note as NoteType } from '../../types/common';

import classes from './Note.module.css';

export interface NoteProps {
  className?: string;
  note: NoteType;
  beat?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const Note = ({ className, note, beat, active, ...restProps }: NoteProps) => {
  const refNote = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) {
      refNote.current?.classList.add(classes.active);
    } else {
      refNote.current?.classList.remove(classes.active);
    }
  }, [active]);

  return (
    <button
      ref={refNote}
      className={clsx(className, classes.note, {
        [classes.beat]: beat,
        [classes.sound1]: note.instrument === 'fxMetronome1',
        [classes.sound2]: note.instrument === 'fxMetronome2',
        [classes.sound3]: note.instrument === 'fxMetronome3',
      })}
      type="button"
      {...restProps}
    />
  );
};

export default Note;
