import { useState, useEffect, useCallback } from 'react';
// ZOOM SDK DISABLED FOR GUI DEVELOPMENT
// import zoomSdk from '@zoom/appssdk';

/**
 * Zoom SDK Hook
 *
 * ⚠️ ZOOM SDK DISABLED - GUI DEVELOPMENT MODE
 *
 * This hook now returns MOCK DATA ONLY for GUI testing.
 * Real Zoom SDK integration is disabled until GUI is finalized.
 *
 * Features:
 * - Mock connection state (always connected)
 * - Mock meeting context
 * - Mock user context
 * - No actual Zoom SDK calls
 */

export interface ZoomMeetingContext {
  meetingID: string;
  meetingTopic?: string;
  meetingUUID?: string;
}

export interface ZoomUserContext {
  userId: string;
  displayName?: string;
  email?: string;
  role?: 'host' | 'cohost' | 'attendee';
  accountId?: string;
  screenName?: string;
}

export interface ZoomSDKState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  meetingContext: ZoomMeetingContext | null;
  userContext: ZoomUserContext | null;
}

export interface UseZoomSDKReturn extends ZoomSDKState {
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshMeetingContext: () => Promise<void>;
  refreshUserContext: () => Promise<void>;
  shareApp: () => Promise<void>;
}

/**
 * useZoomSDK Hook
 *
 * @returns {UseZoomSDKReturn} Zoom SDK state and methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isConnected, meetingContext, userContext, connect } = useZoomSDK();
 *
 *   useEffect(() => {
 *     connect();
 *   }, []);
 *
 *   if (!isConnected) return <div>Connecting to Zoom...</div>;
 *
 *   return (
 *     <div>
 *       <h1>Meeting: {meetingContext?.meetingTopic}</h1>
 *       <p>User: {userContext?.displayName}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useZoomSDK(testConfig?: any): UseZoomSDKReturn {
  // GUI DEVELOPMENT MODE: Initialize as already connected with mock data
  // Determine role from testConfig
  const mockRole = testConfig?.role === 'participant' ? 'attendee' : 'host';
  const mockUserName = testConfig?.role === 'participant' ? 'Participant User' : 'Host User';

  const [state, setState] = useState<ZoomSDKState>({
    isConnected: true,  // Always connected in GUI development mode
    isLoading: false,
    error: null,
    meetingContext: {
      meetingID: 'mock-meeting-123',
      meetingTopic: 'Mock Meeting for Development',
      meetingUUID: 'mock-uuid-456'
    },
    userContext: {
      userId: 'mock-user-001',
      displayName: mockUserName,
      email: 'test@meetingsync.local',
      role: mockRole,
      accountId: 'mock-account-789',
      screenName: mockUserName
    }
  });

  /**
   * Connect function - ensures mock data is set
   */
  const connect = useCallback(async () => {
    // ========================================
    // ZOOM SDK DISABLED FOR GUI DEVELOPMENT
    // ========================================
    console.log('[useZoomSDK] 🔧 GUI Development Mode - Using Mock Data (Zoom SDK Disabled)');

    // Set state with mock data (important for when disconnect was called)
    setState({
      isConnected: true,
      isLoading: false,
      error: null,
      meetingContext: {
        meetingID: 'mock-meeting-123',
        meetingTopic: 'Mock Meeting for Development',
        meetingUUID: 'mock-uuid-456'
      },
      userContext: {
        userId: 'mock-user-001',
        displayName: mockUserName,
        email: 'test@meetingsync.local',
        role: mockRole,
        accountId: 'mock-account-789',
        screenName: mockUserName
      }
    });

    console.log('[useZoomSDK] Mock data connected successfully');

    // ========================================
    // SIMULATE ZOOM NATIVE CONTROLS IN TEST MODE
    // ========================================
    // Detect clicks on the Zoom app header area and show helpful message
    // This simulates the native Zoom settings button behavior
    const handleNativeSettingsClick = (event: MouseEvent) => {
      // Check if click is in the top header area (roughly top 60px)
      if (event.clientY < 60) {
        console.log('[useZoomSDK] Detected click in native Zoom header area');

        // Show informative alert about native controls
        setTimeout(() => {
          alert(
            'Native Zoom Controls\n\n' +
            'The controls at the very top of this window (gear icon, close button) are provided by Zoom.\n\n' +
            'In this test mode, they are not functional.\n\n' +
            'Please use the Settings gear icon inside the app (in the teal header below) to access settings.\n\n' +
            'These native controls will work when the app runs inside a real Zoom meeting.'
          );
        }, 100);
      }
    };

    // Add event listener for clicks in header area
    document.addEventListener('click', handleNativeSettingsClick);

    // Store cleanup function
    (window as any).__zoomHeaderCleanup = () => {
      document.removeEventListener('click', handleNativeSettingsClick);
    };
  }, [mockRole, mockUserName]);

  /**
   * Disconnect from Zoom SDK
   */
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isLoading: false,
      error: null,
      meetingContext: null,
      userContext: null
    });

    // Clean up native header click listener
    if ((window as any).__zoomHeaderCleanup) {
      (window as any).__zoomHeaderCleanup();
      delete (window as any).__zoomHeaderCleanup;
    }

    console.log('[useZoomSDK] Disconnected');
  }, []);

  /**
   * Refresh meeting context (useful when meeting info changes)
   * DISABLED FOR GUI DEVELOPMENT - Returns mock data
   */
  const refreshMeetingContext = useCallback(async () => {
    if (!state.isConnected) {
      console.warn('[useZoomSDK] Cannot refresh meeting context - not connected');
      return;
    }

    console.log('[useZoomSDK] Mock: Meeting context refreshed (no real SDK call)');
  }, [state.isConnected]);

  /**
   * Refresh user context (useful after authorization changes)
   * DISABLED FOR GUI DEVELOPMENT - Returns mock data
   */
  const refreshUserContext = useCallback(async () => {
    if (!state.isConnected) {
      console.warn('[useZoomSDK] Cannot refresh user context - not connected');
      return;
    }

    console.log('[useZoomSDK] Mock: User context refreshed (no real SDK call)');
  }, [state.isConnected]);

  /**
   * Share app with other meeting participants
   * DISABLED FOR GUI DEVELOPMENT - Mock implementation
   */
  const shareApp = useCallback(async () => {
    if (!state.isConnected) {
      console.warn('[useZoomSDK] Cannot share app - not connected');
      return;
    }

    console.log('[useZoomSDK] Mock: App shared successfully (no real SDK call)');
  }, [state.isConnected]);

  /**
   * Auto-connect on mount
   */
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []); // Remove dependencies to prevent re-running

  return {
    ...state,
    connect,
    disconnect,
    refreshMeetingContext,
    refreshUserContext,
    shareApp
  };
}
