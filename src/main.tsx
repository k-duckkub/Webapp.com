import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RegistrationPage } from './components/registration/RegistrationPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RegistrationPage />
  </StrictMode>,
)
