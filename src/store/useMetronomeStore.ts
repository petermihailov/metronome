import { produce } from 'immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'
import { createLogger } from '../lib/Logger'
import type { Instrument, Bar } from '../types/metronome'

const logger = createLogger('METRONOME', { color: '#f07' })

const settingsStorage = new Storage<{
  beats: number
  count: number
  bar: Bar
  subdivision: number
  tempo: number
}>('settings', {
  beats: DEFAULTS.beats,
  count: DEFAULTS.count,
  bar: DEFAULTS.bar,
  subdivision: DEFAULTS.subdivision,
  tempo: DEFAULTS.tempo,
})

const storage = settingsStorage.get()

interface Store {
  // Values
  beats: number
  count: number
  isPlaying: boolean
  bar: Bar
  subdivision: number
  tempo: number

  // Actions
  setBarAction: (bar: Bar) => void
  resetAction: () => void
  setBeatsAction: (beats: number) => void
  setCountAction: (count: number) => void
  setIsPlayingAction: (isPlaying: boolean) => void
  setSubdivisionAction: (subdivision: number) => void
  setTempoAction: (tempo: number) => void
  switchInstrumentAction: (noteIndex: number, instrument: Instrument | null) => void
}

export const useMetronomeStore = createWithEqualityFn<Store>((set) => {
  return {
    beats: storage.beats,
    count: storage.count,
    isPlaying: false,
    bar: storage.bar,
    subdivision: storage.subdivision,
    tempo: storage.tempo,

    setBarAction: (bar) => {
      logger.info('setBarAction', bar)
      set((state) => {
        return produce(state, (draft) => {
          if (bar.length === state.beats * state.subdivision) {
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
          draft.beats = beats

          if (state.beats > beats) {
            draft.bar = state.bar.slice(0, beats * state.subdivision)
          } else {
            // скопируем все удары с последней доли и повторяем столько,
            // сколько битов мы прибавили
            const count = beats - state.beats
            const part = state.bar.slice(-1 * state.subdivision)
            const additions = Array.from({ length: count }, () => part).flat()

            draft.bar = [...state.bar, ...additions]
          }

          settingsStorage.update({
            beats: draft.beats,
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
          draft.subdivision = subdivision
          draft.bar = Array(state.beats * subdivision)
            .fill(null)
            .map((_, idx) => {
              const isBeat = idx % subdivision === 0
              const isDownbeat = idx === 0

              if (subdivision > 1) {
                return {
                  instrument: isDownbeat
                    ? 'fxMetronome1'
                    : isBeat
                      ? 'fxMetronome2'
                      : 'fxMetronome3',
                }
              }

              return {
                instrument: isDownbeat ? 'fxMetronome1' : 'fxMetronome3',
              }
            })

          settingsStorage.update({
            subdivision: draft.subdivision,
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
          draft.beats = beats
          draft.subdivision = subdivision
          draft.bar = [...bar]

          settingsStorage.update({
            tempo: draft.tempo,
            beats: draft.beats,
            subdivision: draft.subdivision,
            bar: draft.bar,
          })
        })
      })
    },
  }
}, shallow)
