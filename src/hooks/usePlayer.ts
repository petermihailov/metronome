import { useEffect, useRef } from 'react'

import { useSounds } from './useSounds'
import { Player } from '../lib/Player'
import { useBeatStore } from '../store/useBeatStore'
import { useMetronomeStore } from '../store/useMetronomeStore'

export function usePlayer() {
  const kit = useSounds()
  const player = useRef(new Player())

  const { isPlaying, isTraining, isCounting, beats, notes, tempo, volume, mute } =
    useMetronomeStore(
      ({ isPlaying, isTraining, isCounting, beats, notes, tempo, subdivision, volume, mute }) => ({
        isCounting,
        isPlaying,
        isTraining,
        beats,
        notes,
        tempo,
        subdivision,
        volume,
        mute,
      }),
    )

  const { setBeatAction, resetAction } = useBeatStore(({ setBeatAction, resetAction }) => ({
    setBeatAction,
    resetAction,
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
      if (isTraining) {
        player.current.setIsCounting(true)
      }

      player.current.play()
    } else {
      resetAction()
      player.current.stop()
    }
  }, [isPlaying, isTraining, resetAction])

  /** Sync countinf */
  useEffect(() => {
    player.current.setIsCounting(isCounting)
  }, [isCounting])

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
