import { produce } from 'immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import type { TrainingType } from '../components/blocks/Settings/Training/Training.types'
import { DEFAULTS } from '../constants'
import { Storage } from '../lib/LocalStorage'

const trainingStorage = new Storage<{
  alternate: boolean
  from: number
  to: number
  every: number
  step: number
  type: TrainingType
}>('settings', {
  alternate: false,
  from: DEFAULTS.tempo,
  to: DEFAULTS.tempo + 20,
  every: DEFAULTS.every,
  step: DEFAULTS.step,
  type: 'tempo',
})

const storage = trainingStorage.get()!

interface Store {
  // Values
  alternate: boolean
  from: number
  to: number
  every: number
  step: number
  type: TrainingType

  // Actions
  setAlternateAction: (value: boolean) => void
  setFromAction: (value: number) => void
  setToAction: (value: number) => void
  setEveryAction: (value: number) => void
  setStepAction: (value: number) => void
  setTypeAction: (value: TrainingType) => void
}

export const useTrainingStore = createWithEqualityFn<Store>((set) => {
  return {
    alternate: storage.alternate,
    from: storage.from,
    to: storage.to,
    every: storage.every,
    step: storage.step,
    type: storage.type,

    setAlternateAction: (alternate) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.alternate = alternate
          trainingStorage.update({ alternate })
        })
      })
    },

    setFromAction: (from) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.from = from
          trainingStorage.update({ from })
        })
      })
    },

    setToAction: (to) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.to = to
          trainingStorage.update({ to })
        })
      })
    },

    setEveryAction: (every) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.every = every
          trainingStorage.update({ every })
        })
      })
    },

    setStepAction: (step) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.step = step
          trainingStorage.update({ step })
        })
      })
    },

    setTypeAction: (type) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.type = type
          trainingStorage.update({ type })
        })
      })
    },
  }
}, shallow)
