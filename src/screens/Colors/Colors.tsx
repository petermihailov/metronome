import React, { memo, useCallback, useEffect, useState } from 'react'
import type { HslColor } from 'react-colorful'

import { useColorsHotkeys } from './useColorsHotkeys'
import { Display } from '../../components/blocks/Display'
import { ButtonIcon } from '../../components/ui/ButtonIcon'
import { ColorPicker } from '../../components/ui/ColorPicker'
import { FormRow } from '../../components/ui/FormRow'
import { useColorsStore } from '../../store/useColorsStore'
import type { ColorName } from '../../types/colors'
import { hslObjToStr, hslStrToObj } from '../../utils/colors'

import classes from './Colors.module.css'

const colorsOrder: ColorName[] = [
  'accent1',
  'accent2',
  'backgroundApp',
  'background',
  'border',
  'text',
]

const Colors = () => {
  const [currentColor, setCurrentColor] = useState<ColorName>(colorsOrder[0])

  const { colors, setColorAction, resetColorsAction } = useColorsStore(
    ({ colors, setColorAction, resetColorsAction }) => ({
      colors,
      setColorAction,
      resetColorsAction,
    }),
  )

  const inputClickHandler = useCallback<React.MouseEventHandler<HTMLDivElement>>((e) => {
    if ('tagName' in e.target && e.target.tagName === 'INPUT') {
      ;(e.target as HTMLInputElement).select()
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--hsl-accent-1', colors.accent1)
    document.documentElement.style.setProperty('--hsl-accent-2', colors.accent2)
    document.documentElement.style.setProperty('--hsl-background', colors.background)
    document.documentElement.style.setProperty('--hsl-background-app', colors.backgroundApp)
    document.documentElement.style.setProperty('--hsl-border', colors.border)
    document.documentElement.style.setProperty('--hsl-text', colors.text)
  }, [colors])

  const curHslStr = colors[currentColor]
  const curHslObj = hslStrToObj(curHslStr)

  const prevColor = useCallback(() => {
    setCurrentColor((prev) => {
      const currentIndex = colorsOrder.indexOf(prev)
      const prevIndex = (currentIndex - 1 + colorsOrder.length) % colorsOrder.length
      return colorsOrder[prevIndex]
    })
  }, [])

  const nextColor = useCallback(() => {
    setCurrentColor((prev) => {
      const currentIndex = colorsOrder.indexOf(prev)
      const nextIndex = (currentIndex + 1) % colorsOrder.length
      return colorsOrder[nextIndex]
    })
  }, [])

  const setHslColor = useCallback(
    (hsl: HslColor) => setColorAction(currentColor, hslObjToStr(hsl)),
    [currentColor, setColorAction],
  )

  const resetColor = useCallback(
    () => resetColorsAction(currentColor),
    [currentColor, resetColorsAction],
  )

  useColorsHotkeys(curHslObj, { setHslColor, nextColor, prevColor, resetColor })

  return (
    <>
      <Display />
      <div className={classes.colors}>
        <ColorPicker value={curHslStr} onChange={(hsl) => setColorAction(currentColor, hsl)} />
        <div>
          <FormRow
            after={<ButtonIcon aria-label="next" icon="chevron-right" onClick={nextColor} />}
            before={<ButtonIcon aria-label="prev" icon="chevron-left" onClick={prevColor} />}
            className={classes.switcher}
          >
            <span className={classes.title}>{currentColor}</span>
          </FormRow>

          <div className={classes.hsl} onClick={inputClickHandler}>
            <div>
              <div className={classes.hslItem}>
                <span>hue:</span>
                <input className={classes.input} name="hue" value={curHslObj.h} />
              </div>
              <div className={classes.hslItem}>
                <span>saturation:</span>
                <span>
                  <input className={classes.input} name="saturation" value={curHslObj.s} />%
                </span>
              </div>
              <div className={classes.hslItem}>
                <span>lightness:</span>
                <span>
                  <input className={classes.input} name="lightness" value={curHslObj.l} />%
                </span>
              </div>
            </div>
            <div className={classes.preview}>
              <div
                className={classes.colorPreview}
                style={{ backgroundColor: `hsl(${colors[currentColor]})` }}
              />
              <div className={classes.colorsList}>
                {colorsOrder.map((key) => (
                  <div
                    key={key}
                    className={classes.colorPreviewSmall}
                    style={{ backgroundColor: `hsl(${colors[key]})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <ButtonIcon
            aria-label={`reset ${currentColor}`}
            icon="draft"
            onClick={() => resetColorsAction(currentColor)}
          />
        </div>
      </div>
    </>
  )
}

export default memo(Colors)
