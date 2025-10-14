import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';

export interface AnalyticsDashboardProps {
  onBack: () => void;
}

// Mock analytics data
const MOCK_ANALYTICS_DATA = {
  last7days: {
    totalSessions: 8,
    totalMinutes: 432,
    totalCost: 0, // Subscription
    avgParticipants: 28,
    usageOverTime: [
      { date: '10/04', sessions: 1, minutes: 60 },
      { date: '10/05', sessions: 2, minutes: 135 },
      { date: '10/06', sessions: 0, minutes: 0 },
      { date: '10/07', sessions: 1, minutes: 45 },
      { date: '10/08', sessions: 0, minutes: 0 },
      { date: '10/09', sessions: 2, minutes: 120 },
      { date: '10/10', sessions: 2, minutes: 72 }
    ],
    topLanguages: [
      { language: 'Spanish', count: 8, percentage: 100 },
      { language: 'French', count: 7, percentage: 87.5 },
      { language: 'German', count: 6, percentage: 75 },
      { language: 'Chinese', count: 5, percentage: 62.5 },
      { language: 'Portuguese', count: 2, percentage: 25 }
    ],
    sessionsByType: [
      { type: 'Business', count: 5, percentage: 62.5, color: 'bg-blue-500' },
      { type: 'Medical', count: 1, percentage: 12.5, color: 'bg-green-500' },
      { type: 'Technical', count: 1, percentage: 12.5, color: 'bg-purple-500' },
      { type: 'General', count: 1, percentage: 12.5, color: 'bg-gray-500' }
    ],
    costAnalysis: [
      { month: 'Sep', subscription: 621, overage: 126.5, total: 747.5 },
      { month: 'Oct', subscription: 621, overage: 0, total: 621 }
    ]
  }
};

/**
 * AnalyticsDashboard Component
 *
 * Displays comprehensive usage analytics with charts and metrics.
 */
export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const { toast, showToast } = useToast();
  const [dateRange, setDateRange] = useState('last7days');

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Activity', onClick: onBack },
    { label: 'Analytics' }
  ];

  const data = MOCK_ANALYTICS_DATA.last7days;

  const handleExportReport = () => {
    showToast('Exporting analytics report as PDF...', 'success');
  };

  const handlePrint = () => {
    showToast('Opening print dialog...', 'info');
  };

  // Calculate max values for chart scaling
  const maxUsage = Math.max(...data.usageOverTime.map(d => d.minutes));
// ...existing code...

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="tertiary" onClick={onBack} className="gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Activity
            </Button>
          </div>

          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Analytics Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <Select
                options={[
                  { value: 'last7days', label: 'Last 7 Days' },
                  { value: 'last30days', label: 'Last 30 Days' },
                  { value: 'last90days', label: 'Last 90 Days' },
                  { value: 'custom', label: 'Custom Range' }
                ]}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-48"
              />
              <Button variant="outline" onClick={handlePrint}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
              <Button onClick={handleExportReport}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {data.totalSessions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {data.totalMinutes}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                ${data.totalCost.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {data.avgParticipants}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Participants</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.usageOverTime.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                      {day.date}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-8 rounded transition-all"
                        style={{ width: `${(day.minutes / maxUsage) * 100}%` }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {day.minutes} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {data.totalMinutes} minutes ({(data.totalMinutes / 60).toFixed(1)} hours)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Languages Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Languages Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topLanguages.map((lang, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {lang.language}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {lang.count} sessions ({lang.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sessions by Meeting Type */}
          <Card>
            <CardHeader>
              <CardTitle>Sessions by Meeting Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pie Chart Mockup */}
                <div className="flex items-center justify-center h-48">
                  <div className="relative w-48 h-48">
                    {/* Simple pie chart representation using flex */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {data.sessionsByType.reduce((sum, t) => sum + t.count, 0)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {data.sessionsByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${type.color}`} />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {type.type}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {type.count} ({type.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.costAnalysis.map((month, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {month.month}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        ${month.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-1 h-8">
                      {/* Subscription portion */}
                      <div
                        className="bg-teal-500 rounded-l flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(month.subscription / month.total) * 100}%` }}
                      >
                        {month.subscription > 0 && `$${month.subscription}`}
                      </div>
                      {/* Overage portion */}
                      {month.overage > 0 && (
                        <div
                          className="bg-red-500 rounded-r flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(month.overage / month.total) * 100}%` }}
                        >
                          ${month.overage}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>Subscription: ${month.subscription}</span>
                      <span>Overage: ${month.overage}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-teal-500 rounded" />
                    <span className="text-gray-600 dark:text-gray-400">Subscription</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span className="text-gray-600 dark:text-gray-400">Overage</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Toast */}
      <Toast {...toast} />
    </div>
  );
}
