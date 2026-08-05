import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StorePage } from './components/store/StorePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StorePage />
  </StrictMode>,
)
