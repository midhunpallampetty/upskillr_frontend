import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { GlobalProvider } from './context/GlobalState'
import ErrorBoundary from './features/shared/components/Layout/ErrorBoundary'
createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
    <GlobalProvider>
      <App />

    </GlobalProvider>
    </ErrorBoundary>
)
