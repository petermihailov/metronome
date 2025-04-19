import { produce } from 'immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'
import { createLogger } from '../lib/Logger'
import type { Instrument, Grid } from '../types/metronome'

const logger = createLogger('METRONOME', { color: '#f07' })

const settingsStorage = new Storage<{
  beats: number
  count: number
  grid: Grid
  subdivision: number
  tempo: number
}>('settings', {
  beats: DEFAULTS.beats,
  count: DEFAULTS.count,
  grid: DEFAULTS.grid,
  subdivision: DEFAULTS.subdivision,
  tempo: DEFAULTS.tempo,
})

const storage = settingsStorage.get()

interface Store {
  // Values
  beats: number
  count: number
  isPlaying: boolean
  grid: Grid
  subdivision: number
  tempo: number

  // Actions
  setGridAction: (grid: Grid) => void
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
    grid: storage.grid,
    subdivision: storage.subdivision,
    tempo: storage.tempo,

    setGridAction: (grid: Grid) => {
      logger.info('setGridAction', grid)
      set((state) => {
        return produce(state, (draft) => {
          if (grid.length === state.beats * state.subdivision) {
            draft.grid = grid

            settingsStorage.update({
              grid: draft.grid,
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
            draft.grid = state.grid.slice(0, beats * state.subdivision)
          } else {
            // скопируем все удары с последней доли и повторяем столько,
            // сколько битов мы прибавили
            const count = beats - state.beats
            const part = state.grid.slice(-1 * state.subdivision)
            const additions = Array.from({ length: count }, () => part).flat()

            draft.grid = [...state.grid, ...additions]
          }

          settingsStorage.update({
            beats: draft.beats,
            grid: draft.grid,
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
          draft.grid = Array(state.beats * subdivision)
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
            grid: draft.grid,
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
          draft.grid[idx].instrument = instrument
          settingsStorage.update({ grid: draft.grid })
        })
      })
    },

    resetAction: () => {
      logger.info('reset')
      set((state) => {
        return produce(state, (draft) => {
          const { tempo, beats, subdivision, grid } = DEFAULTS

          draft.tempo = tempo
          draft.beats = beats
          draft.subdivision = subdivision
          draft.grid = [...grid]

          settingsStorage.update({
            tempo: draft.tempo,
            beats: draft.beats,
            subdivision: draft.subdivision,
            grid: draft.grid,
          })
        })
      })
    },
  }
}, shallow)
