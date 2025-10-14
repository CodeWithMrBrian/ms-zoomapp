import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { useSession } from '../../../context/SessionContext';
import { useUser } from '../../../context/UserContext';
import { LANGUAGES } from '../../../utils/constants';
// ...existing code...

/**
 * Enhanced Participant Caption View Screen
 *
 * Advanced real-time caption display with TTS integration.
 *
 * Features:
 * - Text-to-Speech (TTS) audio playback
 * - Audio controls (play/pause, volume, speed)
 * - Enhanced caption display with speaker identification
 * - Real-time translation with confidence scores
 * - Session information and controls
 * - Accessibility options
 */

interface EnhancedParticipantCaptionViewProps {
  selectedLanguage: string;
  onChangeLanguage: () => void;
  onLeave: () => void;
}

// Mock TTS and audio data
const mockTTSState = {
  isPlaying: false,
  volume: 0.8,
  isAvailable: true
};

const mockAudioLevels = [0.3, 0.7, 0.2, 0.9, 0.4, 0.6, 0.8, 0.1, 0.5, 0.3];

export function EnhancedParticipantCaptionView({
  selectedLanguage,
  onChangeLanguage,
  onLeave
}: EnhancedParticipantCaptionViewProps) {
  const { session, captions, currentCaption } = useSession();
  const { isDailyFreeTier } = useUser();
  
  // Display and Audio States
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isConnected, setIsConnected] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // TTS Controls
  const [ttsState, setTtsState] = useState(mockTTSState);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState(mockAudioLevels);
  
  // UI States
  const [showControls, setShowControls] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [bookmarkedCaptions, setBookmarkedCaptions] = useState<string[]>([]);
  
  const captionsEndRef = useRef<HTMLDivElement>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  // Handle leave with confirmation
  const handleLeave = () => {
    if (confirm('Are you sure you want to stop viewing translated captions? You can rejoin anytime during the meeting.')) {
      // Stop any playing audio
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
      }
      onLeave();
    }
  };

  // Get language name (ensure clean display without language codes)
  const getLanguageName = (code: string) => {
    const language = LANGUAGES.find(l => l.code === code);
    if (!language) return 'Unknown Language';
    
    let name = language.name;
    if (name.includes(' ')) {
      const parts = name.split(' ');
      if (parts[0].length === 2 && parts[0].toUpperCase() === parts[0] && /^[A-Z]{2}$/.test(parts[0])) {
        name = parts.slice(1).join(' ');
      }
    }
    return name;
  };

  // Filter captions by selected language
  const filteredCaptions = captions.filter(caption => caption.language === selectedLanguage);

  // TTS Functions
  const handleTTSToggle = useCallback(() => {
    if (!ttsState.isAvailable || isDailyFreeTier) return;
    
    setTtsState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    
    if (ttsAudioRef.current) {
      if (ttsState.isPlaying) {
        ttsAudioRef.current.pause();
        setCurrentlyPlaying(null);
      } else {
        // In a real implementation, this would use Web Speech API or audio files
        console.log('[TTS] Playing current caption with TTS');
        setCurrentlyPlaying(currentCaption?.id || null);
      }
    }
  }, [ttsState.isPlaying, ttsState.isAvailable, isDailyFreeTier, currentCaption]);

  const handleVolumeChange = (volume: number) => {
    setTtsState(prev => ({ ...prev, volume }));
    if (ttsAudioRef.current) {
      ttsAudioRef.current.volume = volume;
    }
  };



  const toggleBookmark = (captionId: string) => {
    setBookmarkedCaptions(prev => 
      prev.includes(captionId) 
        ? prev.filter(id => id !== captionId)
        : [...prev, captionId]
    );
  };

  // Auto-scroll to latest caption
  useEffect(() => {
    if (captionsEndRef.current) {
      captionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredCaptions]);

  // Simulate connection status and session duration
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% connected
      setSessionDuration(prev => prev + 1);
      
      // Simulate audio levels for visualization
      setAudioLevels(prev => prev.map(() => Math.random()));
    }, 1000);

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Enhanced Header Bar */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 shadow-lg px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          {/* Left: Back button + Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLeave}
              className="flex items-center gap-1 text-white hover:text-teal-100 transition-colors text-sm font-medium"
              aria-label="Stop viewing captions"
            >
              <svg className="w-4 h-4 text-cyan-700 dark:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Leave</span>
            </button>

            <Badge variant={isConnected ? 'success' : 'error'}>
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </Badge>

            <div className="text-white text-sm font-medium">
              {formatDuration(sessionDuration)}
            </div>
          </div>

          {/* Center: Session Info */}
          <div className="hidden md:flex items-center gap-2 text-white text-sm">
            <span>{session.meeting_title}</span>
            <span>•</span>
            <span>{getLanguageName(session.source_language)} → {getLanguageName(selectedLanguage)}</span>
          </div>

          {/* Right: Language selector + Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="text-white hover:text-teal-100 text-sm"
              aria-label="Toggle controls"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            <button
              onClick={onChangeLanguage}
              className="text-white hover:text-teal-100 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span className="hidden sm:inline">{getLanguageName(selectedLanguage)}</span>
              <span>▼</span>
            </button>
          </div>
        </div>

        {/* Audio Visualization Bar */}
        {ttsState.isPlaying && (
          <div className="mt-2 flex items-center justify-center gap-1">
            {audioLevels.map((level, index) => (
              <div
                key={index}
                className="w-1 bg-white/60 rounded-full transition-all duration-75"
                style={{ height: `${8 + level * 16}px` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* TTS Controls Panel */}
      {showControls && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* TTS Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant={ttsState.isPlaying ? "secondary" : "primary"}
                size="sm"
                onClick={handleTTSToggle}
                disabled={!ttsState.isAvailable || isDailyFreeTier}
                className="flex items-center gap-2"
              >
                {ttsState.isPlaying ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                  </svg>
                )}
                {isDailyFreeTier ? 'TTS (Upgrade Required)' : (ttsState.isPlaying ? 'Pause' : 'Play Audio')}
              </Button>

              {!isDailyFreeTier && (
                <>
                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={ttsState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <span className="text-xs text-gray-500 min-w-[2rem]">{Math.round(ttsState.volume * 100)}%</span>
                  </div>


                </>
              )}
            </div>

            {/* Display Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Text Size:</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
                  className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Caption Display Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Session Info Card */}
          <Card variant="default" padding="md" className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-700">
            <CardContent>
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-gray-100">{session.meeting_title}</strong>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Host: {session.host_name} • Translating: {getLanguageName(session.source_language)} → {getLanguageName(selectedLanguage)}
                </p>
                {currentCaption?.speaker_name && (
                  <p className="text-xs text-teal-600 dark:text-teal-400">
                    🎤 Currently speaking: {currentCaption.speaker_name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* No Captions Yet */}
          {filteredCaptions.length === 0 && (
            <Card variant="default" padding="lg">
              <CardContent>
                <div className="text-center space-y-3 py-12">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Listening...
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Waiting for translated captions in {getLanguageName(selectedLanguage)}
                  </p>
                  {ttsState.isAvailable && !isDailyFreeTier && (
                    <p className="text-sm text-teal-600 dark:text-teal-400">
                      🔊 Audio translation ready - click play to hear captions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Caption History */}
          {filteredCaptions.map((caption, index) => (
            <Card
              key={caption.id}
              variant={index === filteredCaptions.length - 1 ? 'selected' : 'default'}
              padding="lg"
              className={`${index === filteredCaptions.length - 1 ? 'animate-fadeIn' : ''} ${
                currentlyPlaying === caption.id ? 'ring-2 ring-teal-500 dark:ring-teal-400' : ''
              }`}
            >
              <CardContent>
                <div className="space-y-3">
                  {/* Speaker Info */}
                  {caption.speaker_name && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {caption.speaker_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {caption.speaker_name}
                      </span>
                      {currentlyPlaying === caption.id && (
                        <Badge variant="info" className="text-xs">
                          🔊 Playing
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Caption Text */}
                  <p className={`${fontSizeClasses[fontSize]} font-medium text-gray-900 dark:text-gray-100 leading-relaxed`}>
                    {caption.text}
                  </p>

                  {/* Caption Actions and Metadata */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {new Date(caption.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                      {caption.confidence && (
                        <Badge
                          variant={caption.confidence > 0.8 ? 'success' : caption.confidence > 0.6 ? 'warning' : 'error'}
                          className="text-xs"
                        >
                          {Math.round(caption.confidence * 100)}%
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(caption.id)}
                        className={`p-1 rounded transition-colors ${
                          bookmarkedCaptions.includes(caption.id)
                            ? 'text-yellow-600 hover:text-yellow-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        aria-label="Bookmark caption"
                      >
                        <svg className="w-4 h-4" fill={bookmarkedCaptions.includes(caption.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>

                      {/* Play TTS Button */}
                      {!isDailyFreeTier && ttsState.isAvailable && (
                        <button
                          onClick={() => {
                            if (currentlyPlaying === caption.id) {
                              setCurrentlyPlaying(null);
                            } else {
                              setCurrentlyPlaying(caption.id);
                              console.log('[TTS] Playing caption:', caption.text);
                            }
                          }}
                          className="p-1 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                          aria-label="Play caption audio"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {currentlyPlaying === caption.id ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                            )}
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Auto-scroll anchor */}
          <div ref={captionsEndRef} />
        </div>

        {/* History Sidebar (when enabled) */}
        {showHistory && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Caption History</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{filteredCaptions.length} captions</p>
            </div>
            <div className="p-4 space-y-3">
              {filteredCaptions.map((caption) => (
                <div key={caption.id} className="text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(caption.timestamp).toLocaleTimeString()}
                    </span>
                    {bookmarkedCaptions.includes(caption.id) && (
                      <span className="text-yellow-600">⭐</span>
                    )}
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 line-clamp-3">
                    {caption.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Caption Overlay (Floating Bottom) */}
      {currentCaption && currentCaption.language === selectedLanguage && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 to-gray-900/80 backdrop-blur-sm p-6 border-t-2 border-teal-500 dark:border-teal-400 z-10">
          <div className="max-w-4xl mx-auto">
            {currentCaption.speaker_name && (
              <p className="text-teal-300 text-sm font-medium mb-1 text-center">
                {currentCaption.speaker_name}
              </p>
            )}
            <p className={`${fontSizeClasses[fontSize]} font-semibold text-white leading-relaxed text-center drop-shadow-lg`}>
              {currentCaption.text}
            </p>
            {currentlyPlaying === currentCaption.id && (
              <div className="flex justify-center mt-2">
                <div className="flex items-center gap-1">
                  {audioLevels.slice(0, 5).map((level, index) => (
                    <div
                      key={index}
                      className="w-1 bg-teal-300 rounded-full transition-all duration-100"
                      style={{ height: `${4 + level * 8}px` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disconnected Overlay */}
      {!isConnected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
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

      {/* Hidden Audio Element for TTS */}
      <audio ref={ttsAudioRef} style={{ display: 'none' }} />
    </div>
  );
}

// Add fadeIn animation to index.css if not already present
// Styles for .animate-fadeIn and .line-clamp-3 should be added to global CSS