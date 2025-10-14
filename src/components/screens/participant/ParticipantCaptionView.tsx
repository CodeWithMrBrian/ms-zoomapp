import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { useSession } from '../../../context/SessionContext';
import { LANGUAGES } from '../../../utils/constants';

/**
 * ParticipantCaptionView Screen (Screen 7)
 *
 * Real-time caption display for participants.
 *
 * Features:
 * - Large, readable caption text
 * - Auto-scroll as new captions arrive
 * - Connection status indicator
 * - Language switcher
 * - Font size adjustment
 * - Caption history with scroll
 */

interface ParticipantCaptionViewProps {
  selectedLanguage: string;
  onChangeLanguage: () => void;
  onLeave: () => void;
}

export function ParticipantCaptionView({
  selectedLanguage,
  onChangeLanguage,
  onLeave
}: ParticipantCaptionViewProps) {
  const { session, captions, currentCaption } = useSession();
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isConnected, setIsConnected] = useState(true);
  const captionsEndRef = useRef<HTMLDivElement>(null);

  // Handle leave with confirmation
  const handleLeave = () => {
    if (confirm('Are you sure you want to stop viewing translated captions? You can rejoin anytime during the meeting.')) {
      onLeave();
    }
  };

  // Get language name (ensure clean display without language codes)
  const getLanguageName = (code: string) => {
    const language = LANGUAGES.find(l => l.code === code);
    if (!language) return 'Unknown Language';
    
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

  // Filter captions by selected language
  const filteredCaptions = captions.filter(caption => caption.language === selectedLanguage);

  // Auto-scroll to latest caption
  useEffect(() => {
    if (captionsEndRef.current) {
      captionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredCaptions]);

  // Simulate connection status (in production, this would be real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate connection status for demo
      setIsConnected(Math.random() > 0.1); // 90% connected
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Font size classes
  const fontSizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card variant="default" padding="lg">
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Session Ended
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                The translation session has ended.
              </p>
              <Button variant="primary" onClick={onLeave}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header Bar - Optimized for caption viewing */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 shadow-lg px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        {/* Left: Back button + Status */}
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={handleLeave}
            className="flex items-center gap-1 text-white hover:text-teal-100 transition-colors text-sm font-medium"
            aria-label="Stop viewing captions"
          >
            <svg className="w-4 h-4 text-cyan-700 dark:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Stop</span>
          </button>

          {/* Connection Status */}
          <Badge variant={isConnected ? 'success' : 'error'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>

          {/* Selected Language */}
          <button
            onClick={onChangeLanguage}
            className="text-white hover:text-teal-100 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <span className="text-lg">
              {LANGUAGES.find(l => l.code === selectedLanguage)?.flag}
            </span>
            <span className="hidden sm:inline">{getLanguageName(selectedLanguage)}</span>
            <span>▼</span>
          </button>
        </div>

        {/* Right: Font size control */}
        <div className="flex items-center gap-2">
          <span className="text-white text-xs hidden sm:inline">Text Size:</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
            className="text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-2 py-1 border border-gray-300 dark:border-gray-600"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Caption Display Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Session Info */}
        <Card variant="default" padding="md" className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-700">
          <CardContent>
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-gray-100">{session.meeting_title}</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Host: {session.host_name} • Source: {getLanguageName(session.source_language)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* No Captions Yet */}
        {filteredCaptions.length === 0 && (
          <Card variant="default" padding="lg">
            <CardContent>
              <div className="text-center space-y-3 py-12">
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Listening...
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Waiting for translated captions in {getLanguageName(selectedLanguage)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Caption History */}
        {filteredCaptions.map((caption, index) => (
          <Card
            key={caption.id}
            variant={index === filteredCaptions.length - 1 ? 'selected' : 'default'}
            padding="lg"
            className={index === filteredCaptions.length - 1 ? 'animate-fadeIn' : ''}
          >
            <CardContent>
              <div className="space-y-2">
                {/* Caption Text */}
                <p className={`${fontSizeClasses[fontSize]} font-medium text-gray-900 dark:text-gray-100 leading-relaxed`}>
                  {caption.text}
                </p>

                {/* Caption Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span>
                    {caption.speaker_name && `${caption.speaker_name} • `}
                    {new Date(caption.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                  {caption.confidence && (
                    <Badge
                      variant={caption.confidence > 0.8 ? 'success' : caption.confidence > 0.6 ? 'warning' : 'error'}
                    >
                      {Math.round(caption.confidence * 100)}% confidence
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Auto-scroll anchor */}
        <div ref={captionsEndRef} />
      </div>

      {/* Current Caption Overlay (Most Recent - Always Visible) */}
      {currentCaption && currentCaption.language === selectedLanguage && (
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-900/95 to-gray-900/80 backdrop-blur-sm p-6 border-t-2 border-teal-500 dark:border-teal-400">
          <p className={`${fontSizeClasses[fontSize]} font-semibold text-white leading-relaxed text-center drop-shadow-lg`}>
            {currentCaption.text}
          </p>
        </div>
      )}

      {/* Disconnected Overlay */}
      {!isConnected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <Card variant="default" padding="lg" className="max-w-md">
            <CardContent>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Connection Lost
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Attempting to reconnect to the translation stream...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ...existing code...
