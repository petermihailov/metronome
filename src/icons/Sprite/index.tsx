import { memo } from 'react';

import { Groups } from './Groups';
import { NotesIcons } from './Notes';
import { NotesDuration } from './NotesDuration';
import { UI } from './UI';

export const Sprite = memo(function Sprite() {
  return (
    <svg style={{ display: 'none' }}>
      <NotesIcons />
      <NotesDuration />
      <Groups />
      <UI />
    </svg>
  );
});
