import type { ReactNode } from 'react'
import { memo } from 'react'

import type { IconName } from '../../../types/icons'

interface SpriteItemProps {
  id: IconName
  children?: ReactNode
  viewBox?: string
}

export const SpriteItem = memo(function SpriteItem({ id, children, viewBox }: SpriteItemProps) {
  return (
    <symbol id={id} viewBox={viewBox}>
      {children}
    </symbol>
  )
})
