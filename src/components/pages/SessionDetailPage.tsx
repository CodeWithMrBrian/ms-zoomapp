import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';
import { MOCK_SESSION_DETAIL } from '../../utils/mockSessionDetails';
import { getLanguageByCode } from '../../utils/constants';

export interface SessionDetailPageProps {
  sessionId?: string;
  onBack: () => void;
}

/**
 * SessionDetailPage Component
 *
 * Displays detailed session information including transcript, participants, and metrics.
 * Features:
 * - Meeting metadata (title, host, date, duration)
 * - Key metrics cards (messages, confidence, languages, participants)
 * - Full transcript with translations
 * - Language selector for viewing translations
 * - Confidence badges
 * - Participants list
 * - Download options (recording, transcript)
 */
export function SessionDetailPage({ onBack }: SessionDetailPageProps) {
  const { toast, showToast } = useToast();
  const [selectedTranslationLang, setSelectedTranslationLang] = useState<string>('');
  const [transcriptFormat, setTranscriptFormat] = useState<string>('txt');

  // Get session data (using mock data)
  const session = MOCK_SESSION_DETAIL;

  // Breadcrumbs navigation
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: () => onBack() },
    { label: 'Activity', onClick: () => onBack() },
    { label: 'Session Detail' }
  ];

  // Format time HH:MM
// ...existing code...

  // Get confidence badge variant
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.95) return { variant: 'success' as const, label: 'High' };
    if (confidence >= 0.85) return { variant: 'info' as const, label: 'Good' };
    if (confidence >= 0.75) return { variant: 'warning' as const, label: 'Medium' };
    return { variant: 'error' as const, label: 'Low' };
  };

  // Action handlers
  const handleDownloadRecording = () => {
    showToast('Recording download started', 'success');
  };

  const handleDownloadTranscript = () => {
    showToast(`Transcript downloaded as ${transcriptFormat.toUpperCase()}`, 'success');
  };

  // Available languages for translation dropdown
  const translationLanguages = session.target_languages.map((code) => {
    const lang = getLanguageByCode(code);
    return {
      value: code,
      label: lang ? `${lang.name} (${lang.native_name})` : code.toUpperCase()
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="tertiary" onClick={onBack} className="gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Activity
          </Button>
        </div>

        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {session.meeting_title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <span>Hosted by {session.host_name}</span>
            <span>•</span>
            <span>{session.meeting_date}</span>
            <span>•</span>
            <span>
              {session.start_time} - {session.end_time} ({session.duration_minutes} min)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {session.metrics.total_messages}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Messages Translated</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {Math.round(session.metrics.avg_confidence * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Confidence</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {session.metrics.languages_used}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Languages Used</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {session.metrics.peak_concurrent_users}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Peak Participants</p>
            </CardContent>
          </Card>
        </div>

        {/* Transcript Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Full Transcript</CardTitle>
              {translationLanguages.length > 0 && (
                <Select
                  options={[
                    { value: '', label: 'View original only' },
                    ...translationLanguages
                  ]}
                  value={selectedTranslationLang}
                  onChange={(e) => setSelectedTranslationLang(e.target.value)}
                  className="w-64"
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {session.transcript.map((line) => {
                const confidenceBadge = getConfidenceBadge(line.confidence);
                const languageName = getLanguageByCode(line.original_language)?.name || line.original_language;

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    {/* Timestamp column */}
                    <div className="w-20 flex-shrink-0">
                      <p className="text-sm font-mono text-gray-500 dark:text-gray-500">
                        {line.timestamp}
                      </p>
                    </div>

                    {/* Content column */}
                    <div className="flex-1">
                      {/* Speaker and metadata */}
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {line.speaker_name}
                        </p>
                        <Badge variant="neutral" size="sm">
                          {languageName}
                        </Badge>
                        <Badge variant={confidenceBadge.variant} size="sm">
                          {confidenceBadge.label} ({Math.round(line.confidence * 100)}%)
                        </Badge>
                      </div>

                      {/* Original text */}
                      <p className="text-gray-900 dark:text-gray-100 mb-2">
                        {line.original_text}
                      </p>

                      {/* Translation (if selected) */}
                      {selectedTranslationLang && line.translations[selectedTranslationLang] && (
                        <div className="mt-3 pl-4 border-l-2 border-teal-200 dark:border-teal-800">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Translation ({getLanguageByCode(selectedTranslationLang)?.name}):
                          </p>
                          <p className="text-gray-900 dark:text-gray-100">
                            {line.translations[selectedTranslationLang]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Participants List */}
        <Card>
          <CardHeader>
            <CardTitle>Participants ({session.participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Language
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Duration
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Messages Viewed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {session.participants.map((participant) => {
                    const lang = getLanguageByCode(participant.language_selected);
                    return (
                      <tr
                        key={participant.id}
                        className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {participant.name}
                            </p>
                            {participant.email && (
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {participant.email}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="neutral" size="sm">
                            {lang?.name || participant.language_selected}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-right text-gray-900 dark:text-gray-100">
                          {participant.duration_minutes} min
                        </td>
                        <td className="py-4 px-4 text-sm text-right text-gray-900 dark:text-gray-100">
                          {participant.messages_viewed}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card>
          <CardHeader>
            <CardTitle>Download Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Download Recording */}
              {session.recording_url && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-teal-600 dark:text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Meeting Recording
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">MP4 video file</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleDownloadRecording}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </Button>
                </div>
              )}

              {/* Download Transcript */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-teal-600 dark:text-teal-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Full Transcript
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All languages and translations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    options={[
                      { value: 'txt', label: 'TXT' },
                      { value: 'srt', label: 'SRT' },
                      { value: 'vtt', label: 'VTT' }
                    ]}
                    value={transcriptFormat}
                    onChange={(e) => setTranscriptFormat(e.target.value)}
                    className="w-28"
                  />
                  <Button variant="outline" onClick={handleDownloadTranscript}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast notifications */}
      <Toast {...toast} />
    </div>
  );
}
