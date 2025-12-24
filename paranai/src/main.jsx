import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('main.jsx loaded')

try {
  console.log('Attempting to render App...')
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('App rendered successfully')
} catch (error) {
  console.error('Error rendering App:', error)
  document.getElementById('root').innerHTML = `<h1>Error: ${error.message}</h1>`
}

