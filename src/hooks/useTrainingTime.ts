import { useEffect, useState } from 'react'

import { calculateTime } from '../components/blocks/Settings/Training/Training.utils'
import { useMetronomeStore } from '../store/useMetronomeStore'
import { useTrainingStore } from '../store/useTrainingStore'

export const useTrainingTime = (formatter: (time: number) => string) => {
  const [trainingTime, setTrainingTime] = useState(0)

  const { isPlaying } = useMetronomeStore(({ isPlaying }) => ({ isPlaying }))
  const { beats, subdivision, tempo } = useMetronomeStore(({ beats, subdivision, tempo }) => ({
    beats,
    subdivision,
    tempo,
  }))
  const { every, to, step, type } = useTrainingStore(({ every, to, step, type }) => ({
    every,
    to,
    step,
    type,
  }))

  useEffect(() => {
    if (!isPlaying) {
      const from = { beats, tempo, subdivision }[type]
      const time = calculateTime({ key: type, from, to, every, tempo, beats, step })
      setTrainingTime(time)
    }
  }, [beats, subdivision, every, isPlaying, tempo, to, type, step])

  return formatter ? formatter(trainingTime) : trainingTime
}
