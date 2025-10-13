import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';

export interface NotificationSettingsPageProps {
  onBack: () => void;
}

/**
 * NotificationSettingsPage Component
 *
 * Configure email and in-app notification preferences.
 */
export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const { toast, showToast } = useToast();

  // Email notifications
  const [sessionSummaries, setSessionSummaries] = useState(true);
  const [usageWarnings, setUsageWarnings] = useState(true);
  const [billingReminders, setBillingReminders] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  // In-app notifications
  const [sound, setSound] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [showPreviews, setShowPreviews] = useState(true);

  // Digest frequency
  const [digestFrequency, setDigestFrequency] = useState('daily');

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Preferences', onClick: onBack },
    { label: 'Notifications' }
  ];

  const handleSaveSettings = () => {
    showToast('Notification settings saved successfully', 'success');
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
              Back to Preferences
            </Button>
          </div>

          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Notification Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Toggle
                  enabled={sessionSummaries}
                  onChange={setSessionSummaries}
                  label="Session Summaries"
                  description="Receive email summaries after each session"
                />

                <Toggle
                  enabled={usageWarnings}
                  onChange={setUsageWarnings}
                  label="Usage Warnings"
                  description="Get notified when approaching usage limits"
                />

                <Toggle
                  enabled={billingReminders}
                  onChange={setBillingReminders}
                  label="Billing Reminders"
                  description="Reminders about upcoming payments and invoices"
                />

                <Toggle
                  enabled={productUpdates}
                  onChange={setProductUpdates}
                  label="Product Updates"
                  description="News about new features and improvements"
                />
              </div>
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Toggle
                  enabled={sound}
                  onChange={setSound}
                  label="Sound"
                  description="Play sound for notifications"
                />

                <Toggle
                  enabled={desktopNotifications}
                  onChange={setDesktopNotifications}
                  label="Desktop Notifications"
                  description="Show desktop notifications when app is running"
                />

                <Toggle
                  enabled={showPreviews}
                  onChange={setShowPreviews}
                  label="Show Previews"
                  description="Display notification content in preview"
                />
              </div>
            </CardContent>
          </Card>

          {/* Digest Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>Digest Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                label="Email Digest Frequency"
                options={[
                  { value: 'realtime', label: 'Real-time (as they happen)' },
                  { value: 'daily', label: 'Daily Digest' },
                  { value: 'weekly', label: 'Weekly Digest' }
                ]}
                value={digestFrequency}
                onChange={(e) => setDigestFrequency(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Receive a summary of your notifications at your preferred frequency
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast {...toast} />
    </div>
  );
}
