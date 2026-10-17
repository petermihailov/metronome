import { useEffect, useState } from 'react'

import { INSTRUMENTS } from '../constants'
import { createLogger } from '../lib/Logger'
import type { SoundMap } from '../types/metronome'
import { fetchAndDecodeAudio } from '../utils/audio'

const logger = createLogger('SOUNDS', { color: '#2af' })

export function useSounds() {
  const [sounds, setSounds] = useState<SoundMap | null>(null)
  // Звуки не загрузились (офлайн без кэша, 404, не декодировались) — играть нечем
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const buffers: SoundMap = {} as SoundMap

    const instrumentPromises = INSTRUMENTS.map(async (instrument) => {
      buffers[instrument] = await fetchAndDecodeAudio(`sounds/${instrument}.mp3`)
    })

    Promise.all(instrumentPromises)
      .then(() => {
        setSounds(buffers)
      })
      .catch((e) => {
        logger.error('load', e)
        setError(e)
      })
  }, [])

  return { sounds, error }
}
