import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'
import { createLogger } from '../lib/Logger'

const logger = createLogger('training', { color: '#f07' })

const trainingStorage = new Storage<{
  alternate: boolean
  from: number
  to: number
  every: number
  step: number
}>('training', {
  alternate: false,
  from: DEFAULTS.tempo,
  to: DEFAULTS.tempo + 10,
  every: DEFAULTS.every,
  step: DEFAULTS.step,
})

const storage = trainingStorage.get()!

interface Store {
  // Values
  alternate: boolean
  from: number
  to: number
  every: number
  step: number

  // Actions
  setAlternateAction: (value: boolean) => void
  setFromAction: (value: number) => void
  setToAction: (value: number) => void
  setEveryAction: (value: number) => void
  setStepAction: (value: number) => void
}

export const useTrainingStore = createWithEqualityFn<Store>((set) => {
  return {
    alternate: storage.alternate,
    from: storage.from,
    to: storage.to,
    every: storage.every,
    step: storage.step,

    setAlternateAction: (alternate) => {
      logger.info('setAlternateAction', alternate)
      set((state) => {
        trainingStorage.update({ alternate })
        return { ...state, alternate }
      })
    },

    setFromAction: (from) => {
      from = MINMAX.range('tempo', from)
      logger.info('setFromAction', from)
      set((state) => {
        trainingStorage.update({ from })
        return { ...state, from }
      })
    },

    setToAction: (to) => {
      to = MINMAX.range('tempo', to)
      logger.info('setToAction', to)
      set((state) => {
        trainingStorage.update({ to })
        return { ...state, to }
      })
    },

    setEveryAction: (every) => {
      every = MINMAX.range('every', every)
      logger.info('setEveryAction', every)
      set((state) => {
        trainingStorage.update({ every })
        return { ...state, every }
      })
    },

    setStepAction: (step) => {
      step = MINMAX.range('step', step)
      logger.info('setStepAction', step)
      set((state) => {
        trainingStorage.update({ step })
        return { ...state, step }
      })
    },
  }
}, shallow)
