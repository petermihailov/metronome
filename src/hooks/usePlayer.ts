import { useEffect, useRef } from 'react'

import { useSounds } from './useSounds'
import { Player } from '../lib/Player'
import { useBeatStore } from '../store/useBeatStore'
import { useMetronomeStore } from '../store/useMetronomeStore'

export function usePlayer() {
  const kit = useSounds()
  const player = useRef(new Player())

  const { isPlaying, beats, notes, tempo, volume, mute } = useMetronomeStore(
    ({ isPlaying, beats, notes, tempo, subdivision, volume, mute }) => ({
      isPlaying,
      beats,
      notes,
      tempo,
      subdivision,
      volume,
      mute,
    }),
  )

  const { setBeatAction, reset } = useBeatStore(({ setBeatAction, reset }) => ({
    setBeatAction,
    reset,
  }))

  /** Initialize */
  useEffect(() => {
    if (kit) {
      player.current.setKit(kit)
      player.current.setOnBeat(setBeatAction)
    }
  }, [kit, setBeatAction])

  /** Sync playing */
  useEffect(() => {
    if (isPlaying) {
      player.current.play()
    } else {
      reset()
      player.current.stop()
    }
  }, [isPlaying, reset])

  /** Sync beats */
  useEffect(() => {
    player.current.setBeats(beats)
  }, [beats])

  /** Sync notes */
  useEffect(() => {
    player.current.setNotes(notes)
  }, [notes])

  /** Sync tempo */
  useEffect(() => {
    player.current.setTempo(tempo)
  }, [tempo])

  /** Sync volume */
  useEffect(() => {
    player.current.setVolume(mute ? 0 : volume)
  }, [volume, mute])
}
