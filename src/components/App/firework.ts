import confetti from 'canvas-confetti'

import { randomInRange } from '../../utils/math'

const defaults = {
  spread: 360,
  ticks: 75,
  gravity: 0.9,
  decay: 0.95,
  origin: { x: 0.5, y: 0.45 },
  colors: ['0ef', 'f07'],
  disableForReducedMotion: true,
}

const shoot = (origin: confetti.Origin) => {
  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 1.8,
    startVelocity: 30,
    origin,
    drift: randomInRange(-1, 1),
    shapes: ['star'],
  })

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 1.5,
    startVelocity: 25,
    origin,
    drift: randomInRange(-0.5, 0.5),
    shapes: ['star'],
  })

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 1,
    startVelocity: 20,
    shapes: ['star'],
  })

  confetti({
    ...defaults,
    particleCount: 20,
    startVelocity: 15,
    scalar: 1,
    shapes: ['circle'],
  })
}

export const firework = () => {
  shoot({ x: randomInRange(0.4, 0.6), y: randomInRange(0.35, 0.55) })
  window.setTimeout(shoot, randomInRange(0, 100), {
    x: randomInRange(0.4, 0.6),
    y: randomInRange(0.35, 0.55),
  })
  window.setTimeout(shoot, randomInRange(0, 250), {
    x: randomInRange(0.4, 0.6),
    y: randomInRange(0.35, 0.55),
  })
}
