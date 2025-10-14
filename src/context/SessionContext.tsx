import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { Session, MeetingType, Participant, Caption } from '../types';
import { MOCK_SESSION_ACTIVE, MOCK_PARTICIPANTS, MOCK_CAPTIONS } from '../utils/mockData';
import { useUser } from './UserContext';
import { useZoom } from './ZoomContext';
import { calculateParticipantMultiplier, PRICING_TIERS } from '../utils/constants';

/**
 * Session Context
 *
 * Manages active translation session state including:
 * - Session configuration (languages, meeting type, glossary)
 * - Real-time participants and their language preferences
 * - Live captions streaming
 * - Session start/stop controls
 * - Cost tracking
 */

interface SessionContextValue {
  // Session state
  session: Session | null;
  isActive: boolean;
  isPaused: boolean;
  duration: number; // in seconds
  cost: number; // current session cost

  // Participants
  participants: Participant[];
  participantsViewing: number;
  participantsTotal: number;

  // Captions
  captions: Caption[];
  currentCaption: Caption | null;

  // Session controls
  startSession: (config: SessionConfig) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => Promise<void>;
  updateLanguages: (languages: string[]) => void;
  updateMeetingType: (type: MeetingType) => void;
  updateGlossary: (glossaryId: string | null) => void;
  addLanguageToSession: (languageCode: string) => void;

  // Real-time updates (mock)
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  addCaption: (caption: Caption) => void;
}

export interface SessionConfig {
  source_language: string;
  target_languages: string[];
  meeting_type: MeetingType;
  glossary_id?: string;
  meeting_title?: string;
  allow_language_requests?: boolean;
  allow_participant_overage?: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

/**
 * SessionProvider Component
 *
 * Manages active translation session state and real-time updates.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <SessionProvider>
 *       <YourApp />
 *     </SessionProvider>
 *   );
 * }
 * ```
 */
export function SessionProvider({ children }: { children: ReactNode}) {
  const { user, addDailyFreeMinutes, addUnpaidUsage, isDailyFreeTier, dailyMinutesRemaining } = useUser();
  const { meetingContext, userContext } = useZoom();

  // Initialize with mock session if participant role (for test mode)
  const [session, setSession] = useState<Session | null>(() => {
    // Check if participant role from the start
    if (userContext?.role === 'attendee') {
      console.log('[SessionContext] Initializing with mock session (participant role detected)');
      return MOCK_SESSION_ACTIVE;
    }
    return null;
  });
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0); // in seconds
  const [participants, setParticipants] = useState<Participant[]>(() => {
    // Initialize with mock participants if participant role
    if (userContext?.role === 'attendee') {
      return MOCK_PARTICIPANTS;
    }
    return [];
  });
  const [captions, setCaptions] = useState<Caption[]>(() => {
    // Initialize with mock captions if participant role
    if (userContext?.role === 'attendee') {
      return MOCK_CAPTIONS;
    }
    return [];
  });

  const isActive = session?.status === 'active' || session?.status === 'paused';

  // Use ref to store stopSession to avoid dependency issues in timer effect
  const stopSessionRef = useRef<(() => Promise<void>) | null>(null);

  // Calculate current session cost
  const cost = session ? session.cost : 0;

  // Participant counts
  const participantsTotal = participants.length;
  const participantsViewing = participants.length; // Simplified for mock data

  // Current caption (most recent)
  const currentCaption = captions.length > 0 ? captions[captions.length - 1] : null;

  /**
   * Start a new translation session
   */
  const startSession = useCallback(async (config: SessionConfig) => {
    console.log('[SessionContext] startSession called with config:', config);
    console.log('[SessionContext] user:', user);
    console.log('[SessionContext] meetingContext:', meetingContext);
    console.log('[SessionContext] userContext:', userContext);

    if (!user || !meetingContext) {
      console.error('[SessionContext] ❌ Cannot start session - missing user or meeting context');
      console.error('[SessionContext] user exists:', !!user);
      console.error('[SessionContext] meetingContext exists:', !!meetingContext);
      return;
    }

    console.log('[SessionContext] ✅ All requirements met, creating session...');

    // Create new session with V1 pricing fields initialized
    const newSession: Session = {
      id: `session_${Date.now()}`,
      user_id: user.id,
      date_time_start: new Date().toISOString(),
      meeting_title: config.meeting_title || meetingContext.meetingTopic || 'Untitled Meeting',
      meeting_id: meetingContext.meetingID,
      host_name: userContext?.displayName || user.name,
      meeting_type: config.meeting_type,
      source_language: config.source_language,
      target_languages: config.target_languages,
      glossary_id: config.glossary_id,
      participant_count_total: 0,
      participant_count_viewing: 0,
      tier: user.subscription_tier || 'starter',
      billing_type: user.billing_type,
      cost: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      // V1 Pricing Fields
      base_cost: 0,
      participant_multiplier_value: 1.0,
      participant_multiplier_data: calculateParticipantMultiplier(1),
      overages: [],
      overage_cost: 0,
      peak_participant_count: 0,
      // Overage permissions
      allow_language_requests: config.allow_language_requests,
      allow_participant_overage: config.allow_participant_overage
    };

    console.log('[SessionContext] Created newSession object:', newSession);

    setSession(newSession);
    setIsPaused(false);
    setDuration(0);
    setParticipants([]);
    setCaptions([]);

    console.log('[SessionContext] ✅ Session started successfully:', newSession.id);

    // In real implementation, call backend API:
    // await fetch('/api/sessions/start', {
    //   method: 'POST',
    //   body: JSON.stringify(newSession)
    // });
  }, [user, meetingContext, userContext]);

