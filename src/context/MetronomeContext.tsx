import { produce } from 'immer';
import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, FC, ReactNode } from 'react';

import { tempoMax, tempoMin } from '../constants';
import type { Groove, Instrument, Note } from '../types/instrument';
import type { Action } from '../utils/actions';
import { createAction } from '../utils/actions';

// `console.log(current(draft.*))` for debug;

/* Actions */

type SwitchInstrumentAction = Action<'SWITCH_INSTRUMENT', number>;
type SetBeatsPerBarAction = Action<'SET_BEATS_PER_BAR', number>;
type SetSubdivisionAction = Action<'SET_SUBDIVISION', number>;
type SetNoteValueAction = Action<'SET_NOTE_VALUE', number>;
type SetTempoAction = Action<'SET_TEMPO', number>;
type SetTitleAction = Action<'SET_TITLE', string>;
type SetGridBeatAction = Action<'SET_GRID_BEAT'>;

type Actions =
  | SwitchInstrumentAction
  | SetBeatsPerBarAction
  | SetSubdivisionAction
  | SetNoteValueAction
  | SetTempoAction
  | SetTitleAction
  | SetGridBeatAction;

export const switchInstrumentAction = createAction<SwitchInstrumentAction>('SWITCH_INSTRUMENT');
export const setBeatsPerBarAction = createAction<SetBeatsPerBarAction>('SET_BEATS_PER_BAR');
export const setSubdivisionAction = createAction<SetSubdivisionAction>('SET_SUBDIVISION');
export const setNoteValueAction = createAction<SetNoteValueAction>('SET_NOTE_VALUE');
export const setTempoAction = createAction<SetTempoAction>('SET_TEMPO');
export const setTitleAction = createAction<SetTitleAction>('SET_TITLE');
export const setGridBeatAction = createAction<SetGridBeatAction>('SET_GRID_BEAT');

/* Reducer */

export interface State extends Groove {
  title: string;
}

const defaultState: State = {
  title: '',
  tempo: 60,
  beatsPerBar: 2,
  noteValue: 4,
  subdivision: 1,
  notes: [{ instrument: 'fxMetronome1' }, { instrument: 'fxMetronome3' }],
};

const reducer = (state: State, action: Actions): State => {
  window._STATE_ = state;

  switch (action.type) {
    case 'SWITCH_INSTRUMENT': {
      return produce(state, (draft) => {
        const noteIndex = action.payload;
        const order: Array<Instrument | null> = [
          null,
          'fxMetronome3',
          'fxMetronome2',
          'fxMetronome1',
        ];

        const next = order.indexOf(draft.notes[noteIndex].instrument) + 1;
        draft.notes[noteIndex].instrument = order[next % order.length];
      });
    }

    case 'SET_BEATS_PER_BAR': {
      return produce(state, (draft) => {
        const beatsPerBar = action.payload;
        const notes: Note[] = Array(beatsPerBar * state.subdivision).fill({
          instrument: 'fxMetronome3',
        });

        for (let i = 0; i < notes.length; i++) {
          if (draft.notes[i]) {
            notes[i] = draft.notes[i];
          }
        }

        draft.notes = notes;
        draft.beatsPerBar = action.payload;
      });
    }

    case 'SET_SUBDIVISION': {
      return produce(state, (draft) => {
        const subdivision = action.payload;
        const notes: Note[] = Array(state.beatsPerBar * subdivision).fill({
          instrument: 'fxMetronome3',
        });

        for (let i = 0; i < notes.length; i++) {
          if (draft.notes[i]) {
            notes[i] = draft.notes[i];
          }
        }

        draft.notes = notes;
        draft.subdivision = action.payload;
      });
    }

    case 'SET_NOTE_VALUE': {
      return produce(state, (draft) => {
        draft.noteValue = action.payload;
      });
    }

    case 'SET_TEMPO': {
      return produce(state, (draft) => {
        draft.tempo = Math.min(Math.max(action.payload, tempoMin), tempoMax);
      });
    }

    case 'SET_TITLE': {
      return produce(state, (draft) => {
        draft.title = action.payload;
      });
    }

    case 'SET_GRID_BEAT': {
      return produce(state, (draft) => {
        draft.notes.map((note, idx) => {
          const isBeat = idx % (draft.notes.length / draft.beatsPerBar) === 0;

          note.instrument = isBeat && draft.subdivision !== 1 ? 'fxMetronome2' : 'fxMetronome3';
          if (idx === 0) note.instrument = 'fxMetronome1';

          return note;
        });
      });
    }

    default: {
      return state;
    }
  }
};

/* Context */

const MetronomeContext = createContext({
  groove: defaultState,
  dispatch: Function.prototype as Dispatch<Actions>,
});

export const GrooveProvider: FC<{ children: ReactNode; initial?: Groove }> = ({
  children,
  initial = {},
}) => {
  const [groove, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...initial,
  });

  return (
    <MetronomeContext.Provider value={{ groove, dispatch }}>{children}</MetronomeContext.Provider>
  );
};

/* Hooks */

export const useMetronomeContext = () => {
  const context = useContext(MetronomeContext);

  if (!context) {
    throw new Error('useMetronomeContext must be used within a <GrooveContext />');
  }

  return context;
};
