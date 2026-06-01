import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CombinedRegistrationPage } from './components/registration/CombinedRegistrationPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CombinedRegistrationPage />
  </StrictMode>,
)
