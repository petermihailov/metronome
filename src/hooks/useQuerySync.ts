import { useEffect } from 'react'

import { createLogger } from '../lib/Logger'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useScreenStore } from '../store/useScreenStore'
import { useSilenceStore } from '../store/useSilenceStore'
import { useTrainingStore } from '../store/useTrainingStore'
import { decodeSettings, encodeSettings } from '../utils/settingsCodec'
import { debounce } from '../utils/throttling'
import { getQuery, updateQuery } from '../utils/url'

const logger = createLogger('QUERY', { color: '#92b' })

const updateQueryDebounced = debounce((query: string) => {
  logger.info('updateQuery', query)
  updateQuery(query)
}, 200)

export function useQuerySync() {
  const screenStore = useScreenStore((state) => state)
  const metronomeStore = useMetronomeStore(
    ({ subdivisions, bar, setLayoutAction, setTempoAction, tempo }) => ({
      subdivisions,
      bar,
      setLayoutAction,
      setTempoAction,
      tempo,
    }),
  )

  const trainingStore = useTrainingStore(
    ({ every, to, step, setToAction, setEveryAction, setStepAction }) => ({
      every,
      to,
      step,
      setToAction,
      setEveryAction,
      setStepAction,
    }),
  )

  const silenceStore = useSilenceStore(({ play, mute, setPlayAction, setMuteAction }) => ({
    play,
    mute,
    setPlayAction,
    setMuteAction,
  }))

  // Set from query (понимает и новый формат, и старые ссылки)
  useEffect(() => {
    const { tempo, layout, training, silence } = decodeSettings(getQuery())

    logger.info('setFromQuery', { tempo, layout, training, silence })

    screenStore.setScreenAction(training ? 'training' : silence ? 'silence' : 'main')

    if (silence) {
      if (silence.play) {
        silenceStore.setPlayAction(silence.play)
      }

      if (silence.mute) {
        silenceStore.setMuteAction(silence.mute)
      }
    }

    if (training) {
      if (training.every) {
        trainingStore.setEveryAction(training.every)
      }

      if (training.to) {
        trainingStore.setToAction(training.to)
      }

      if (training.step) {
        trainingStore.setStepAction(training.step)
      }
    }

    if (tempo) {
      metronomeStore.setTempoAction(tempo)
    }

    if (layout) {
      metronomeStore.setLayoutAction(layout.subdivisions, layout.bar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update query
  useEffect(() => {
    const { every, to, step } = trainingStore
    const { subdivisions, bar, tempo } = metronomeStore
    const { play, mute } = silenceStore

    const query = encodeSettings({
      tempo,
      layout: { subdivisions, bar },
      training: screenStore.screen === 'training' ? { every, to, step } : null,
      silence: screenStore.screen === 'silence' ? { play, mute } : null,
    })

    updateQueryDebounced(query)
  }, [metronomeStore, screenStore, silenceStore, trainingStore])
}
