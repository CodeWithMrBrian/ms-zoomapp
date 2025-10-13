import React, { useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number; // milliseconds
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Toast Notification Component
 *
 * Displays temporary notification messages.
 * Auto-dismisses after duration (default 3 seconds).
 *
 * Usage:
 * ```tsx
 * const [toast, setToast] = useState({ visible: false, message: '', variant: 'success' });
 *
 * <Toast
 *   message={toast.message}
 *   variant={toast.variant}
 *   isVisible={toast.visible}
 *   onClose={() => setToast({ ...toast, visible: false })}
 * />
 *
 * // Show toast:
 * setToast({ visible: true, message: 'Saved successfully!', variant: 'success' });
 * ```
 */
export function Toast({
  message,
  variant = 'info',
  duration = 3000,
  isVisible,
  onClose
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const variantStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-slide-up">
      <div
        className={`
          ${variantStyles[variant]}
          px-4 py-3 rounded-lg shadow-lg
          flex items-center gap-3
          min-w-[300px] max-w-md
        `}
        role="alert"
      >
        <div className="flex-shrink-0">
          {icons[variant]}
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * useToast Hook
 *
 * Convenient hook for managing toast state.
 *
 * Usage:
 * ```tsx
 * const { toast, showToast, hideToast } = useToast();
 *
 * <Toast {...toast} />
 *
 * // Show toast:
 * showToast('Payment method added!', 'success');
 * ```
 */
export function useToast() {
  const [toast, setToast] = React.useState<{
    isVisible: boolean;
    message: string;
    variant: ToastVariant;
  }>({
    isVisible: false,
    message: '',
    variant: 'info'
  });

  const showToast = (message: string, variant: ToastVariant = 'info') => {
    setToast({ isVisible: true, message, variant });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return {
    toast: {
      ...toast,
      onClose: hideToast
    },
    showToast,
    hideToast
  };
}
