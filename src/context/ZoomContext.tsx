import { createContext, useContext, ReactNode } from 'react';
import { useZoomSDK, UseZoomSDKReturn } from '../hooks/useZoomSDK';

/**
 * Zoom Context
 *
 * Provides Zoom SDK state and methods to all components in the app.
 * Wraps the useZoomSDK hook for global access.
 *
 * Features:
 * - Global Zoom SDK connection state
 * - Meeting context (meeting ID, topic, UUID)
 * - User context (user ID, name, role, email)
 * - SDK control methods (connect, disconnect, refresh, share)
 */

interface ZoomContextValue extends UseZoomSDKReturn {}

const ZoomContext = createContext<ZoomContextValue | undefined>(undefined);

/**
 * ZoomProvider Component
 *
 * Wraps the app and provides Zoom SDK state to all child components.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ZoomProvider>
 *       <YourApp />
 *     </ZoomProvider>
 *   );
 * }
 * ```
 */
export function ZoomProvider({ children, testConfig }: { children: ReactNode; testConfig?: any }) {
  const zoomSDK = useZoomSDK(testConfig);

  return (
    <ZoomContext.Provider value={zoomSDK}>
      {children}
    </ZoomContext.Provider>
  );
}

/**
 * useZoom Hook
 *
 * Access Zoom SDK state and methods from any component.
 *
 * @returns {ZoomContextValue} Zoom SDK state and methods
 * @throws {Error} If used outside ZoomProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isConnected, meetingContext, userContext } = useZoom();
 *
 *   if (!isConnected) {
 *     return <div>Connecting to Zoom...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Meeting: {meetingContext?.meetingTopic}</h1>
 *       <p>Host: {userContext?.displayName}</p>
 *       <p>Role: {userContext?.role}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useZoom(): ZoomContextValue {
  const context = useContext(ZoomContext);

  if (context === undefined) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }

  return context;
}
