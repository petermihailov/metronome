import { memo } from 'react'

import { InputNumber } from '../../components/ui/InputNumber'
import { InputRange } from '../../components/ui/InputRange'
import { MINMAX } from '../../constants'
import { useMetronomeStore } from '../../store/useMetronomeStore'
import { useSilenceStore } from '../../store/useSilenceStore'

import classes from './Silence.module.css'

const Silence = () => {
  const {
    isPlaying,
    beats,
    subdivision,
    tempo,
    setBeatsAction,
    setSubdivisionAction,
    setTempoAction,
  } = useMetronomeStore(
    ({ subdivisions, tempo, isPlaying, setBeatsAction, setSubdivisionAction, setTempoAction }) => ({
      isPlaying,
      beats: subdivisions.length,
      // При неравномерной раскладке показываем subdivision первой доли,
      // а изменение выставляет выбранное значение всем долям
      subdivision: subdivisions[0],
      tempo,
      setBeatsAction,
      setSubdivisionAction,
      setTempoAction,
    }),
  )

  const { play, mute, setPlayAction, setMuteAction } = useSilenceStore(
    ({ play, mute, setPlayAction, setMuteAction }) => ({
      play,
      mute,
      setPlayAction,
      setMuteAction,
    }),
  )

  // Во время игры настройки не меняем: упражнение идёт с фиксированными параметрами
  const disabled = isPlaying

  return (
    <div className={classes.silence}>
      <InputRange
        active={true}
        disabled={disabled}
        inputOnly={true}
        max={MINMAX.tempo.max}
        min={MINMAX.tempo.min}
        title="tempo"
        value={tempo}
        onChange={setTempoAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.beats.max}
        min={MINMAX.beats.min}
        title="beats"
        value={beats}
        onChange={setBeatsAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.subdivision.max}
        min={MINMAX.subdivision.min}
        title="subdivision"
        value={subdivision}
        onChange={setSubdivisionAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.silencePlay.max}
        min={MINMAX.silencePlay.min}
        title="play (bars)"
        value={play}
        onChange={setPlayAction}
      />

      <InputNumber
        disabled={disabled}
        max={MINMAX.silenceMute.max}
        min={MINMAX.silenceMute.min}
        title="mute (bars)"
        value={mute}
        onChange={setMuteAction}
      />
    </div>
  )
}

export default memo(Silence)
