import { useState } from 'react';
import { Tabs, Tab } from '../../ui/Tabs';
import { ActivityTab } from '../../features/ActivityTab';
import { TemplatesTab } from '../../features/TemplatesTab';
import { GlossariesTab } from '../../features/GlossariesTab';
import { AccountTab } from '../../features/AccountTab';
import { PreferencesTab } from '../../features/PreferencesTab';

/**
 * HostSettings Screen (Screen 3)
 *
 * Tabbed interface for managing all host settings.
 *
 * Tabs:
 * 1. Activity - Session history and usage stats (Wordly-style)
 * 2. Templates - Saved session configurations
 * 3. Glossaries - Custom terminology management
 * 4. Account - Billing, invoices, subscription
 * 5. Preferences - App settings and notifications
 */

interface HostSettingsProps {
  onBack: () => void;
  defaultTab?: string;
  onAddPaymentMethod?: () => void; // Callback to open AddPaymentMethodModal
}

export function HostSettings({ onBack, defaultTab = 'activity', onAddPaymentMethod }: HostSettingsProps) {
  const tabs: Tab[] = [
    {
      id: 'activity',
      label: 'Activity',
      content: <ActivityTab />
    },
    {
      id: 'templates',
      label: 'Templates',
      content: <TemplatesTab />
    },
    {
      id: 'glossaries',
      label: 'Glossaries',
      content: <GlossariesTab />
    },
    {
      id: 'account',
      label: 'Account',
      content: <AccountTab onAddPaymentMethod={onAddPaymentMethod} />
    },
    {
      id: 'preferences',
      label: 'Preferences',
      content: <PreferencesTab />
    }
  ];

  const [currentTab, setCurrentTab] = useState(defaultTab);

  // Get current tab label
  const getCurrentTabLabel = () => {
    const tab = tabs.find(t => t.id === currentTab);
    return tab?.label || 'Settings';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-lg px-6 py-4 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-white">MeetingSync - Settings</h1>
          <button
            onClick={onBack}
            className="text-white hover:text-teal-100 transition-colors text-sm font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={onBack}
            className="text-teal-100 hover:text-white transition-colors"
          >
            Home
          </button>
          <span className="text-teal-200">/</span>
          <span className="text-white font-medium">{getCurrentTabLabel()}</span>
        </nav>
      </div>

      {/* Tabbed Interface */}
      <Tabs
        tabs={tabs}
        defaultTab={defaultTab}
        onChange={setCurrentTab}
      />
    </div>
  );
}
