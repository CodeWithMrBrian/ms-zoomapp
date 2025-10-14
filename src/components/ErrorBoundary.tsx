import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Features:
 * - Error catching and logging
 * - User-friendly error display
 * - Retry functionality
 * - Error details for development
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // In production, send error to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = (): void => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Reload the page to reset application state
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
          <Card variant="default" className="max-w-2xl w-full">
            <CardContent>
              <div className="text-center space-y-6 p-6">
                {/* Error Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Error Title */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Something Went Wrong
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    We encountered an unexpected error. Don't worry, your data is safe.
                  </p>
                </div>

                {/* Error Message (Development Only) */}
                {process.env.NODE_ENV === 'development' && error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-left">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                      Error Details (Development Mode):
                    </p>
                    <p className="text-xs text-red-800 dark:text-red-200 font-mono mb-2">
                      {error.toString()}
                    </p>
                    {errorInfo && (
                      <details className="text-xs text-red-700 dark:text-red-300">
                        <summary className="cursor-pointer hover:underline mb-2">
                          Component Stack
                        </summary>
                        <pre className="overflow-auto max-h-48 whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={this.handleReset}
                    className="w-full"
                  >
                    Reload Application
                  </Button>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>If the problem persists, please contact support:</p>
                    <a
                      href="mailto:support@meetingsync.com"
                      className="text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      support@meetingsync.com
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}
