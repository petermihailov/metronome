import { memo, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useBeatStore } from '../../store/useBeatStore';
import { useMetronomeStore } from '../../store/useMetronomeStore';
import { Note } from '../Note';

import classes from './Display.module.css';

const Display = () => {
  const { notes, beats, switchInstrumentAction } = useMetronomeStore(
    useShallow(({ notes, beats, switchInstrumentAction }) => ({
      notes,
      beats,
      switchInstrumentAction,
    })),
  );

  const { beat } = useBeatStore(useShallow(({ beat }) => ({ beat })));

  const refIndicator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const partIndex = beat.index % (notes.length / beats);

    if (partIndex === 0) {
      refIndicator.current?.classList.remove(classes.accent, classes.regular);
      refIndicator.current?.offsetTop;

      if (beat.index === 0) {
        refIndicator.current?.classList.add(classes.accent);
      } else {
        refIndicator.current?.classList.add(classes.regular);
      }
    }
  }, [beat.index, beats, notes.length]);

  return (
    <div className={classes.display}>
      <div
        className={classes.notes}
        style={{
          gap: `min(2ch, calc(var(--size-3) / ${0.2 * notes.length}))`,
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
    </div>
  );
};

export default memo(Display);
