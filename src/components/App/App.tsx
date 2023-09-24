import { memo, useCallback, useEffect, useRef, useState } from 'react';

import {
  setBeatsPerBarAction,
  setGridBeatAction,
  setSubdivisionAction,
  setTempoAction,
  switchInstrumentAction,
  useMetronomeContext,
} from '../../context/MetronomeContext';
import env from '../../env';
import { useButtonsPreventSpacePress, useHotkeys, usePlayer, useWakeLock } from '../../hooks';
import checkBrowser from '../../utils/checkBrowser';
import { BadBrowser } from '../BadBrowser';
import { Display } from '../Display';
import { Settings } from '../Settings';
import { Version } from '../Version';

import classes from './App.module.css';

const App = () => {
  const { groove, dispatch } = useMetronomeContext();
  const { beat, playing, setPlaying } = usePlayer(groove);

  const refTrainingTimeout = useRef<number>();

  const [isBadBrowser, setIsBadBrowser] = useState(false);

  const setBeats = (value: number) => {
    if (value > 0) {
      dispatch(setBeatsPerBarAction(value));
      dispatch(setGridBeatAction());
    }
  };

  const setSubdivision = (value: number) => {
    if (value > 0) {
      dispatch(setSubdivisionAction(value));
      dispatch(setGridBeatAction());
    }
  };

  const switchInstrument = (noteIndex: number) => {
    dispatch(switchInstrumentAction(noteIndex));
  };

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, [setPlaying]);

  const setTempo = useCallback(
    (tempo: number) => {
      dispatch(setTempoAction(tempo));
    },
    [dispatch],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- ToDo
  const startSubdivisionTraining = (start: number, end: number, every: number) => {
    window.clearTimeout(refTrainingTimeout.current);
    setSubdivision(start);

    const steps = 2 * (end - start);

    for (let i = 1; i <= steps; i++) {
      const idx = i < steps / 2 ? i : steps - i;
      const nextValue = idx + start;

      refTrainingTimeout.current = window.setTimeout(
        () => {
          setSubdivision(nextValue);
        },
        ((i * every * groove.beatsPerBar * 60) / groove.tempo) * 1000 - 100,
      );
    }

    setPlaying(true);
  };

  // WakeLock

  useWakeLock(playing);

  // HotKeys

  useHotkeys(groove.tempo, setTempo, togglePlaying);

  // Disable buttons focus

  useButtonsPreventSpacePress();

  // Initialize

  useEffect(() => {
    setIsBadBrowser(!checkBrowser.test(navigator.userAgent));
  }, []);

  // Render

  if (!env.DEV && isBadBrowser) {
    return <BadBrowser />;
  }

  return (
    <div className={classes.root}>
      <Display
        beatIndex={beat.index}
        beatsPerBar={groove.beatsPerBar}
        notes={groove.notes}
        onNoteClick={switchInstrument}
      />

      <Settings
        beatsPerBar={groove.beatsPerBar}
        isPlaying={playing}
        setBeats={setBeats}
        setSubdivision={setSubdivision}
        setTempo={setTempo}
        subdivision={groove.subdivision}
        tempo={groove.tempo}
        togglePlaying={togglePlaying}
      />

      <Version />
    </div>
  );
};

export default memo(App);
