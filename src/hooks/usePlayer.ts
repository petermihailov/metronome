import { useEffect, useRef } from 'react'

import { useSounds } from './useSounds'
import { createLogger } from '../lib/Logger'
import { Player } from '../lib/Player'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useScreenStore } from '../store/useScreenStore'
import { useSilenceStore } from '../store/useSilenceStore'
import { useTickStore } from '../store/useTickStore'

const logger = createLogger('PLAYER', { color: '#2af' })

export function usePlayer() {
  const { sounds: kit, error: soundsError } = useSounds()
  const player = useRef(new Player())

  const { isPlaying, subdivisions, bar, tempo, count, setIsPlayingAction } = useMetronomeStore(
    ({ isPlaying, subdivisions, bar, tempo, count, setIsPlayingAction }) => ({
      count,
      isPlaying,
      subdivisions,
      bar,
      tempo,
      setIsPlayingAction,
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

  /** Sync playing: kit в зависимостях, потому что без загруженных звуков play() ничего не делает,
   * и его нужно позвать ещё раз, когда они придут */
  useEffect(() => {
    if (isPlaying) {
      // Звуки не загрузились — играть нечем, снимаем «играет», чтобы UI не завис
      if (soundsError) {
        setIsPlayingAction(false)
        return
      }

      // Старт не удался (например, браузер отказал в resume()) — тоже снимаем «играет»
      player.current.play().catch((e) => {
        logger.error('play', e)
        setIsPlayingAction(false)
      })
    } else {
      resetAction()
      player.current.stop()
    }
  }, [isPlaying, kit, soundsError, resetAction, setIsPlayingAction])

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
