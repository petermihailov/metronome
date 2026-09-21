import { useEffect, useRef } from 'react'

import { useSounds } from './useSounds'
import { Player } from '../lib/Player'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useScreenStore } from '../store/useScreenStore'
import { useSilenceStore } from '../store/useSilenceStore'
import { useTickStore } from '../store/useTickStore'

export function usePlayer() {
  const kit = useSounds()
  const player = useRef(new Player())

  const { isPlaying, subdivisions, bar, tempo, count } = useMetronomeStore(
    ({ isPlaying, subdivisions, bar, tempo, count }) => ({
      count,
      isPlaying,
      subdivisions,
      bar,
      tempo,
    }),
  )

  const isSilenceScreen = useScreenStore(({ screen }) => screen === 'silence')
  const { play, mute } = useSilenceStore(({ play, mute }) => ({ play, mute }))

  const { onBeforeScheduledAction, onTickAction, resetAction } = useTickStore(
    ({ onBeforeScheduledAction, onTickAction, resetAction }) => ({
      onBeforeScheduledAction,
      onTickAction,
      resetAction,
    }),
  )

  /** Initialize */
  useEffect(() => {
    if (kit) {
      player.current.setKit(kit)
    }
  }, [kit])

  /** Sync ticks */
  useEffect(() => {
    player.current.setOnTick((tick) => {
      onTickAction(tick)
    })
  }, [onTickAction])

  useEffect(() => {
    player.current.setBeforeTickScheduled(onBeforeScheduledAction)
  }, [onBeforeScheduledAction])

  /** Sync playing */
  useEffect(() => {
    if (isPlaying) {
      player.current.play()
    } else {
      resetAction()
      player.current.stop()
    }
  }, [isPlaying, resetAction])

  /** Sync layout: раскладка и такт меняются в сторе одним действием, передаём их вместе */
  useEffect(() => {
    player.current.setLayout(subdivisions, bar)
  }, [subdivisions, bar])

  /** Sync tempo */
  useEffect(() => {
    player.current.setTempo(tempo)
  }, [tempo])

  /** Sync count */
  useEffect(() => {
    player.current.setCounting(count)
  }, [count])

  /** Sync silence: глушим такты только на экране silence */
  useEffect(() => {
    player.current.setSilence(isSilenceScreen ? { play, mute } : null)
  }, [isSilenceScreen, play, mute])
}
