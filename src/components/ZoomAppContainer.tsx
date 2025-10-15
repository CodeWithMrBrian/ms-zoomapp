

import { useState, useEffect, ReactNode } from 'react';

/**
 * ZoomAppContainer
 *
 * Simulates the Zoom Apps sidebar dimensions for realistic testing.
 * The sidebar width is constrained but height fills almost the entire screen
 * (minus the Zoom window controls at the top).
 *
 * Width constraints (based on Zoom screenshot analysis):
 * - Windows: 480px typical, 450px minimum
 * - Mac: 450px typical, 400px minimum
 * - Tablet/mobile: 400px
 *
 * Height: Full screen minus ~40px for Zoom window title bar
 * Scrollbar: 16px wide, visible on right edge (matches Windows Zoom client)
 */

type DeviceType = 'windows' | 'mac' | 'tablet' | 'desktop';

interface ZoomAppContainerProps {
  children: ReactNode;
}

const DEVICE_WIDTHS: Record<DeviceType, { width: number; label: string }> = {
  windows: { width: 480, label: 'Windows (480px)' },
  mac: { width: 450, label: 'Mac (450px)' },
  tablet: { width: 400, label: 'Tablet (400px)' },
  desktop: { width: 520, label: 'Desktop (520px)' }
};

export function ZoomAppContainer({ children }: ZoomAppContainerProps) {
  const [device, setDevice] = useState<DeviceType>('windows');
  // Hide controls by default
  const [showControls, setShowControls] = useState(false);
  const [showWidthIndicator, setShowWidthIndicator] = useState(true);

  const deviceWidth = DEVICE_WIDTHS[device].width;

  // Auto-hide width indicator after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWidthIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [device]); // Reset timer when device changes

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden">
      {/* Zoom Window Title Bar (simulates OS window controls) */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-2">
            Zoom Meeting
          </span>
        </div>
      </div>

      {/* Development Controls */}
      {showControls && (
        <div className="absolute top-14 left-4 z-50 flex flex-col gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Sidebar Width:
            </span>
            <button
              onClick={() => setShowControls(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DEVICE_WIDTHS) as DeviceType[]).map(d => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  device === d
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {DEVICE_WIDTHS[d].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show Controls Toggle (when hidden) */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute top-14 left-4 z-50 w-10 h-10 flex items-center justify-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Show device controls"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      )}

      {/* Main Content Area (sidebar on the right, simulating Zoom's layout) */}
      <div className="absolute top-10 right-0 bottom-0 flex" style={{ width: `${deviceWidth}px` }}>
        {/* Zoom App Sidebar */}
        <div className="flex-1 bg-white dark:bg-gray-900 border-l-4 border-gray-300 dark:border-gray-700 shadow-2xl flex flex-col">
          {/* App Header (inside sidebar) */}
          <div className="h-12 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center px-4 flex-shrink-0">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              <span className="text-sm font-semibold text-white">MeetingSync</span>
            </div>
            <div className="flex gap-1">
              <button className="w-8 h-8 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center justify-center text-white text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* App Content Area (scrollable) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Meeting Simulation (left side - main video area) */}
      <div className="absolute top-10 left-0 bottom-0" style={{ right: `${deviceWidth}px` }}>
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-white">
              <p className="text-lg font-semibold">John Doe</p>
              <p className="text-sm text-gray-400">Host</p>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Width Indicator (auto-hides after 3s, then disappears completely) */}
      {showWidthIndicator && (
        <div
          className="absolute top-14 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transition-opacity duration-300 flex items-center gap-2"
        >
          <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
            {deviceWidth}px wide
          </span>
          <button
            onClick={() => setShowWidthIndicator(false)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Hide width indicator"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
