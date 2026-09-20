import { useEffect } from 'react'

import { createLogger } from '../lib/Logger'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useScreenStore } from '../store/useScreenStore'
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
    ({ every, from, to, step, setFromAction, setToAction, setEveryAction, setStepAction }) => ({
      every,
      from,
      to,
      step,
      setFromAction,
      setToAction,
      setEveryAction,
      setStepAction,
    }),
  )

  // Set from query (понимает и новый формат, и старые ссылки)
  useEffect(() => {
    const { tempo, layout, training } = decodeSettings(getQuery())

    logger.info('setFromQuery', { tempo, layout, training })

    screenStore.setScreenAction(training ? 'training' : 'main')

    if (training) {
      if (training.every) {
        trainingStore.setEveryAction(training.every)
      }

      if (training.from) {
        trainingStore.setFromAction(training.from)
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
    const { every, from, to, step } = trainingStore
    const { subdivisions, bar, tempo } = metronomeStore

    const query = encodeSettings({
      tempo,
      layout: { subdivisions, bar },
      training: screenStore.screen === 'training' ? { every, from, to, step } : null,
    })

    updateQueryDebounced(query)
  }, [metronomeStore, screenStore, trainingStore])
}
