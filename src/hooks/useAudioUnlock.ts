import { useEffect } from 'react'

import { createLogger } from '../lib/Logger'
import { getAudioContext } from '../utils/audio'

const logger = createLogger('AUDIO', { color: '#2af' })

// Будим AudioContext заранее, а не в момент нажатия Play.
// Браузер создаёт контекст в suspended до первого жеста пользователя, а после ухода вкладки
// в фон может усыпить его снова. Если resume() делать прямо перед первой нотой, устройство
// вывода не успевает открыться и первый сильный бит теряется
export function useAudioUnlock() {
  useEffect(() => {
    const audioCtx = getAudioContext()

    const resume = () => {
      if (audioCtx.state === 'running') return

      audioCtx
        .resume()
        .then(() => logger.info('resume', audioCtx.state))
        // Вне жеста пользователя браузер может отказать — тогда разбудим при следующем жесте
        .catch((e) => logger.warn('resume', e))
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resume()
      }
    }

    // pointerup и touchend, а не pointerdown: для touch только они считаются жестом пользователя.
    // capture: чтобы stopPropagation в обработчиках компонентов не мешал
    const events = ['pointerup', 'touchend', 'keydown'] as const
    events.forEach((name) => document.addEventListener(name, resume, true))
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      events.forEach((name) => document.removeEventListener(name, resume, true))
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])
}
