import React from 'react';

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
          <div className="text-red-700 bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">Something went wrong:</h2>
            <p>{this.state.error}</p>
            <p className="mt-2 text-sm">Check the console for details.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
