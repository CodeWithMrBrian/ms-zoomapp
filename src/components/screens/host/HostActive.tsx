import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { NavigationHeader, NavigationAction } from '../../ui/NavigationHeader';
import { SidebarCompactLayout } from '../../ui/SidebarLayout';
// ...existing code...
import { HelpModal } from '../modals/HelpModal';
import { useUser } from '../../../context/UserContext';
import { useSession } from '../../../context/SessionContext';
import { useZoom } from '../../../context/ZoomContext';
import { LANGUAGES } from '../../../utils/constants';
// ...existing code...

/**
 * HostActive Screen (Screen 2)
 *
 * Displayed when a translation session is active.
 *
 * Features:
 * - Live session status (duration, cost/usage)
 * - Quick actions (Share URL, Pause, End)
 * - Participant tracking with language breakdown
 * - Translation health monitoring
 * - Secondary actions (settings, preview, help)
 */

interface HostActiveProps {
  onEnd: () => void;
  onSettings: () => void;
  onViewAsParticipant: () => void;
}

export function HostActive({ onEnd, onSettings, onViewAsParticipant }: HostActiveProps) {
  const { isPAYG } = useUser();
  const {
    session,
    isActive,
    isPaused,
    duration,
    cost,
    participants,
    participantsViewing,
    participantsTotal,
    pauseSession,
    resumeSession,
    stopSession
  } = useSession();
  const { shareApp } = useZoom();

  const [showParticipants, setShowParticipants] = useState(false);
  // ...existing code...
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Group participants by language
  const participantsByLanguage = useMemo(() => {
    const grouped: Record<string, typeof participants> = {};

    participants.forEach(participant => {
      const lang = participant.selected_language;
      if (!grouped[lang]) {
        grouped[lang] = [];
      }
      grouped[lang].push(participant);
    });

    return grouped;
  }, [participants]);

  // Get language names (ensure clean display without language codes)
  const getLanguageName = (code: string) => {
    const language = LANGUAGES.find(l => l.code === code);
    if (!language) return code.toUpperCase();
    
    // Ensure we only return the clean language name without any prefixes
    let name = language.name;
    
    // Remove any potential language code prefixes 
    // Handles cases like: "RO Romanian" -> "Romanian", "SK Slovak" -> "Slovak", "DK Danish" -> "Danish"
    if (name.includes(' ')) {
      const parts = name.split(' ');
      // Check if first part is a 2-letter uppercase code (country/language abbreviation)
      if (parts[0].length === 2 && parts[0].toUpperCase() === parts[0] && /^[A-Z]{2}$/.test(parts[0])) {
        // Remove the abbreviation prefix and return the clean name
        name = parts.slice(1).join(' ');
      }
    }
    
    return name;
  };

  // Handle auto-share via Zoom SDK
  const handleAutoShare = async () => {
    try {
      await shareApp();
      alert('✅ App Shared via Zoom SDK!\n\n📱 All participants in this meeting will now see "MeetingSync" in their Zoom Apps menu.\n\n👆 They can click it to join and select their preferred language for live translation.\n\n🎯 This is the easiest method - no manual steps required!');
    } catch (error) {
      console.error('[HostActive] Failed to share app:', error);
      alert('❌ Failed to share app. Please try again.');
    }
  };

  // Handle manual URL sharing
  const handleManualShare = () => {
    if (!session) return;
    
    const meetingId = session.meeting_id || '123456789';
    const baseUrl = `https://meetingsync.zoom.us/meeting/${meetingId}`;
    
    // Generate language-specific URLs
    const participantUrls = session.target_languages.map((lang: string) => {
      const langName = getLanguageName(lang);
      return {
        language: langName,
        flag: LANGUAGES.find(l => l.code === lang)?.flag || '🌐',
        url: `${baseUrl}?lang=${lang}`
      };
    });

    // Create formatted text for copying
    const urlText = participantUrls.map((item: any) => 
      `${item.flag} ${item.language}: ${item.url}`
    ).join('\n');

    // Copy to clipboard
    navigator.clipboard.writeText(urlText).then(() => {
      alert(`📋 Participant URLs Copied!\n\n${urlText}\n\n💬 Paste these URLs in the Zoom chat for participants to click and join their preferred language.\n\n📌 Each URL will take them directly to the right language selection.`);
    }).catch(() => {
      // Fallback if clipboard fails
      const modal = confirm(`📋 Copy these URLs to share with participants:\n\n${urlText}\n\nClick OK to see them in a text box you can copy from.`);
      if (modal) {
        const textarea = document.createElement('textarea');
        textarea.value = urlText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ URLs copied to clipboard!');
      }
    });
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    if (isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  // Handle end session
  const handleEnd = async () => {
    if (confirm('Are you sure you want to end this translation session?')) {
      await stopSession();
      onEnd();
    }
  };

  // Format duration for display
  const formatDurationDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate estimated session cost (PAYG only)
  const displayCostOrUsage = useMemo(() => {
    return `$${cost.toFixed(2)} elapsed`;
  }, [cost]);

  if (!session || !isActive) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card variant="default" padding="lg">
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">No active session</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarCompactLayout 
      className="bg-gray-50 dark:bg-gray-900"
      pageTitle="Active Translation"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Navigation Header */}
        <NavigationHeader
          title="Active Translation"
          subtitle={isPaused ? "Paused" : "Live"}
        actions={
          <>
            <NavigationAction
              onClick={onSettings}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label=""
            />
            <NavigationAction
              onClick={() => setShowHelpModal(true)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Help"
            />
          </>
        }
      />

      {/* Status Banner */}
      <Card variant="default" padding="lg" className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-700">
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {isPaused ? 'PAUSED' : 'ACTIVE'} - Translating {getLanguageName(session.source_language)} → {session.target_languages.length} languages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Session Duration:</strong> {formatDurationDisplay(duration)}
                </p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>{isPAYG ? 'Current Cost (PAYG):' : 'Monthly Usage:'}</strong> {displayCostOrUsage}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle className="text-center">QUICK ACTIONS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sharing Options */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">
                📱 Share with Participants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Auto Share via Zoom SDK */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAutoShare}
                  className="w-full py-4 text-sm"
                >
                  🚀 Auto Share<br />
                  <span className="text-xs opacity-90">(via Zoom Apps)</span>
                </Button>

                {/* Manual URL Sharing */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleManualShare}
                  className="w-full py-4 text-sm bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  📋 Copy URLs<br />
                  <span className="text-xs opacity-90">(for chat sharing)</span>
                </Button>
              </div>
            </div>

            {/* Session Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pause/Resume */}
              <Button
                variant="outline"
                size="lg"
                onClick={handlePauseResume}
                className="w-full py-6 text-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              {/* End */}
              <Button
                variant="destructive"
                size="lg"
                onClick={handleEnd}
                className="w-full py-6 text-lg"
              >
                End Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card variant="default" padding="lg">
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="w-full flex items-center justify-between text-left"
        >
          <CardTitle>
            Participants ({participantsViewing} viewing)
          </CardTitle>
          <span className="text-gray-500 dark:text-gray-400">
            {showParticipants ? '[Collapse ▲]' : '[Expand ▼]'}
          </span>
        </button>

        {!showParticipants && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Click to see who's viewing which language
          </p>
        )}

        {showParticipants && (
          <CardContent className="mt-6">
            <div className="space-y-6">
              {Object.entries(participantsByLanguage).map(([langCode, langParticipants]) => (
                <div key={langCode} className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {getLanguageName(langCode)} {((langParticipants as typeof participants).length)}:
                  </h3>
                  <ul className="space-y-2 ml-4">
                    {(langParticipants as typeof participants).map((participant) => (
                      <li key={participant.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`w-2 h-2 rounded-full ${participant.is_viewing ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span>
                          {participant.name} {participant.is_viewing ? 'Connected' : 'Disconnected'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {participantsTotal === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  No participants viewing translations yet. Share the app URL to invite participants.
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Translation Status */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Translation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Connection Quality:</span>
              <Badge variant="success">Excellent</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Languages Active:</span>
              <div className="flex flex-wrap gap-2 max-w-full sm:max-w-xs">
                {session.target_languages.map(langCode => (
                  <Badge key={langCode} variant="info">
                    {langCode.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Processing Lag:</span>
              <Badge variant="success">&lt;1 second</Badge>
            </div>

            {session.glossary_id && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Glossary:</span>
                <Badge variant="info">{session.glossary_name || 'Active'}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Actions */}
      <Card variant="default" padding="lg">
        <CardContent>
          <div className="flex justify-center">
            <Button variant="secondary" size="lg" onClick={onViewAsParticipant} className="w-full sm:w-auto">
              View as Participant
            </Button>
          </div>
        </CardContent>
      </Card>

        {/* Help Modal */}
        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />
      </div>
    </SidebarCompactLayout>
  );
}
