import clsx from 'clsx'
import { memo, useCallback, useEffect } from 'react'

import { useThemeStore } from '../../../store/useThemeStore'
import { hex2hsl, hsl2hex, hslStrToObj } from '../../../utils/colors'
import { FormRow } from '../../ui/FormRow'

import classes from './ThemeSettings.module.css'

const ThemeSettings = () => {
  const { colors, setColorAction, resetColorsAction } = useThemeStore(
    ({ colors, setColorAction, resetColorsAction }) => ({
      colors,
      setColorAction,
      resetColorsAction,
    }),
  )

  const handleChangeAccent1: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setColorAction('accent1', hex2hsl(e.target.value).hsl),
    [setColorAction],
  )

  const handleChangeAccent2: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setColorAction('accent2', hex2hsl(e.target.value).hsl),
    [setColorAction],
  )

  const handleChangeBackground: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setColorAction('background', hex2hsl(e.target.value).hsl),
    [setColorAction],
  )

  const handleChangeBackgroundApp: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setColorAction('backgroundApp', hex2hsl(e.target.value).hsl),
    [setColorAction],
  )

  const handleChangeBorder: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setColorAction('border', hex2hsl(e.target.value).hsl),
    [setColorAction],
  )

  const handleChangeText: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setColorAction('text', hex2hsl(e.target.value).hsl),
    [setColorAction],
  )

  useEffect(() => {
    document.documentElement.style.setProperty('--hsl-accent-1', colors.accent1)
    document.documentElement.style.setProperty('--hsl-accent-2', colors.accent2)
    document.documentElement.style.setProperty('--hsl-background', colors.background)
    document.documentElement.style.setProperty('--hsl-background-app', colors.backgroundApp)
    document.documentElement.style.setProperty('--hsl-border', colors.border)
    document.documentElement.style.setProperty('--hsl-text', colors.text)
  }, [colors])

  return (
    <div className={clsx(classes.themeSettings)}>
      <FormRow title="accent-1">
        <input
          className={classes.inputColor}
          type="color"
          value={hsl2hex(hslStrToObj(colors.accent1))}
          onChange={handleChangeAccent1}
        />
      </FormRow>
      <FormRow title="accent-2">
        <input
          type="color"
          value={hsl2hex(hslStrToObj(colors.accent2))}
          onChange={handleChangeAccent2}
        />
      </FormRow>
      <FormRow title="background">
        <input
          type="color"
          value={hsl2hex(hslStrToObj(colors.background))}
          onChange={handleChangeBackground}
        />
      </FormRow>
      <FormRow title="background-app">
        <input
          type="color"
          value={hsl2hex(hslStrToObj(colors.backgroundApp))}
          onChange={handleChangeBackgroundApp}
        />
      </FormRow>
      <FormRow title="border">
        <input
          type="color"
          value={hsl2hex(hslStrToObj(colors.border))}
          onChange={handleChangeBorder}
        />
      </FormRow>
      <FormRow title="text">
        <input type="color" value={hsl2hex(hslStrToObj(colors.text))} onChange={handleChangeText} />
      </FormRow>
      <button onClick={resetColorsAction}>reset</button>
    </div>
  )
}

export default memo(ThemeSettings)
