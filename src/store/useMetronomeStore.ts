import { produce } from 'immer'
import { create } from 'zustand'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'
import type { Instrument, Note } from '../types/common'

const settingsStorage = new Storage<{
  tempo: number
  subdivision: number
  beats: number
  isTraining: boolean
  volume: number
  mute: boolean
  inputLag: number
  inputLagEnabled: boolean
}>('settings', {
  tempo: DEFAULTS.tempo,
  beats: DEFAULTS.beats,
  subdivision: DEFAULTS.subdivision,
  isTraining: DEFAULTS.isTraining,
  volume: DEFAULTS.volume,
  mute: DEFAULTS.mute,
  inputLag: DEFAULTS.inputLag,
  inputLagEnabled: DEFAULTS.inputLagEnabled,
})

const storage = settingsStorage.get()

interface Store {
  // Values
  tempo: number
  subdivision: number
  beats: number
  notes: Note[]
  title: string
  volume: number
  mute: boolean
  inputLag: number
  inputLagEnabled: boolean
  barDuration: number
  isPlaying: boolean
  isTraining: boolean

  // Actions
  setBeatsAction: (beats: number) => void
  setIsPlayingAction: (isPlaying: boolean) => void
  setIsTrainingAction: (isTraining: boolean) => void
  setSubdivisionAction: (subdivision: number) => void
  setTempoAction: (tempo: number) => void
  setInputLagAction: (value: number) => void
  setInputLagEnabledAction: (enabled: boolean) => void
  setTitleAction: (title: string) => void
  setVolumeAction: (volume: number) => void
  setMuteAction: (mute: boolean) => void
  switchInstrumentAction: (noteIndex: number) => void
  resetAction: () => void
}

const getBarDuration = (tempo: number, beats: number) => (60 / tempo) * beats * 1000

export const useMetronomeStore = create<Store>((set) => {
  const tempo = storage?.tempo ?? DEFAULTS.tempo
  const beats = storage?.beats ?? DEFAULTS.beats
  const volume = storage?.volume ?? DEFAULTS.volume
  const mute = storage?.mute ?? DEFAULTS.mute
  const inputLag = storage?.inputLag ?? DEFAULTS.inputLag
  const inputLagEnabled = storage?.inputLagEnabled ?? DEFAULTS.inputLagEnabled
  const subdivision = storage?.subdivision ?? DEFAULTS.subdivision

  return {
    title: '',
    volume,
    mute,
    tempo,
    beats,
    inputLag,
    inputLagEnabled,
    subdivision,
    barDuration: getBarDuration(tempo, beats),
    noteValue: DEFAULTS.noteValue,
    isPlaying: false,
    isTraining: storage?.isTraining ?? DEFAULTS.isTraining,
    notes: [{ instrument: 'fxMetronome1' }, { instrument: 'fxMetronome3' }],

    setBeatsAction: (beats) =>
      set((state) => {
        return produce(state, (draft) => {
          beats = MINMAX.range('beats', beats)
          const notes: Note[] = Array(beats * state.subdivision)

          draft.beats = beats
          draft.notes = gridAlignment(notes, beats, state.subdivision)
          draft.barDuration = getBarDuration(draft.tempo, draft.beats)
          settingsStorage.update({ beats })
        })
      }),

    setIsPlayingAction: (isPlaying) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.isPlaying = isPlaying
        })
      }),

    setIsTrainingAction: (isTraining) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.isTraining = isTraining
          settingsStorage.update({ isTraining })
        })
      }),

    setSubdivisionAction: (subdivision) =>
      set((state) => {
        return produce(state, (draft) => {
          subdivision = MINMAX.range('subdivision', subdivision)
          const notes: Note[] = Array(state.beats * subdivision)

          draft.subdivision = subdivision
          draft.notes = gridAlignment(notes, state.beats, subdivision)
          settingsStorage.update({ subdivision })
        })
      }),

    setTempoAction: (tempo) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.tempo = MINMAX.range('tempo', tempo)
          draft.barDuration = getBarDuration(draft.tempo, draft.beats)
          settingsStorage.update({ tempo })
        })
      }),

    setTitleAction: (title) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.title = title
        })
      }),

    setVolumeAction: (volume) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.volume = volume
          settingsStorage.update({ volume })
        })
      }),

    setMuteAction: (mute) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.mute = mute
          settingsStorage.update({ mute })
        })
      }),

    setInputLagAction: (inputLag) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.inputLag = MINMAX.range('inputLag', inputLag)
          settingsStorage.update({ inputLag })
        })
      }),

    setInputLagEnabledAction: (inputLagEnabled) =>
      set((state) => {
        return produce(state, (draft) => {
          draft.inputLagEnabled = inputLagEnabled
          settingsStorage.update({ inputLagEnabled })
        })
      }),

    switchInstrumentAction: (noteIndex: number) =>
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
        })
      }),

    resetAction: () =>
      set((state) => {
        console.log('resetAction')
        return produce(state, (draft) => {
          const { tempo, beats, subdivision } = DEFAULTS

          draft.tempo = tempo
          draft.beats = beats
          draft.subdivision = subdivision
          settingsStorage.update({ tempo, beats, subdivision })
        })
      }),
  }
})

// Utils
function gridAlignment(notes: Note[], beats: number, subdivision: number) {
  const res: Note[] = []

  for (let i = 0; i < notes.length; i++) {
    const isBeat = i % (notes.length / beats) === 0

    res[i] = {
      instrument: isBeat && subdivision !== 1 ? 'fxMetronome2' : 'fxMetronome3',
    }

    if (i === 0) res[i].instrument = 'fxMetronome1'
  }

  return res
}
