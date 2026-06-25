import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) { console.error('App error:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#f7f5f0', fontFamily: 'Inter, sans-serif', padding: 32
        }}>
          <div style={{
            background: '#fff', border: '1px solid rgba(30,20,10,0.10)',
            borderRadius: 20, padding: '40px 36px', maxWidth: 420, textAlign: 'center',
            boxShadow: '0 8px 40px rgba(30,20,10,0.08)'
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: '#1d3461', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#5a5240', fontSize: 14, marginBottom: 24 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: 'linear-gradient(135deg, #1d3461, #2d5498)',
                color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)