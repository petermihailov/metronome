import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/theme.css';
import './styles/main.css';
import './styles/helpers.css';

import { App } from './components/App';
import { BadBrowser } from './components/BadBrowser';
import { ErrorBoundary } from './components/ErrorBoundary';
import env from './env';
import { Sprite } from './icons';
import checkBrowser from './utils/checkBrowser';

const container = document.querySelector('[data-react-root]');

if (container) {
  const root = createRoot(container);
  const isBadBrowser = !checkBrowser.test(navigator.userAgent);

  root.render(
    <ErrorBoundary>
      <Sprite />
      {!env.DEV && isBadBrowser ? <BadBrowser /> : <App />}
    </ErrorBoundary>,
  );
}
