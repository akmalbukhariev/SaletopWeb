import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@/styles/tailwind.css"
import "@/styles/global.css"
import App from './App'
import { Provider } from 'react-redux'
import { store } from '@/store'
import AuthProvider from './providers/AuthProvider'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
          <App />
      </AuthProvider>
    </Provider>
  </StrictMode>
)
