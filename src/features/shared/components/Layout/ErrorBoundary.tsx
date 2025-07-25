import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Copy, CheckCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  isRetrying: boolean;
  showDetails: boolean;
  stackCopied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isRetrying: false,
      showDetails: false,
      stackCopied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      isRetrying: false 
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // Optional: Send to error reporting service
    // logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });
    
    // Simulate retry delay with animation
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        isRetrying: false,
        showDetails: false,
        stackCopied: false,
      });
    }, 1500);
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  copyStackTrace = async () => {
    if (this.state.error?.stack) {
      try {
        await navigator.clipboard.writeText(this.state.error.stack);
        this.setState({ stackCopied: true });
        setTimeout(() => {
          this.setState({ stackCopied: false });
        }, 2000);
      } catch (err) {
        console.error('Failed to copy stack trace:', err);
      }
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, isRetrying, showDetails, stackCopied } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Main Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 ease-out animate-in slide-in-from-bottom-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <AlertTriangle 
                      size={48} 
                      className="animate-pulse"
                    />
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Oops! Something went wrong</h1>
                    <p className="text-red-100">
                      We've encountered an unexpected error. Don't worry, we're here to help!
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Error Message */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Details</h3>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <p className="text-red-800 font-medium">
                      {error?.name}: {error?.message || 'An unknown error occurred'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={this.handleRetry}
                    disabled={isRetrying}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <RefreshCw 
                      size={18} 
                      className={isRetrying ? 'animate-spin' : ''}
                    />
                    <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  >
                    <RefreshCw size={18} />
                    <span>Reload Page</span>
                  </button>
                </div>

                {/* Developer Details */}
                {isDevelopment && (
                  <div className="border-t pt-6">
                    <button
                      onClick={this.toggleDetails}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium mb-4 transition-colors duration-200"
                    >
                      {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      <span>Developer Information</span>
                    </button>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="space-y-4">
                        {/* Component Stack */}
                        {errorInfo?.componentStack && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Component Stack:</h4>
                            <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto text-gray-700 border">
                              {errorInfo.componentStack}
                            </pre>
                          </div>
                        )}

                        {/* Error Stack */}
                        {error?.stack && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-700">Stack Trace:</h4>
                              <button
                                onClick={this.copyStackTrace}
                                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              >
                                {stackCopied ? (
                                  <>
                                    <CheckCircle size={16} className="text-green-600" />
                                    <span className="text-green-600">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={16} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto text-gray-700 border max-h-48">
                              {error.stack}
                            </pre>
                          </div>
                        )}

                        {/* Additional Info */}
                        <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="font-medium text-yellow-800 mb-1">💡 Development Mode</p>
                          <p>This detailed error information is only shown in development. In production, users will see a simplified error message.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Text */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                  <p>If this problem persists, please contact support or check the console for more details.</p>
                </div>
              </div>
            </div>

            {/* Loading Overlay for Retry */}
            {isRetrying && (
              <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl flex items-center space-x-3">
                  <RefreshCw className="animate-spin text-blue-500" size={24} />
                  <span className="text-gray-700 font-medium">Retrying...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;