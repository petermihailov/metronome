import { produce } from 'immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'
import { createLogger } from '../lib/Logger'
import type { Instrument, Bar } from '../types/metronome'
import {
  defaultBar,
  isValidSubdivisions,
  resizeBeats,
  restoreLayout,
  totalNotes,
  uniformSubdivisions,
} from '../utils/barLayout'

const logger = createLogger('METRONOME', { color: '#f07' })

const settingsStorage = new Storage<{
  count: number
  bar: Bar
  subdivisions?: number[]
  tempo: number
  // Устаревшие поля: остались только ради миграции старых сохранений (см. restoreLayout).
  // Новые данные пишутся в subdivisions, а эти два больше не обновляются.
  beats: number
  subdivision: number
}>('settings', {
  count: DEFAULTS.count,
  bar: DEFAULTS.bar,
  tempo: DEFAULTS.tempo,
  beats: DEFAULTS.beats,
  subdivision: DEFAULTS.subdivision,
})

const storage = settingsStorage.get()
const layout = restoreLayout(storage)

interface Store {
  // Values
  count: number
  isPlaying: boolean
  // Сколько нот в каждой доле; число долей — subdivisions.length
  subdivisions: number[]
  // Плоский такт, bar.length === сумма subdivisions
  bar: Bar
  tempo: number

  // Actions
  setBarAction: (bar: Bar) => void
  setBeatsAction: (beats: number) => void
  setCountAction: (count: number) => void
  setIsPlayingAction: (isPlaying: boolean) => void
  // Одна и та же subdivision для всех долей, такт сбрасывается на шаблон
  setSubdivisionAction: (subdivision: number) => void
  setLayoutAction: (subdivisions: number[], bar: Bar) => void
  setTempoAction: (tempo: number) => void
  switchInstrumentAction: (noteIndex: number, instrument: Instrument | null) => void
  resetAction: () => void
}

export const useMetronomeStore = createWithEqualityFn<Store>((set) => {
  return {
    count: storage.count,
    isPlaying: false,
    subdivisions: layout.subdivisions,
    bar: layout.bar,
    tempo: storage.tempo,

    setBarAction: (bar) => {
      logger.info('setBarAction', bar)
      set((state) => {
        return produce(state, (draft) => {
          if (bar.length === totalNotes(state.subdivisions)) {
            draft.bar = bar

            settingsStorage.update({
              bar: draft.bar,
            })
          }
        })
      })
    },

    setBeatsAction: (beats) => {
      beats = MINMAX.range('beats', beats)
      logger.info('setBeatsAction', beats)

      set((state) => {
        return produce(state, (draft) => {
          const next = resizeBeats(state, beats)

          draft.subdivisions = next.subdivisions
          draft.bar = next.bar

          settingsStorage.update({
            subdivisions: draft.subdivisions,
            bar: draft.bar,
          })
        })
      })
    },

    setCountAction: (count) => {
      logger.info('setCountAction', count)
      set((state) => {
        return produce(state, (draft) => {
          if (!state.isPlaying) {
            draft.count = count
            settingsStorage.update({ count: count })
          }
        })
      })
    },

    setIsPlayingAction: (isPlaying) => {
      logger.info('setIsPlayingAction', isPlaying)
      set((state) => {
        return produce(state, (draft) => {
          draft.isPlaying = isPlaying
        })
      })
    },

    setSubdivisionAction: (subdivision) => {
      subdivision = MINMAX.range('subdivision', subdivision)
      logger.info('setSubdivision', subdivision)

      set((state) => {
        return produce(state, (draft) => {
          draft.subdivisions = uniformSubdivisions(state.subdivisions.length, subdivision)
          draft.bar = defaultBar(draft.subdivisions)

          settingsStorage.update({
            subdivisions: draft.subdivisions,
            bar: draft.bar,
          })
        })
      })
    },

    setLayoutAction: (subdivisions, bar) => {
      if (!isValidSubdivisions(subdivisions) || bar.length !== totalNotes(subdivisions)) {
        logger.warn('setLayoutAction: раскладка невалидна, пропускаем', { subdivisions, bar })
        return
      }

      logger.info('setLayoutAction', { subdivisions, bar })
      set((state) => {
        return produce(state, (draft) => {
          draft.subdivisions = subdivisions
          draft.bar = bar

          settingsStorage.update({
            subdivisions: draft.subdivisions,
            bar: draft.bar,
          })
        })
      })
    },

    setTempoAction: (tempo) => {
      logger.info('setTempo', tempo)
      set((state) => {
        return produce(state, (draft) => {
          draft.tempo = MINMAX.range('tempo', tempo)
          settingsStorage.update({ tempo: draft.tempo })
        })
      })
    },

    switchInstrumentAction: (idx, instrument) => {
      logger.info('switchInstrument', { idx, instrument })
      set((state) => {
        return produce(state, (draft) => {
          draft.bar[idx].instrument = instrument
          settingsStorage.update({ bar: draft.bar })
        })
      })
    },

    resetAction: () => {
      logger.info('reset')
      set((state) => {
        return produce(state, (draft) => {
          const { tempo, beats, subdivision, bar } = DEFAULTS

          draft.tempo = tempo
          draft.subdivisions = uniformSubdivisions(beats, subdivision)
          draft.bar = [...bar]

          settingsStorage.update({
            tempo: draft.tempo,
            subdivisions: draft.subdivisions,
            bar: draft.bar,
          })
        })
      })
    },
  }
}, shallow)
