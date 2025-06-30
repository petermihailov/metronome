import { memo } from 'react'
import { HslColorPicker } from 'react-colorful'

import { hslObjToStr, hslStrToObj } from '../../../utils/colors'

import classes from './ColorPicker.module.css'

interface ColorPickerProps {
  value: string
  onChange: (hsl: string) => void
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <HslColorPicker
      className={classes.colorPicker}
      color={hslStrToObj(value)}
      onChange={(hsl) => onChange(hslObjToStr(hsl))}
    />
  )
}

export default memo(ColorPicker)
