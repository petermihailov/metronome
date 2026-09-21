import { produce } from 'immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import { DEFAULTS, MINMAX } from '../constants'
import { Storage } from '../lib/LocalStorage'

const silenceStorage = new Storage<{
  silencePlay: number
  silenceMute: number
}>('settings', {
  silencePlay: DEFAULTS.silencePlay,
  silenceMute: DEFAULTS.silenceMute,
})

const storage = silenceStorage.get()!

interface Store {
  // Values
  play: number // сколько тактов играем
  mute: number // сколько тактов молчим

  // Actions
  setPlayAction: (value: number) => void
  setMuteAction: (value: number) => void
}

export const useSilenceStore = createWithEqualityFn<Store>((set) => {
  return {
    play: storage.silencePlay,
    mute: storage.silenceMute,

    setPlayAction: (play) => {
      play = MINMAX.range('silencePlay', play)

      set((state) => {
        return produce(state, (draft) => {
          draft.play = play
          silenceStorage.update({ silencePlay: play })
        })
      })
    },

    setMuteAction: (mute) => {
      mute = MINMAX.range('silenceMute', mute)

      set((state) => {
        return produce(state, (draft) => {
          draft.mute = mute
          silenceStorage.update({ silenceMute: mute })
        })
      })
    },
  }
}, shallow)
