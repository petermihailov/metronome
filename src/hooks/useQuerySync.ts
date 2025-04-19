import { useEffect } from 'react'

import { MINMAX } from '../constants'
import { createLogger } from '../lib/Logger'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useScreenStore } from '../store/useScreenStore'
import { useTrainingStore } from '../store/useTrainingStore'
import type { Bar, Instrument } from '../types/metronome'
import { debounce } from '../utils/throttling'
import { getQuery, stringifyQuery, updateQuery } from '../utils/url'

const logger = createLogger('QUERY', { color: '#92b' })

const notesMap: Record<number, Instrument | null> = {
  '0': null,
  '1': 'fxMetronome1',
  '2': 'fxMetronome2',
  '3': 'fxMetronome3',
}

const updateQueryDebounced = debounce((query: string) => {
  logger.info('updateQuery', query)
  updateQuery(query)
}, 200)

const parseNumberValue = (value: string) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const parseBarValue = (
  value: string,
  beats: number | null,
  subdivision: number | null,
): Bar | null => {
  try {
    const bar = value.split('').map((num) => {
      const value = parseNumberValue(num)
      if (value === null) throw 'invalid range'

      return { instrument: notesMap[value] }
    })

    return beats && subdivision && bar.length === beats * subdivision ? bar : null
  } catch (_e) {
    return null
  }
}

export function useQuerySync() {
  const screenStore = useScreenStore((state) => state)
  const metronomeStore = useMetronomeStore(
    ({
      beats,
      bar,
      setBeatsAction,
      setBarAction,
      setSubdivisionAction,
      setTempoAction,
      subdivision,
      tempo,
    }) => ({
      beats,
      bar,
      setBeatsAction,
      setBarAction,
      setSubdivisionAction,
      setTempoAction,
      subdivision,
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

  // Set from query
  useEffect(() => {
    const query = getQuery()

    const tempo = parseNumberValue(query.tempo)
    const beats = parseNumberValue(query.beats)
    const subdivision = parseNumberValue(query.subdivision)
    const training = parseNumberValue(query.training)
    const from = parseNumberValue(query.from)
    const to = parseNumberValue(query.to)
    const every = parseNumberValue(query.every)
    const bar = parseBarValue(query.bar, beats, subdivision)

    logger.info('setFromQuery', {
      tempo,
      beats,
      subdivision,
      training,
      from,
      to,
      every,
      bar,
    })

    screenStore.setScreenAction(training === 1 ? 'training' : 'main')

    if (training === 1) {
      if (every) {
        trainingStore.setEveryAction(MINMAX.range('every', every))
      }

      if (from) {
        trainingStore.setFromAction(MINMAX.range('tempo', from))
      }

      if (to) {
        trainingStore.setToAction(MINMAX.range('tempo', to))
      }
    }

    if (tempo) {
      metronomeStore.setTempoAction(MINMAX.range('tempo', tempo))
    }

    if (beats) {
      metronomeStore.setBeatsAction(MINMAX.range('beats', beats))
    }

    if (subdivision) {
      metronomeStore.setSubdivisionAction(MINMAX.range('subdivision', subdivision))
    }

    if (bar) {
      // Beats и Subdivision меняют bar, так что его задаем последним
      metronomeStore.setBarAction(bar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update query
  useEffect(() => {
    const { screen } = screenStore
    const { beats, subdivision, tempo } = metronomeStore
    const { every, from, to, step } = trainingStore

    const bar = metronomeStore.bar.reduce((qs, note) => {
      if (note.instrument === null) {
        return (qs += '0')
      }

      switch (note.instrument) {
        case 'fxMetronome1':
          return (qs += '1')
        case 'fxMetronome2':
          return (qs += '2')
        case 'fxMetronome3':
          return (qs += '3')
        default:
          return (qs += '0')
      }
    }, '')

    const training = screen === 'training'
    const metronomeQuery = { tempo, beats, subdivision, bar }
    const trainingQuery = { training, every, from, to, step }
    const query = training
      ? stringifyQuery({ ...metronomeQuery, ...trainingQuery, training: Number(training) })
      : stringifyQuery(metronomeQuery)

    updateQueryDebounced(query)
  }, [metronomeStore, screenStore, trainingStore])
}
