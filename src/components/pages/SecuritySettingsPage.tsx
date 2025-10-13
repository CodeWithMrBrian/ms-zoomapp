import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';
import { ConfirmationModal } from '../ui/ConfirmationModal';

export interface SecuritySettingsPageProps {
  onBack: () => void;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

// Mock active sessions
const ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'session_001',
    device: 'Chrome on Windows 11',
    location: 'New York, NY, USA',
    lastActive: '2 minutes ago',
    isCurrent: true
  },
  {
    id: 'session_002',
    device: 'Safari on iPhone 14',
    location: 'New York, NY, USA',
    lastActive: '1 hour ago',
    isCurrent: false
  },
  {
    id: 'session_003',
    device: 'Chrome on macOS',
    location: 'Boston, MA, USA',
    lastActive: '3 days ago',
    isCurrent: false
  }
];

/**
 * SecuritySettingsPage Component
 *
 * Manage active sessions, data export, and account deletion.
 */
export function SecuritySettingsPage({ onBack }: SecuritySettingsPageProps) {
  const { toast, showToast } = useToast();
  const [sessions, setSessions] = useState<ActiveSession[]>(ACTIVE_SESSIONS);
  const [showSignOutAllConfirm, setShowSignOutAllConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [sessionToSignOut, setSessionToSignOut] = useState<string | null>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Account', onClick: onBack },
    { label: 'Security' }
  ];

  const handleSignOutSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    setSessionToSignOut(null);
    showToast('Session signed out successfully', 'success');
  };

  const handleSignOutAll = () => {
    setSessions(sessions.filter(s => s.isCurrent));
    setShowSignOutAllConfirm(false);
    showToast('All other sessions signed out', 'success');
  };

  const handleRequestDataExport = () => {
    showToast('Data export request submitted. You will receive an email with a download link within 24 hours.', 'info');
  };

  const handleDeleteAccount = () => {
    showToast('Account deletion request submitted', 'info');
    setShowDeleteAccountConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="tertiary" onClick={onBack} className="gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Account
            </Button>
          </div>

          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Security Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Sessions</CardTitle>
                {sessions.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowSignOutAllConfirm(true)}
                  >
                    Sign Out All Devices
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {session.device}
                        </p>
                        {session.isCurrent && (
                          <Badge variant="success" size="sm">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Last active {session.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSignOutSession(session.id)}
                      >
                        Sign Out
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {sessions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No active sessions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Request a copy of your data including sessions, transcripts, and account information.
                </p>

                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    We'll email you a secure download link within 24 hours. The link will be valid for 7 days.
                  </p>
                </div>

                <Button variant="outline" onClick={handleRequestDataExport}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Request Data Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      Warning: This action is permanent
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Deleting your account will permanently remove all your data, including sessions, transcripts, glossaries, and templates. This action cannot be undone.
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteAccountConfirm(true)}
                >
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sign Out All Confirmation */}
      <ConfirmationModal
        isOpen={showSignOutAllConfirm}
        onClose={() => setShowSignOutAllConfirm(false)}
        onConfirm={handleSignOutAll}
        title="Sign Out All Devices?"
        message="This will sign you out of all devices except the current one. You'll need to sign in again on those devices."
        confirmText="Sign Out All"
        variant="warning"
      />

      {/* Delete Account Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteAccountConfirm}
        onClose={() => setShowDeleteAccountConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="This will permanently delete your account and all associated data. This action cannot be undone. Are you absolutely sure?"
        confirmText="Delete Account"
        variant="danger"
      />

      {/* Toast */}
      <Toast {...toast} />
    </div>
  );
}
