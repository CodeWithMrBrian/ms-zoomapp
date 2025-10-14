// ...existing code...
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';
import { MOCK_TEMPLATES } from '../../utils/mockData';
import { getLanguageByCode } from '../../utils/constants';

export interface TemplateStatsPageProps {
// ...existing code...
  onBack: () => void;
}

// Mock detailed stats data
const MOCK_STATS = {
  timesUsed: 12,
  avgDuration: 72, // minutes
  totalParticipants: 1248,
  successRate: 98.5, // percentage
  usageOverTime: [
    { date: '09/22', sessions: 1 },
    { date: '09/25', sessions: 2 },
    { date: '09/28', sessions: 1 },
    { date: '10/01', sessions: 2 },
    { date: '10/05', sessions: 1 },
    { date: '10/07', sessions: 2 },
    { date: '10/09', sessions: 3 }
  ],
  topParticipants: [
    { name: 'John Doe', sessions: 8 },
    { name: 'Sarah Wilson', sessions: 7 },
    { name: 'Mike Johnson', sessions: 6 },
    { name: 'Emily Chen', sessions: 5 },
    { name: 'David Brown', sessions: 4 }
  ],
  languagesUsed: [
    { code: 'es', sessions: 12, percentage: 100 },
    { code: 'fr', sessions: 10, percentage: 83 },
    { code: 'de', sessions: 8, percentage: 67 },
    { code: 'zh', sessions: 6, percentage: 50 },
    { code: 'ja', sessions: 4, percentage: 33 }
  ],
  recentSessions: [
    { id: 'session_008', title: 'Monthly All-Hands', date: '2025-09-22', duration: 60, participants: 156 },
    { id: 'session_012', title: 'Team Update Meeting', date: '2025-09-25', duration: 45, participants: 89 },
    { id: 'session_015', title: 'Q4 Planning Session', date: '2025-09-28', duration: 90, participants: 124 },
    { id: 'session_019', title: 'All-Hands October', date: '2025-10-01', duration: 65, participants: 142 },
    { id: 'session_023', title: 'Department Sync', date: '2025-10-05', duration: 55, participants: 78 }
  ]
};

/**
 * TemplateStatsPage Component
 *
 * Displays detailed statistics and analytics for a specific template.
 */
export function TemplateStatsPage({ onBack }: TemplateStatsPageProps) {
  const { toast, showToast } = useToast();
  const template = MOCK_TEMPLATES[1]; // Using Monthly All-Hands template

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Templates', onClick: onBack },
    { label: 'Template Stats' }
  ];

  const handleExportStats = () => {
    showToast('Exporting statistics report...', 'success');
  };

  const maxUsage = Math.max(...MOCK_STATS.usageOverTime.map(d => d.sessions));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="tertiary" onClick={onBack} className="gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Templates
            </Button>
          </div>

          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Template Statistics
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {template.name}
              </p>
            </div>
            <Button onClick={handleExportStats}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Stats
            </Button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {MOCK_STATS.timesUsed}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Times Used</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {Math.floor(MOCK_STATS.avgDuration / 60)}h {MOCK_STATS.avgDuration % 60}m
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {MOCK_STATS.totalParticipants}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {MOCK_STATS.successRate}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_STATS.usageOverTime.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                      {day.date}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-8 rounded flex items-center justify-center text-white text-sm font-medium transition-all"
                        style={{ width: `${(day.sessions / maxUsage) * 100}%`, minWidth: '40px' }}
                      >
                        {day.sessions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Most Common Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_STATS.topParticipants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {participant.name}
                      </span>
                    </div>
                    <Badge variant="neutral">
                      {participant.sessions} sessions
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages Used */}
          <Card>
            <CardHeader>
              <CardTitle>Languages Used Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_STATS.languagesUsed.map((lang, index) => {
                  const language = getLanguageByCode(lang.code);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {language?.name || lang.code.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {lang.sessions} sessions ({lang.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions (Last 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_STATS.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {session.title}
                      </p>
                      <Badge variant="neutral" size="sm">
                        {session.duration} min
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span>{session.participants} participants</span>
                    </div>
                  </div>
                ))}
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
