import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { tempoMax, tempoMin } from '../../constants';
import {
  setBeatsPerBarAction,
  setSubdivisionAction,
  setTempoAction,
  switchInstrumentAction,
  useMetronomeContext,
} from '../../context/MetronomeContext';
import env from '../../env';
import { usePlayer } from '../../hooks';
import checkBrowser from '../../utils/checkBrowser';
import { BadBrowser } from '../BadBrowser';
import { ButtonPlay } from '../ButtonPlay';
import { InputNumber } from '../InputNumber';
import { Note } from '../Note';
import { Range } from '../Range';

import classes from './App.module.css';

const App = () => {
  const { groove, dispatch } = useMetronomeContext();

  const { beat, playing, setPlaying: setPlayingState } = usePlayer(groove);

  const refIndicator = useRef<HTMLDivElement>(null);
  const refLockWindow = useRef<WakeLockSentinel>();

  const [isBadBrowser, setIsBadBrowser] = useState(false);
  // const { countDown, stop, start, isPlaying } = useCountdown();

  const setPlaying = useCallback(
    async (isPlaying: boolean) => {
      if (isPlaying) {
        refLockWindow.current = await navigator.wakeLock.request('screen');
        console.log('lock');
      } else {
        refLockWindow.current?.release().then(() => {
          console.log('release');
        });
      }

      setPlayingState(isPlaying);
    },
    [setPlayingState],
  );

  const setBeats = (value: number) => {
    if (value > 0) {
      dispatch(setBeatsPerBarAction(value));
    }
  };

  const setSubdivision = (value: number) => {
    if (value > 0) {
      dispatch(setSubdivisionAction(value));
    }
  };

  const switchInstrument = (noteIndex: number) => {
    dispatch(switchInstrumentAction(noteIndex));
  };

  const togglePlaying = useCallback(async () => {
    setPlaying(!playing);
  }, [playing, setPlaying]);

  const setTempo = useCallback(
    (tempo: number) => {
      dispatch(setTempoAction(tempo));
    },
    [dispatch],
  );

  // useEffect(() => {
  //   setPlaying(isPlaying);
  // }, [isPlaying, setPlaying]);

  useEffect(() => {
    const callback = () => {
      if (document.activeElement?.tagName === 'BUTTON') {
        (document.activeElement as HTMLButtonElement).blur();
      }
    };

    document.addEventListener('click', callback);
    return () => document.removeEventListener('click', callback);
  }, []);

  useEffect(() => {
    const hotkeyCallback = (event: KeyboardEvent) => {
      const eventTarget = event.target as HTMLInputElement | null;

      if (eventTarget?.tagName === 'INPUT' && eventTarget?.type === 'number') {
        return;
      }

      if (event.code === 'Space') {
        const eventTarget = event.target as HTMLInputElement | null;

        if (eventTarget?.tagName === 'INPUT' && eventTarget?.type === 'number') {
          eventTarget.blur();
        }

        togglePlaying();
      }

      if (event.shiftKey) {
        if (event.code === 'ArrowUp') {
          // call your function to do the thing
          setTempo(groove.tempo + 10);
        }

        if (event.code === 'ArrowDown') {
          // call your function to do the thing
          setTempo(groove.tempo - 10);
        }
      } else {
        if (event.code === 'ArrowUp') {
          // call your function to do the thing
          setTempo(groove.tempo + 1);
        }

        if (event.code === 'ArrowDown') {
          // call your function to do the thing
          setTempo(groove.tempo - 1);
        }
      }
    };
    // event = keyup or keydown
    document.addEventListener('keydown', hotkeyCallback);

    return () => {
      document.removeEventListener('keydown', hotkeyCallback);
    };
  }, [groove.tempo, setPlaying, setTempo, togglePlaying]);

  useEffect(() => {
    if (beat) {
      const partIndex = beat.index % (groove.notes.length / groove.beatsPerBar);

      if (partIndex === 0) {
        refIndicator.current?.classList.remove(classes.accent, classes.regular);
        refIndicator.current?.offsetTop;

        if (beat.index === 0) {
          refIndicator.current?.classList.add(classes.accent);
        } else {
          refIndicator.current?.classList.add(classes.regular);
        }
      }
    }
  }, [beat, groove.beatsPerBar, groove.noteValue, groove.notes.length]);

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
      <div className={classes.display}>
        <div
          className={classes.notes}
          style={{
            gap: `min(var(--size-3), calc(var(--size-3) / ${0.1 * groove.notes.length}))`,
          }}
        >
          {groove.notes.map((note, idx) => (
            <Note
              key={idx}
              active={Boolean(beat && beat.index === idx)}
              beat={
                groove.notes.length !== groove.beatsPerBar &&
                idx % (groove.notes.length / groove.beatsPerBar) === 0
              }
              className={classes.note}
              note={note}
              onClick={() => switchInstrument(idx)}
            />
          ))}
        </div>

        <div ref={refIndicator} className={classes.indicator} />
      </div>

      <div className={classes.tempo}>
        <ButtonPlay active playing={playing} onClick={togglePlaying} />
        <Range
          className={classes.bpm}
          max={tempoMax}
          min={tempoMin}
          value={groove.tempo}
          onChange={setTempo}
        />
      </div>

      <InputNumber label="beats" min={1} value={groove.beatsPerBar} onChange={setBeats} />
      <InputNumber
        label="subdivision"
        min={1}
        value={groove.subdivision}
        onChange={setSubdivision}
      />

      {/*<div>*/}
      {/*  {countDown.minutes}: {countDown.seconds}*/}
      {/*</div>*/}
      {/*<button onClick={() => start(10)}>timer 3</button>*/}
      {/*<button> timer 5</button>*/}
      {/*<button> timer 8</button>*/}

      {/*<Controls*/}
      {/*  groove={groove}*/}
      {/*  playing={playing}*/}
      {/*  onSetTempo={setTempo}*/}
      {/*  onTogglePlaying={togglePlaying}*/}
      {/*/>*/}

      {/*<pre>*/}
      {/*  tempo: {groove.tempo}{'\n'}*/}
      {/*  notes: {JSON.stringify(groove.notes)}*/}
      {/*</pre>*/}
    </div>
  );
};

export default memo(App);
