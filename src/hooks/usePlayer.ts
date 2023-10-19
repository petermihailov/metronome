import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useSounds } from './useSounds';
import { Player } from '../lib/Player';
import { useBeatStore } from '../store/useBeatStore';
import { useMetronomeStore } from '../store/useMetronomeStore';

export function usePlayer() {
  const kit = useSounds();
  const player = useRef(new Player());

  const { isPlaying, beats, notes, tempo, subdivision } = useMetronomeStore(
    useShallow(({ isPlaying, beats, notes, tempo, subdivision }) => ({
      isPlaying,
      beats,
      notes,
      tempo,
      subdivision,
    })),
  );

  const { setBeatAction, reset } = useBeatStore(
    useShallow(({ setBeatAction, reset }) => ({ setBeatAction, reset })),
  );

  /** Initialize */
  useEffect(() => {
    if (kit) {
      player.current.setKit(kit);
      player.current.setOnBeat(setBeatAction);
    }
  }, [kit, setBeatAction]);

  /** Sync playing */
  useEffect(() => {
    if (isPlaying) {
      player.current.play();
    } else {
      reset();
      player.current.stop();
    }
  }, [isPlaying, reset]);

  /** Sync beats */
  useEffect(() => {
    player.current.setBeats(beats);
  }, [beats]);

  /** Sync notes */
  useEffect(() => {
    player.current.setNotes(notes);
  }, [notes]);

  /** Sync tempo */
  useEffect(() => {
    player.current.setTempo(tempo);
  }, [tempo]);

  /** Sync subdivision */
  useEffect(() => {
    player.current.setSubdivision(subdivision);
  }, [subdivision]);
}
