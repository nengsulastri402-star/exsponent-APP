import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SiswaProvider from './lib/SiswaProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiswaProvider>
        <App />
      </SiswaProvider>
    </BrowserRouter>
  </StrictMode>,
)
