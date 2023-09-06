import { useEffect, useRef, useState } from 'react';

import { useDrumKit } from './useDrumKit';
import { Player } from '../../lib/Player';
import type { Groove, Beat } from '../../types/instrument';

const beatDefault: Beat = {
  index: 0,
  note: {
    instrument: 'fxMetronome1',
  },
};

export function usePlayer(groove: Groove) {
  const { tempo, notes } = groove;

  const kit = useDrumKit();
  const player = useRef(new Player());

  const [playing, setPlaying] = useState(false);
  const [subdivision, setSubdivision] = useState<number>(1);
  const [muted, setMuted] = useState(false);
  const [beat, setBeat] = useState<Beat>(beatDefault);

  // Sync playing
  useEffect(() => {
    if (playing) {
      player.current.play();
    } else {
      setBeat(beatDefault);
      player.current.stop();
    }
  }, [playing]);

  // Sync muted
  useEffect(() => {
    if (muted) {
      player.current.mute();
    } else {
      player.current.unmute();
    }
  }, [muted]);

  // Sync beatsPerBar
  useEffect(() => {
    player.current.setBeatsPerBar(groove.beatsPerBar);
  }, [groove.beatsPerBar]);

  // Sync noteValue
  useEffect(() => {
    player.current.setNoteValue(groove.noteValue);
  }, [groove.noteValue]);

  // Sync notes
  useEffect(() => {
    player.current.setNotes(notes);
  }, [notes]);

  // Sync tempo
  useEffect(() => {
    player.current.setTempo(tempo);
  }, [tempo]);

  // Sync subdivision
  useEffect(() => {
    player.current.setSubdivision(subdivision || 1);
  }, [subdivision]);

  // Initialize
  useEffect(() => {
    if (kit) {
      player.current.setKit(kit);
      player.current.setOnBeat(setBeat);
    }
  }, [kit]);

  return {
    beat,
    playing,
    setPlaying,
    subdivision,
    setSubdivision,
    muted,
    setMuted,
  };
}
