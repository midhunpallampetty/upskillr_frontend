import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { GlobalProvider } from './context/GlobalState'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalProvider>
      <App />

    </GlobalProvider>
  </StrictMode>,
)
