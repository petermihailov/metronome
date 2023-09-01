import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/theme.css';
import './styles/main.css';
import './styles/helpers.css';

import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GrooveProvider } from './context/MetronomeContext';
import { Sprite } from './icons';

const container = document.querySelector('[data-react-root]');

if (container) {
  const root = createRoot(container);

  root.render(
    <ErrorBoundary>
      <Sprite />
      <GrooveProvider>
        <App />
      </GrooveProvider>
    </ErrorBoundary>,
  );
}
