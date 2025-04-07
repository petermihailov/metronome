import clsx from 'clsx'
import { memo } from 'react'

import type { IconName } from '../../../types/icons'

import classes from './Icon.module.css'

export interface IconProps {
  className?: string
  name: IconName
  viewBox?: string
  spritePath?: string
}

const Icon = ({
  name,
  className,
  viewBox = '0 0 24 24',
  spritePath = '/sprite.svg',
}: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      className={clsx(className, classes.icon)}
      fill="currentColor"
      viewBox={viewBox}
    >
      <use href={`${spritePath}#${name}`} />
    </svg>
  )
}

export default memo(Icon)
