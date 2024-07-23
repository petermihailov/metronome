import { memo } from 'react'

import { UI } from './UI'

const Sprite = () => (
  <svg style={{ display: 'none' }}>
    <UI />
  </svg>
)

export default memo(Sprite)
