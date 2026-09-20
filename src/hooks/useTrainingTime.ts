import { useEffect, useState } from 'react'

import { useMetronomeStore } from '../store/useMetronomeStore'
import { useTrainingStore } from '../store/useTrainingStore'
import { calculateExactTime } from '../utils/training'

export const useTrainingTime = (formatter?: (time: number) => string) => {
  const [trainingTime, setTrainingTime] = useState(0)

  const { isPlaying } = useMetronomeStore(({ isPlaying }) => ({ isPlaying }))
  // Доля всегда длится 60 / tempo, поэтому время тренировки зависит только от числа долей
  const { beats, tempo } = useMetronomeStore(({ subdivisions, tempo }) => ({
    beats: subdivisions.length,
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
  }, [beats, every, isPlaying, tempo, to, step])

  // формату нужны целые секунды (`timeFormat` использует `lead0`, которому дробное число сломает вывод)
  return formatter ? formatter(Math.floor(trainingTime)) : trainingTime
}
