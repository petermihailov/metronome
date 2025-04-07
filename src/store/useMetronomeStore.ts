import { produce } from 'immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'
import { createLogger } from '../lib/Logger'
import type { Instrument, Grid } from '../types/common'

const logger = createLogger('METRONOME', { enabled: false, color: '#f07' })

const settingsStorage = new Storage<{
  beats: number
  count: number
  isTraining: boolean
  grid: Grid
  subdivision: number
  tempo: number
}>('settings', {
  beats: DEFAULTS.beats,
  count: DEFAULTS.count,
  isTraining: DEFAULTS.isTraining,
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
  isTraining: boolean
  grid: Grid
  subdivision: number
  tempo: number

  // Actions
  applyGridAlignmentAction: () => void
  setGridAction: (grid: Grid) => void
  resetAction: () => void
  setBeatsAction: (beats: number) => void
  setCountAction: (count: number) => void
  setIsPlayingAction: (isPlaying: boolean) => void
  setIsTrainingAction: (isTraining: boolean) => void
  setSubdivisionAction: (subdivision: number) => void
  setTempoAction: (tempo: number) => void
  switchInstrumentAction: (noteIndex: number, instrument: Instrument | null) => void
}

export const useMetronomeStore = createWithEqualityFn<Store>((set) => {
  return {
    beats: storage.beats,
    count: storage.count,
    isPlaying: false,
    isTraining: storage.isTraining,
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
      logger.info('setBeatsAction', beats)
      set((state) => {
        return produce(state, (draft) => {
          draft.beats = MINMAX.range('beats', beats)
          draft.grid = fillOrTrim(draft.grid, beats, draft.subdivision)

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

    setIsTrainingAction: (isTraining) => {
      logger.info('setIsTrainingAction', isTraining)
      set((state) => {
        return produce(state, (draft) => {
          draft.isTraining = isTraining
          settingsStorage.update({ isTraining: draft.isTraining })
        })
      })
    },

    setSubdivisionAction: (subdivision) => {
      logger.info('setSubdivision', subdivision)
      set((state) => {
        return produce(state, (draft) => {
          draft.subdivision = MINMAX.range('subdivision', subdivision)
          draft.grid = fillOrTrim(draft.grid, draft.beats, subdivision)

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

    applyGridAlignmentAction: () => {
      logger.info('applyGridAlignment')
      set((state) => {
        return produce(state, (draft) => {
          const { beats, subdivision } = draft

          draft.grid = Array(beats * subdivision)
            .fill({ instrument: 'fxMetronome3' })
            .map((note, idx, arr) => {
              const res = { ...note }
              const isBeat = idx % (arr.length / beats) === 0

              if (isBeat && subdivision !== 1) res.instrument = 'fxMetronome2'
              if (idx === 0) res.instrument = 'fxMetronome1'

              return res
            })

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

// Utils

function fillOrTrim(grid: Grid, beats: number, subdivision: number) {
  return Array(beats * subdivision)
    .fill(null)
    .map((note, idx) => grid[idx] || { instrument: 'fxMetronome3' })
}
