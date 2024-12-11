import { produce } from 'immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'
import type { Instrument, Note } from '../types/common'

const settingsStorage = new Storage<{
  beats: number
  count: number
  inputLag: number
  inputLagEnabled: boolean
  isTraining: boolean
  mute: boolean
  notes: Note[]
  subdivision: number
  tempo: number
  volume: number
}>('settings', {
  beats: DEFAULTS.beats,
  count: DEFAULTS.count,
  inputLag: DEFAULTS.inputLag,
  inputLagEnabled: DEFAULTS.inputLagEnabled,
  isTraining: DEFAULTS.isTraining,
  mute: DEFAULTS.mute,
  notes: DEFAULTS.notes,
  subdivision: DEFAULTS.subdivision,
  tempo: DEFAULTS.tempo,
  volume: DEFAULTS.volume,
})

const storage = settingsStorage.get()

interface Store {
  // Values
  beats: number
  count: number
  inputLag: number
  inputLagEnabled: boolean
  isCounting: boolean
  isPlaying: boolean
  isTraining: boolean
  mute: boolean
  notes: Note[]
  subdivision: number
  tempo: number
  volume: number

  // Actions
  applyGridAlignmentAction: () => void
  resetAction: () => void
  setBeatsAction: (beats: number) => void
  setCountAction: (count: number) => void
  setInputLagAction: (value: number) => void
  setInputLagEnabledAction: (enabled: boolean) => void
  setIsCountingAction: (isCounting: boolean) => void
  setIsPlayingAction: (isPlaying: boolean) => void
  setIsTrainingAction: (isTraining: boolean) => void
  setMuteAction: (mute: boolean) => void
  setSubdivisionAction: (subdivision: number) => void
  setTempoAction: (tempo: number) => void
  setVolumeAction: (volume: number) => void
  switchInstrumentAction: (noteIndex: number) => void
}

export const useMetronomeStore = createWithEqualityFn<Store>((set) => {
  return {
    beats: storage.beats,
    count: storage.count,
    inputLag: storage.inputLag,
    inputLagEnabled: storage.inputLagEnabled,
    isCounting: false,
    isPlaying: false,
    isTraining: storage.isTraining,
    mute: storage.mute,
    notes: storage.notes,
    subdivision: storage.subdivision,
    tempo: storage.tempo,
    volume: storage.volume,

    setBeatsAction: (beats) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.beats = MINMAX.range('beats', beats)
          draft.notes = fillOrTrim(draft.notes, beats, draft.subdivision)

          settingsStorage.update({
            beats: draft.beats,
            notes: draft.notes,
          })
        })
      })
    },

    setCountAction: (count) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.count = count
          settingsStorage.update({ count: count })
        })
      })
    },

    setIsPlayingAction: (isPlaying) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.isPlaying = isPlaying
        })
      })
    },

    setIsTrainingAction: (isTraining) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.isTraining = isTraining
          settingsStorage.update({ isTraining: draft.isTraining })
        })
      })
    },

    setIsCountingAction: (isCounting) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.isCounting = isCounting
        })
      })
    },

    setSubdivisionAction: (subdivision) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.subdivision = MINMAX.range('subdivision', subdivision)
          draft.notes = fillOrTrim(draft.notes, draft.beats, subdivision)

          settingsStorage.update({
            subdivision: draft.subdivision,
            notes: draft.notes,
          })
        })
      })
    },

    setTempoAction: (tempo) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.tempo = MINMAX.range('tempo', tempo)
          settingsStorage.update({ tempo: draft.tempo })
        })
      })
    },

    setVolumeAction: (volume) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.volume = volume
          settingsStorage.update({ volume: draft.volume })
        })
      })
    },

    setMuteAction: (mute) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.mute = mute
          settingsStorage.update({ mute: draft.mute })
        })
      })
    },

    setInputLagAction: (inputLag) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.inputLag = MINMAX.range('inputLag', inputLag)
          settingsStorage.update({ inputLag: draft.inputLag })
        })
      })
    },

    setInputLagEnabledAction: (inputLagEnabled) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.inputLagEnabled = inputLagEnabled
          settingsStorage.update({ inputLagEnabled: draft.inputLagEnabled })
        })
      })
    },

    switchInstrumentAction: (noteIndex: number) => {
      set((state) => {
        return produce(state, (draft) => {
          const order: Array<Instrument | null> = [
            null,
            'fxMetronome3',
            'fxMetronome2',
            'fxMetronome1',
          ]

          const next = order.indexOf(draft.notes[noteIndex].instrument) + 1
          draft.notes[noteIndex].instrument = order[next % order.length]

          settingsStorage.update({ notes: draft.notes })
        })
      })
    },

    applyGridAlignmentAction: () => {
      set((state) => {
        return produce(state, (draft) => {
          const { beats, subdivision } = draft

          draft.notes = Array(beats * subdivision)
            .fill({ instrument: 'fxMetronome3' })
            .map((note, idx, arr) => {
              const res = { ...note }
              const isBeat = idx % (arr.length / beats) === 0

              if (isBeat && subdivision !== 1) res.instrument = 'fxMetronome2'
              if (idx === 0) res.instrument = 'fxMetronome1'

              return res
            })

          settingsStorage.update({ notes: draft.notes })
        })
      })
    },

    resetAction: () => {
      set((state) => {
        return produce(state, (draft) => {
          const { tempo, beats, subdivision, notes } = DEFAULTS

          draft.tempo = tempo
          draft.beats = beats
          draft.subdivision = subdivision
          draft.notes = [...notes]

          settingsStorage.update({
            tempo: draft.tempo,
            beats: draft.beats,
            subdivision: draft.subdivision,
            notes: draft.notes,
          })
        })
      })
    },
  }
}, shallow)

// Utils

function fillOrTrim(notes: Note[], beats: number, subdivision: number) {
  return Array(beats * subdivision)
    .fill(null)
    .map((note, idx) => notes[idx] || { instrument: 'fxMetronome3' })
}
