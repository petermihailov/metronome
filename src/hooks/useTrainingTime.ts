import { useEffect, useState } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'
import { useTrainingStore } from '../store/useTrainingStore'
import { calculateExactTime } from '../utils/training'

export const useTrainingTime = (formatter?: (time: number) => string) => {
  const [trainingTime, setTrainingTime] = useState(0)

  const { isPlaying } = useMetronomeStore(({ isPlaying }) => ({ isPlaying }))
  const { beats, subdivision, tempo } = useMetronomeStore(({ beats, subdivision, tempo }) => ({
    beats,
    subdivision,
    tempo,
  }))
  const { every, to, step } = useTrainingStore(({ every, to, step }) => ({
    every,
    to,
    step,
  }))

  useEffect(() => {
    if (!isPlaying) {
      const time = calculateExactTime({ from: tempo, to, every, tempo, beats, step })
      setTrainingTime(time)
    }
  }, [beats, subdivision, every, isPlaying, tempo, to, step])

  // формату нужны целые секунды (`timeFormat` использует `lead0`, которому дробное число сломает вывод)
  return formatter ? formatter(Math.floor(trainingTime)) : trainingTime
}
