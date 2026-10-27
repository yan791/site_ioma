import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/playfair-display/wght.css'
import '@fontsource-variable/playfair-display/wght-italic.css'
import '@fontsource-variable/jost/wght.css'
import '@fontsource/allura/400.css'
import './estilos/base.css'
import './estilos/secoes.css'
import App from './App'

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
