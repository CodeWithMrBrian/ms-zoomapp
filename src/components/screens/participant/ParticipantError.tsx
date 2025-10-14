// ...existing code...
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

/**
 * ParticipantError Screen (Screen 8)
 *
 * Error states for participants.
 *
 * Error Types:
 * - No active session
 * - Free Zoom user (host must be licensed)
 * - Connection failed
 * - Language not available
 * - Session ended
 */

export type ParticipantErrorType =
  | 'no_session'
  | 'free_zoom_user'
  | 'connection_failed'
  | 'language_unavailable'
  | 'session_ended'
  | 'generic';

interface ParticipantErrorProps {
  errorType: ParticipantErrorType;
  onRetry?: () => void;
  onContactHost?: () => void;
  onLeave?: () => void;
}

export function ParticipantError({
  errorType,
  onRetry,
  onContactHost,
  onLeave
}: ParticipantErrorProps) {
  // Error content configuration
  const errorContent: Record<
    ParticipantErrorType,
    {
      icon: string;
      title: string;
      message: string;
      details?: string;
      actions: Array<{
        label: string;
        variant: 'primary' | 'secondary' | 'tertiary';
        onClick?: () => void;
      }>;
    }
  > = {
    no_session: {
      icon: '',
      title: 'No Active Session',
      message: 'The host hasn\'t started a translation session yet.',
      details: 'Please wait for the host to start the translation, or contact them if you believe this is an error.',
      actions: [
        { label: 'Refresh', variant: 'primary', onClick: onRetry },
        { label: 'Contact Host', variant: 'secondary', onClick: onContactHost }
      ]
    },
    free_zoom_user: {
      icon: '',
      title: 'Translation Not Available',
      message: 'Translation services require a licensed Zoom account.',
      details: 'The host must have a Zoom Pro, Business, or Enterprise account to use MeetingSync. Please inform the host if you need translation services.',
      actions: [
        { label: 'Contact Host', variant: 'primary', onClick: onContactHost },
        { label: 'Close', variant: 'secondary', onClick: onLeave }
      ]
    },
    connection_failed: {
      icon: '',
      title: 'Connection Failed',
      message: 'Unable to connect to the translation service.',
      details: 'This could be due to network issues or service unavailability. Please check your internet connection and try again.',
      actions: [
        { label: 'Retry Connection', variant: 'primary', onClick: onRetry },
        { label: 'Contact Support', variant: 'secondary', onClick: onContactHost },
        { label: 'Leave', variant: 'tertiary', onClick: onLeave }
      ]
    },
    language_unavailable: {
      icon: '',
      title: 'Language Not Available',
      message: 'Your selected language is not available in this session.',
      details: 'The host may have removed this language or changed the session configuration. Please select a different language or contact the host.',
      actions: [
        { label: 'Select Different Language', variant: 'primary', onClick: onRetry },
        { label: 'Contact Host', variant: 'secondary', onClick: onContactHost }
      ]
    },
    session_ended: {
      icon: '',
      title: 'Session Ended',
      message: 'The translation session has ended.',
      details: 'Thank you for using MeetingSync! The host has stopped the translation service.',
      actions: [
        { label: 'Return to Home', variant: 'primary', onClick: onLeave }
      ]
    },
    generic: {
      icon: '',
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred.',
      details: 'Please try again or contact support if the problem persists.',
      actions: [
        { label: 'Try Again', variant: 'primary', onClick: onRetry },
        { label: 'Contact Support', variant: 'secondary', onClick: onContactHost },
        { label: 'Close', variant: 'tertiary', onClick: onLeave }
      ]
    }
  };

  const content = errorContent[errorType];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <Card variant="default" padding="lg" className="max-w-lg w-full">
        <CardContent>
          <div className="text-center space-y-6">
            {/* Icon */}
            {content.icon && (
              <div className="text-7xl">
                {content.icon}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {content.title}
            </h1>

            {/* Message */}
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {content.message}
            </p>

            {/* Details */}
            {content.details && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                  {content.details}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              {content.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  size="lg"
                  onClick={action.onClick}
                  className="w-full"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Help Link */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => window.open('https://support.meetingsync.app', '_blank')}
                className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
              >
                Need help? Visit our support center →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
