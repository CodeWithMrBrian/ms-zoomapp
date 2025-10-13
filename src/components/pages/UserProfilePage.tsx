import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';

export interface UserProfilePageProps {
  onBack: () => void;
}

/**
 * UserProfilePage Component
 *
 * Manage user profile information and account details.
 */
export function UserProfilePage({ onBack }: UserProfilePageProps) {
  const { toast, showToast } = useToast();

  const [displayName, setDisplayName] = useState('Jane Smith');
  const [email] = useState('jane.smith@company.com'); // Read-only from Zoom
  const [timezone, setTimezone] = useState('America/New_York');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [roleTitle, setRoleTitle] = useState('Product Manager');

  const accountCreated = '2025-08-01';
  const zoomAccountType = 'Licensed'; // Free/Licensed

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Account', onClick: onBack },
    { label: 'Profile' }
  ];

  const handleSaveProfile = () => {
    showToast('Profile updated successfully', 'success');
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
            User Profile
          </h1>
        </div>

        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                {/* Profile Picture Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold">
                    {displayName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-24">
                    Change
                  </Button>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <Input
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={email}
                        disabled
                        className="flex-1"
                      />
                      <Badge variant="info">From Zoom</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Email is managed through your Zoom account
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Time Zone"
                  options={[
                    { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
                    { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
                    { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
                    { value: 'Europe/London', label: 'London (GMT)' },
                    { value: 'Europe/Paris', label: 'Paris (CET)' },
                    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
                  ]}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />

                <Select
                  label="Preferred Language"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' },
                    { value: 'ja', label: 'Japanese' }
                  ]}
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Optional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Optional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />

                <Input
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />

                <Input
                  label="Role / Title"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Enter your job title"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-700 dark:text-gray-300">Account Created</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(accountCreated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700 dark:text-gray-300">Zoom Account Type</span>
                  <Badge variant={zoomAccountType === 'Licensed' ? 'success' : 'neutral'}>
                    {zoomAccountType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast {...toast} />
    </div>
  );
}
