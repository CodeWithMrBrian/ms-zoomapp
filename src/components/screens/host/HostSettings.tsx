import { useState } from 'react';
import { Tabs, Tab } from '../../ui/Tabs';
import { NavigationHeader } from '../../ui/NavigationHeader';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Navigation Header with Breadcrumbs */}
      <NavigationHeader
        title="Settings"
        onBack={onBack}
        backLabel="Back"
        breadcrumbs={[
          { label: 'Home', onClick: onBack },
          { label: getCurrentTabLabel() }
        ]}
      />

      {/* Tabbed Interface */}
      <Tabs
        tabs={tabs}
        defaultTab={defaultTab}
        onChange={setCurrentTab}
      />
    </div>
  );
}
