
import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { AudioVideoSettingsPage } from '../pages/AudioVideoSettingsPage';
import { NotificationSettingsPage } from '../pages/NotificationSettingsPage';
import { AppearanceSettingsPage } from '../pages/AppearanceSettingsPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { SecuritySettingsPage } from '../pages/SecuritySettingsPage';

/**
 * PreferencesTab Component
 *
 * User preferences and app settings.
 *
 * Features:
 * - Navigation to settings pages
 * - User profile
 * - Audio/video settings
 * - Notification preferences
 * - Appearance customization
 * - Security & privacy
 */

type PreferencesView = 'main' | 'profile' | 'audio-video' | 'notifications' | 'appearance' | 'security';

export function PreferencesTab() {
  const [currentView, setCurrentView] = useState<PreferencesView>('main');

  // Navigate to settings page
  const handleNavigate = (view: PreferencesView) => {
    setCurrentView(view);
  };

  // Back to main menu
  const handleBackToMain = () => {
    setCurrentView('main');
  };

  // Render settings pages
  if (currentView === 'profile') {
    return <UserProfilePage onBack={handleBackToMain} />;
  }

  if (currentView === 'audio-video') {
    return <AudioVideoSettingsPage onBack={handleBackToMain} />;
  }

  if (currentView === 'notifications') {
    return <NotificationSettingsPage onBack={handleBackToMain} />;
  }

  if (currentView === 'appearance') {
    return <AppearanceSettingsPage onBack={handleBackToMain} />;
  }

  if (currentView === 'security') {
    return <SecuritySettingsPage onBack={handleBackToMain} />;
  }

  // Settings menu items
  const settingsMenu = [
    {
      id: 'profile' as PreferencesView,
      title: 'User Profile',
      description: 'Manage your personal information and account details',
      icon: '👤'
    },
    {
      id: 'audio-video' as PreferencesView,
      title: 'Audio & Video',
      description: 'Configure microphone, speaker, and camera settings',
      icon: '🎤'
    },
    {
      id: 'notifications' as PreferencesView,
      title: 'Notifications',
      description: 'Control email and in-app notification preferences',
      icon: '🔔'
    },
    {
      id: 'appearance' as PreferencesView,
      title: 'Appearance',
      description: 'Customize theme, font size, and display options',
      icon: '🎨'
    },
    {
      id: 'security' as PreferencesView,
      title: 'Security & Privacy',
      description: 'Manage sessions, data export, and account security',
      icon: '🔒'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Settings & Preferences
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configure your MeetingSync experience
        </p>
      </div>

      {/* Settings Menu */}
      <div className="space-y-3">
        {settingsMenu.map(item => (
          <Card
            key={item.id}
            variant="hover"
            padding="lg"
            onClick={() => handleNavigate(item.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card variant="default" padding="lg" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardContent>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            About Settings
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Your settings are saved to your account and will sync across all devices where you use MeetingSync. Changes take effect immediately after saving.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
