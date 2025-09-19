import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store/store'

import App from './App'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig'
import ErrorBoundary from './components/ErrorBoundary'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider 
        authConfig={authConfig}
        loadingComponent={
          <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            Loading...
          </div>
        }
      >
        <Provider store={store}>
          <App />
        </Provider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)