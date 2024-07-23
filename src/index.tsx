import { createRoot } from 'react-dom/client'

import './styles/reset.css'
import './styles/fonts.css'
import './styles/theme.css'
import './styles/main.css'
import './styles/helpers.css'

import { App } from './components/App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Sprite } from './components/icons'
import { BadBrowser } from './components/ui/BadBrowser'
import env from './env'
import checkBrowser from './utils/checkBrowser'

const container = document.querySelector('[data-react-root]')

if (container) {
  const root = createRoot(container)
  const isBadBrowser = !checkBrowser.test(navigator.userAgent)

  root.render(
    <ErrorBoundary>
      <Sprite />
      {!env.DEV && isBadBrowser ? <BadBrowser /> : <App />}
    </ErrorBoundary>,
  )
}
