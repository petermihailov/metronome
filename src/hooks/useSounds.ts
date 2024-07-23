import { useEffect, useState } from 'react'

import { INSTRUMENTS } from '../constants'
import type { SoundMap } from '../types/common'
import { fetchAndDecodeAudio } from '../utils/audio'

export function useSounds() {
  const [sounds, setSounds] = useState<SoundMap | null>(null)

  useEffect(() => {
    const buffers: SoundMap = {} as SoundMap

    const instrumentPromises = INSTRUMENTS.map(async (instrument) => {
      buffers[instrument] = await fetchAndDecodeAudio(`sounds/${instrument}.mp3`)
    })

    Promise.all(instrumentPromises).then(() => {
      setSounds(buffers)
    })
  }, [])

  return sounds
}
