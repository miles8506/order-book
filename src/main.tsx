// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/variables.css'
import './style/main.css'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />,
  // {/* </StrictMode>, */}
)
