// components/ErrorBoundary.jsx
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-md w-full text-center card !p-12 shadow-2xl">
            <div className="text-8xl mb-8">🛠️</div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Under <span className="text-primary-600">Maintenance</span></h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-10">We encountered a temporary technical glitch. Our engineers are already on it!</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn-primary w-full !py-4 shadow-xl !text-[10px] font-black uppercase tracking-widest"
            >
              Return to Safe Zone
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary
