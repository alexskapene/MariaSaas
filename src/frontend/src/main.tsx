import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import { AppProviders } from './components/providers'

// Styles
import './assets/main.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
)