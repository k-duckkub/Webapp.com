import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GameRegistrationPage } from './components/registration/GameRegistrationPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameRegistrationPage />
  </StrictMode>,
)