  /**
   * Pause the current session
   */
  const pauseSession = useCallback(() => {
    if (!session) return;

    setSession(prev => prev ? { ...prev, status: 'paused' } : null);
    setIsPaused(true);

    console.log('[SessionContext] Session paused');
  }, [session]);

  /**
   * Resume a paused session
   */
  const resumeSession = useCallback(() => {
    if (!session) return;

    setSession(prev => prev ? { ...prev, status: 'active' } : null);
    setIsPaused(false);

    console.log('[SessionContext] Session resumed');
  }, [session]);

  /**
   * Stop the current session
   */
  const stopSession = useCallback(async () => {
    if (!session) return;

    const endedSession: Session = {
      ...session,
      date_time_end: new Date().toISOString(),
      duration_hours: duration / 3600, // convert seconds to hours
      status: 'ended',
      participant_count_total: participantsTotal,
      participant_count_viewing: participantsViewing
    };

    setSession(endedSession);
    setIsPaused(false);

    console.log('[SessionContext] Session stopped:', {
      id: endedSession.id,
      duration: endedSession.duration_hours,
      cost: endedSession.cost
    });

    // Track daily free tier usage or PAYG usage
    if (user?.is_free_tier && endedSession.duration_hours) {
      // Daily Free Tier: Track minutes used
      const minutesUsed = Math.ceil(endedSession.duration_hours * 60);
      addDailyFreeMinutes(minutesUsed);
      console.log('[SessionContext] Daily free tier: Used', minutesUsed, 'minutes');
    } else if (!user?.is_free_tier) {
      // PAYG users: Add session cost to unpaid usage (postpaid model)
      if (endedSession.cost > 0) {
        addUnpaidUsage(endedSession.cost);
        console.log('[SessionContext] Added session cost to unpaid usage:', endedSession.cost);
      }
    }

    // In real implementation, call backend API:
    // await fetch(`/api/sessions/${session.id}/stop`, {
    //   method: 'POST',
    //   body: JSON.stringify(endedSession)
    // });

    // Clear session after a delay
    setTimeout(() => {
      setSession(null);
      setParticipants([]);
      setCaptions([]);
      setDuration(0);
    }, 1000);
  }, [session, duration, participantsTotal, participantsViewing, user?.is_free_tier, addDailyFreeMinutes, addUnpaidUsage]);

  // Keep ref updated with latest stopSession
  useEffect(() => {
    stopSessionRef.current = stopSession;
  }, [stopSession]);

  /**
   * Update target languages during active session
   */
  const updateLanguages = useCallback((languages: string[]) => {
    setSession(prev => {
      if (!prev) return null;
      return { ...prev, target_languages: languages };
    });

    console.log('[SessionContext] Languages updated:', languages);
  }, []);

  /**
   * Update meeting type during active session
   */
  const updateMeetingType = useCallback((type: MeetingType) => {
    setSession(prev => {
      if (!prev) return null;
      return { ...prev, meeting_type: type };
    });

    console.log('[SessionContext] Meeting type updated:', type);
  }, []);

  /**
   * Update glossary during active session
   */
  const updateGlossary = useCallback((glossaryId: string | null) => {
    setSession(prev => {
      if (!prev) return null;
      return { ...prev, glossary_id: glossaryId || undefined };
    });

    console.log('[SessionContext] Glossary updated:', glossaryId);
  }, []);

  /**
   * Add a language to active session
   */
  const addLanguageToSession = useCallback((languageCode: string) => {
    setSession(prev => {
      if (!prev) return null;

      // Check if language already exists
      if (prev.target_languages.includes(languageCode)) {
        console.warn('[SessionContext] Language already in session:', languageCode);
        return prev;
      }

      // Add language to target_languages
      const newTargetLanguages = [...prev.target_languages, languageCode];

      console.log('[SessionContext] Language added to session:', languageCode);
      return {
        ...prev,
        target_languages: newTargetLanguages
      };
    });
  }, []);

