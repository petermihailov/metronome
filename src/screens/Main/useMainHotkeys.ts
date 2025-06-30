import { useMemo } from 'react'

import type { HotkeysMap } from '../../hooks'
import { useHotkeys } from '../../hooks'
import { useMetronomeStore } from '../../store/useMetronomeStore'
import { tapTempo } from '../../utils/metronome'

export const useMainHotkeys = () => {
  const {
    isPlaying,
    tempo,
    beats,
    subdivision,
    setIsPlayingAction,
    setTempoAction,
    setBeatsAction,
    setSubdivisionAction,
    resetAction,
  } = useMetronomeStore(
    ({
      isPlaying,
      tempo,
      beats,
      subdivision,
      setIsPlayingAction,
      setTempoAction,
      setBeatsAction,
      setSubdivisionAction,
      resetAction,
    }) => ({
      isPlaying,
      tempo,
      beats,
      subdivision,
      setIsPlayingAction,
      setTempoAction,
      setBeatsAction,
      setSubdivisionAction,
      resetAction,
    }),
  )

  const hotkeys: HotkeysMap = useMemo(() => {
    const increaseActiveValue = (increase: number) => () => {
      const name = (document.activeElement as HTMLInputElement)?.name

      switch (name) {
        case 'tempo': {
          setTempoAction(tempo + increase)
          break
        }

        case 'subdivision': {
          setSubdivisionAction(subdivision + increase)
          break
        }

        case 'beats': {
          setBeatsAction(beats + increase)
          break
        }

        default:
          setTempoAction(tempo + increase)
      }
    }

    return {
      Space: () => setIsPlayingAction(!isPlaying),
      KeyT: () => {
        const t = tapTempo.tap()
        if (t) setTempoAction(t)
      },
      KeyR: () => resetAction(),

      // разные приращения децимальных значений:
      'alt+ArrowUp': increaseActiveValue(5),
      'alt+ArrowDown': increaseActiveValue(-5),
      'shift+ArrowUp': increaseActiveValue(10),
      'shift+ArrowDown': increaseActiveValue(-10),
      ArrowUp: increaseActiveValue(1),
      ArrowDown: increaseActiveValue(-1),
    }
  }, [
    setTempoAction,
    tempo,
    setSubdivisionAction,
    subdivision,
    setBeatsAction,
    beats,
    setIsPlayingAction,
    isPlaying,
    resetAction,
  ])

  useHotkeys(hotkeys)
}
