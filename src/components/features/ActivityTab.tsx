import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useUser } from '../../context/UserContext';
import { MOCK_SESSIONS } from '../../utils/mockData';
import { LANGUAGES } from '../../utils/constants';
import { SessionStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/constants';
import { SessionDetailPage } from '../pages/SessionDetailPage';
import { ExportDataModal } from '../modals/ExportDataModal';

/**
 * ActivityTab Component
 *
 * Displays session history with filtering and export capabilities.
 * Wordly-style session list with usage summary.
 *
 * Features:
 * - Monthly usage summary with progress bar
 * - Session filtering (date range, meeting type, languages)
 * - Session search by title or host
 * - Session cards with full details
 * - Export capabilities (CSV, reports)
 */

type ActivityView = 'main' | 'session-detail';

export function ActivityTab() {
  const { user } = useUser();

  const [currentView, setCurrentView] = useState<ActivityView>('main');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const [dateFrom, setDateFrom] = useState('2025-10-01');
  const [dateTo, setDateTo] = useState('2025-10-31');
  const [meetingTypeFilter, setMeetingTypeFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle viewing session detail
  const handleViewSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setCurrentView('session-detail');
  };

  // Handle back to main view
  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedSessionId(null);
  };

  // Filter sessions (must be before conditional return)
  const filteredSessions = useMemo(() => {
    return MOCK_SESSIONS.filter(session => {
      // Date filter
      const sessionDate = new Date(session.date_time_start);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (sessionDate < from || sessionDate > to) return false;

      // Meeting type filter
      if (meetingTypeFilter !== 'all' && session.meeting_type !== meetingTypeFilter) return false;

      // Language filter
      if (languageFilter !== 'all' && !session.target_languages.includes(languageFilter)) return false;

      // Search filter
      if (searchQuery && !session.meeting_title.toLowerCase().includes(searchQuery.toLowerCase()) && !session.host_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [dateFrom, dateTo, meetingTypeFilter, languageFilter, searchQuery]);

  // Calculate totals (must be before conditional return)
  // Remove unused totals for now

  // Render session detail page (conditional return AFTER all hooks)
  if (currentView === 'session-detail' && selectedSessionId) {
    return (
      <SessionDetailPage
        sessionId={selectedSessionId}
        onBack={handleBackToMain}
      />
    );
  }

  // Get language name
  const getLanguageName = (code: string) => {
    return LANGUAGES.find(l => l.code === code)?.name || code.toUpperCase();
  };

  // Get status badge
  const getStatusBadge = (status: SessionStatus) => {
    const variants: Record<SessionStatus, 'success' | 'warning' | 'error' | 'info'> = {
      not_started: 'info',
      active: 'success',
      paused: 'warning',
      ended: 'info'
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Usage Summary */}
      <Card variant="beautiful" padding="lg">
        <CardHeader>
          <CardTitle>Usage Summary - October 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* V1 PAYG: Show unpaid usage instead of subscription hours */}
            {user?.billing_type === 'payg' && user.unpaid_usage !== undefined && (
              <>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Current Month Unpaid Usage: {formatCurrency(user.unpaid_usage)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user.billing_period_start && user.billing_period_end &&
                      `Billing period: ${user.billing_period_start} to ${user.billing_period_end}`
                    }
                  </p>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{MOCK_SESSIONS.length}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Average Duration</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">1.15 hrs</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">156</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Most Used</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Spanish (8)</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                Export This Month's Data ↓
              </Button>
              <Button variant="tertiary" size="sm">
                View All Time Stats
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter & Search */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="Date From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <Input
                type="date"
                label="Date To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Meeting Type"
                value={meetingTypeFilter}
                onChange={(e) => setMeetingTypeFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'general', label: 'General' },
                  { value: 'medical', label: 'Medical' },
                  { value: 'technical', label: 'Technical' },
                  { value: 'legal', label: 'Legal' },
                  { value: 'business', label: 'Business' },
                  { value: 'academic', label: 'Academic' }
                ]}
              />

              <Select
                label="Languages"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All' },
                  ...LANGUAGES.slice(0, 12).map(lang => ({
                    value: lang.code,
                    label: lang.name
                  }))
                ]}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search meeting title or host name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Session History</CardTitle>
            <Button variant="secondary" size="sm" onClick={() => setShowExportModal(true)}>
              Export CSV ↓
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSessions.length === 0 && (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No sessions found matching your filters.
              </p>
            )}

            {filteredSessions.map(session => (
              <Card
                key={session.id}
                variant="hover"
                padding="md"
                className="cursor-pointer"
                onClick={() => handleViewSession(session.id)}
              >
                <div className="space-y-3">
                  {/* Header: Date & Time */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatDate(session.date_time_start)}
                      {session.date_time_end && ` - ${new Date(session.date_time_end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                      {session.duration_hours && ` (${session.duration_hours.toFixed(1)} hrs)`}
                    </h3>
                    {getStatusBadge(session.status)}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2 space-y-1.5 text-sm">
                    <p>
                      <strong>Meeting:</strong> {session.meeting_title}
                    </p>
                    <p>
                      <strong>Host:</strong> {session.host_name}
                    </p>
                    <p>
                      <strong>Meeting Type:</strong> {session.meeting_type.charAt(0).toUpperCase() + session.meeting_type.slice(1)}
                    </p>
                    <p>
                      <strong>Languages:</strong> {getLanguageName(session.source_language)} → {session.target_languages.map(code => getLanguageName(code)).join(', ')}
                    </p>
                    <p>
                      <strong>Participants:</strong> {session.participant_count_total} total ({session.participant_count_viewing} viewing translations)
                    </p>
                    <p>
                      <strong>Cost:</strong> {formatCurrency(session.cost)}
                      {session.participant_multiplier_value && session.participant_multiplier_value > 1.0 && (
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                          (includes {session.participant_multiplier_value}x multiplier)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSession(session.id);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Download report feature coming soon!');
                      }}
                    >
                      Download Report
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
