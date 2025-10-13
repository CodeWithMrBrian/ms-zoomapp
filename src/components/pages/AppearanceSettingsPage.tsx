import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';

export interface AppearanceSettingsPageProps {
  onBack: () => void;
}

/**
 * AppearanceSettingsPage Component
 *
 * Configure UI appearance, theme, fonts, and localization.
 */
export function AppearanceSettingsPage({ onBack }: AppearanceSettingsPageProps) {
  const { toast, showToast } = useToast();

  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState(2); // 0=small, 1=medium, 2=large
  const [displayDensity, setDisplayDensity] = useState('comfortable');
  const [uiLanguage, setUiLanguage] = useState('en');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Preferences', onClick: onBack },
    { label: 'Appearance' }
  ];

  const handleSaveSettings = () => {
    showToast('Appearance settings saved successfully', 'success');
  };

  const fontSizeLabels = ['Small', 'Medium', 'Large'];
  const fontSizePx = [14, 16, 18];

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
            Appearance Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${theme === 'system'
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={theme === 'system'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">System</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Follow system theme preference
                    </p>
                  </div>
                </label>

                <label
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${theme === 'light'
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Light</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Always use light theme
                    </p>
                  </div>
                </label>

                <label
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${theme === 'dark'
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Dark</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Always use dark theme
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Font Size */}
          <Card>
            <CardHeader>
              <CardTitle>Font Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Small</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="flex-1 mx-4"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Large</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">Preview:</p>
                  <p
                    style={{ fontSize: `${fontSizePx[fontSize]}px` }}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Current: {fontSizeLabels[fontSize]} ({fontSizePx[fontSize]}px)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Density */}
          <Card>
            <CardHeader>
              <CardTitle>Display Density</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${displayDensity === 'compact'
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="density"
                    value="compact"
                    checked={displayDensity === 'compact'}
                    onChange={(e) => setDisplayDensity(e.target.value)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Compact</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Show more content with less spacing
                    </p>
                  </div>
                </label>

                <label
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${displayDensity === 'comfortable'
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="density"
                    value="comfortable"
                    checked={displayDensity === 'comfortable'}
                    onChange={(e) => setDisplayDensity(e.target.value)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Comfortable</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Balanced spacing for readability
                    </p>
                  </div>
                </label>

                <label
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${displayDensity === 'spacious'
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="density"
                    value="spacious"
                    checked={displayDensity === 'spacious'}
                    onChange={(e) => setDisplayDensity(e.target.value)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Spacious</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Maximum spacing for accessibility
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  label="UI Language"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish (Español)' },
                    { value: 'fr', label: 'French (Français)' },
                    { value: 'de', label: 'German (Deutsch)' },
                    { value: 'ja', label: 'Japanese (日本語)' }
                  ]}
                  value={uiLanguage}
                  onChange={(e) => setUiLanguage(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Time Format
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="time"
                        value="12h"
                        checked={timeFormat === '12h'}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">12-hour (2:30 PM)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="time"
                        value="24h"
                        checked={timeFormat === '24h'}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">24-hour (14:30)</span>
                    </label>
                  </div>

                  <Select
                    label="Date Format"
                    options={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (10/11/2025)' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (11/10/2025)' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2025-10-11)' }
                    ]}
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  />
                </div>
              </div>
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
