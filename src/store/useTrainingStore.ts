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
  count: number
  type: TrainingType
}>('settings', {
  alternate: false,
  from: DEFAULTS.tempo,
  to: DEFAULTS.tempo + 20,
  every: DEFAULTS.every,
  step: DEFAULTS.step,
  count: DEFAULTS.count,
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
  count: number
  type: TrainingType

  // Actions
  setAlternate: (value: boolean) => void
  setFrom: (value: number) => void
  setTo: (value: number) => void
  setEvery: (value: number) => void
  setStep: (value: number) => void
  setCount: (value: number) => void
  setType: (value: TrainingType) => void
}

export const useTrainingStore = createWithEqualityFn<Store>((set) => {
  return {
    alternate: storage.alternate,
    from: storage.from,
    to: storage.to,
    every: storage.every,
    step: storage.step,
    count: storage.count,
    type: storage.type,

    setAlternate: (alternate) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.alternate = alternate
          trainingStorage.update({ alternate })
        })
      })
    },

    setFrom: (from) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.from = from
          trainingStorage.update({ from })
        })
      })
    },

    setTo: (to) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.to = to
          trainingStorage.update({ to })
        })
      })
    },

    setEvery: (every) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.every = every
          trainingStorage.update({ every })
        })
      })
    },

    setStep: (step) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.step = step
          trainingStorage.update({ step })
        })
      })
    },

    setCount: (count) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.count = count
          trainingStorage.update({ count })
        })
      })
    },

    setType: (type) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.type = type
          trainingStorage.update({ type })
        })
      })
    },
  }
}, shallow)