  /**
   * Add a participant to the session
   */
  const addParticipant = useCallback((participant: Participant) => {
    setParticipants(prev => {
      // Check if participant already exists
      if (prev.find(p => p.id === participant.id)) {
        return prev;
      }
      return [...prev, participant];
    });

    console.log('[SessionContext] Participant added:', participant.name);
  }, []);

  /**
   * Remove a participant from the session
   */
  const removeParticipant = useCallback((participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));

    console.log('[SessionContext] Participant removed:', participantId);
  }, []);

  /**
   * Add a new caption to the stream
   */
  const addCaption = useCallback((caption: Caption) => {
    setCaptions(prev => {
      // Keep only last 50 captions for performance
      const newCaptions = [...prev, caption];
      return newCaptions.slice(-50);
    });
  }, []);

  /**
   * Duration timer - runs when session is active and not paused
   */
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setDuration(prev => {
        const newDuration = prev + 1;

        // Daily Free Tier: 15-minute limit (900 seconds)
        if (isDailyFreeTier) {
          const DAILY_FREE_LIMIT = Math.floor((dailyMinutesRemaining || 15) * 60); // Remaining minutes in seconds
          const WARNING_THRESHOLD = DAILY_FREE_LIMIT - 120; // 2 minutes before limit

          // Show warning at 2 minutes remaining
          if (newDuration === WARNING_THRESHOLD) {
            console.warn('[SessionContext] Daily free tier: 2 minutes remaining');
            alert('Daily Free Tier: 2 minutes remaining. Upgrade to PAYG for unlimited usage.');
          }

          // Auto-end session when daily limit reached
          if (newDuration >= DAILY_FREE_LIMIT) {
            console.warn('[SessionContext] Daily free tier limit reached - auto-ending session');
            alert('Daily Free Tier: 15-minute limit reached. Session has ended. You can start a new session tomorrow or upgrade to PAYG.');
            stopSessionRef.current?.();
            return DAILY_FREE_LIMIT; // Cap at limit
          }
        }

        return newDuration;
      });

      // Update cost every second using V1 pricing (with participant multiplier)
      setSession(prev => {
        if (!prev || !user) return prev;

        const durationHours = (duration + 1) / 3600;
        let newCost = 0;

        if (user.billing_type === 'payg') {
          // V1 PAYG: Calculate with participant multiplier
          const tier = prev.tier;
          const tierData = PRICING_TIERS[tier];
          const multiplierData = calculateParticipantMultiplier(participantsTotal || 1);

          // Base cost = rate × duration × participant multiplier
          newCost = tierData.price_per_hour * durationHours * multiplierData.multiplier;

          // TODO: Add overage costs when languages are added mid-session
          // const overageCost = calculateSessionCost(tier, durationHours, participantsTotal, prev.overages || []);
        }
        // Note: Subscription billing removed - PAYG-only model

        return {
          ...prev,
          cost: parseFloat(newCost.toFixed(2)),
          participant_multiplier_value: calculateParticipantMultiplier(participantsTotal || 1).multiplier,
          peak_participant_count: Math.max(prev.peak_participant_count || 0, participantsTotal)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, duration, isDailyFreeTier, dailyMinutesRemaining, user?.billing_type]);

  /**
   * Load mock session for testing (for participant role in test mode)
   */
  useEffect(() => {
    console.log('[SessionContext] useEffect triggered - checking if participant role...');
    console.log('[SessionContext] userContext:', userContext);
    console.log('[SessionContext] userContext?.role:', userContext?.role);

    // Auto-load mock session for participant testing
    if (userContext?.role === 'attendee') {
      console.log('[SessionContext] ✅ Participant role detected - Loading mock active session');
      setSession(MOCK_SESSION_ACTIVE);
      setParticipants(MOCK_PARTICIPANTS);
      setCaptions(MOCK_CAPTIONS);
    } else {
      console.log('[SessionContext] ❌ Not participant role (role is:', userContext?.role, ')');
    }
  }, [userContext?.role]);

  const value: SessionContextValue = {
    session,
    isActive,
    isPaused,
    duration,
    cost,
    participants,
    participantsViewing,
    participantsTotal,
    captions,
    currentCaption,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    updateLanguages,
    updateMeetingType,
    updateGlossary,
    addLanguageToSession,
    addParticipant,
    removeParticipant,
    addCaption
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * useSession Hook
 *
 * Access active translation session state and controls from any component.
 *
 * @returns {SessionContextValue} Session state and control methods
 * @throws {Error} If used outside SessionProvider
 *
 * @example
 * ```tsx
 * function ActiveSessionDisplay() {
 *   const { session, isActive, duration, participants, stopSession } = useSession();
 *
 *   if (!isActive) {
 *     return <div>No active session</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h2>{session?.meeting_title}</h2>
 *       <p>Duration: {Math.floor(duration / 60)} minutes</p>
 *       <p>Participants: {participants.length}</p>
 *       <Button onClick={stopSession}>Stop Session</Button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}
