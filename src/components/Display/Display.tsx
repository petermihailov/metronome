import { memo, useEffect, useRef } from 'react';

import type { Note as NoteType } from '../../types/instrument';
import { Note } from '../Note';

import classes from './Display.module.css';

export interface DisplayProps {
  beatIndex?: number;
  notes: NoteType[];
  beatsPerBar: number;
  onNoteClick?: (idx: number) => void;
}

const Display = ({ beatIndex, notes, beatsPerBar, onNoteClick }: DisplayProps) => {
  const refIndicator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (beatIndex !== undefined) {
      const partIndex = beatIndex % (notes.length / beatsPerBar);

      if (partIndex === 0) {
        refIndicator.current?.classList.remove(classes.accent, classes.regular);
        refIndicator.current?.offsetTop;

        if (beatIndex === 0) {
          refIndicator.current?.classList.add(classes.accent);
        } else {
          refIndicator.current?.classList.add(classes.regular);
        }
      }
    }
  }, [beatIndex, beatsPerBar, notes.length]);

  return (
    <div className={classes.display}>
      <div
        className={classes.notes}
        style={{
          gap: `min(var(--size-3), calc(var(--size-3) / ${0.2 * notes.length}))`,
        }}
      >
        {notes.map((note, idx) => (
          <Note
            key={idx}
            active={Boolean(beatIndex === idx)}
            className={classes.note}
            note={note}
            onClick={() => onNoteClick?.(idx)}
          />
        ))}
      </div>

      <div ref={refIndicator} className={classes.indicator} />
    </div>
  );
};

export default memo(Display);
