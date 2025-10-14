
import { useState, useEffect } from 'react';
import { ZoomProvider, useZoom } from './context/ZoomContext';
import { UserProvider, useUser } from './context/UserContext';
import { SessionProvider, useSession } from './context/SessionContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Card, CardContent } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { HostSettings } from './components/screens/host/HostSettings';
import { HostActive } from './components/screens/host/HostActive';
import { HostSetup } from './components/screens/host/HostSetup';
import { SessionSummary } from './components/screens/host/SessionSummary';
import { ParticipantLanguageSelect } from './components/screens/participant/ParticipantLanguageSelect';
import { CompactParticipantCaptionView } from './components/screens/participant/CompactParticipantCaptionView';
import { ParticipantError, ParticipantErrorType } from './components/screens/participant/ParticipantError';
import { OAuthSSOScreen } from './components/screens/oauth/OAuthSSOScreen';
import { WelcomeScreen } from './components/screens/oauth/WelcomeScreen';
import { FreeTrialActivatedScreen } from './components/screens/oauth/FreeTrialActivatedScreen';
import { TierSelectionModal } from './components/screens/modals/TierSelectionModal';
import { UsageWarningModal, UsageWarningType } from './components/screens/modals/UsageWarningModal';
import { AddPaymentMethodModal } from './components/screens/modals/AddPaymentMethodModal';
import { ManagePaymentMethodModal } from './components/screens/modals/ManagePaymentMethodModal';
import { SubscriptionTier } from './types';
import { TestModeSelector } from './components/TestModeSelector';
import { ZoomAppContainer } from './components/ZoomAppContainer';
import type { TestModeConfig } from './components/TestModeSelector';


/**
 * MeetingSync Zoom App - Main Application
 *
 * Screen Flow:
 * HOST:
 *   1. HostSetup (Screen 1A/1B) → Configure translation
 *   2. HostActive (Screen 2) → Manage active session
 *   3. HostSettings (Screen 3) → Activity, Templates, Glossaries, Account, Preferences
 *
 * PARTICIPANT:
 *   6. ParticipantLanguageSelect (Screen 6) → Choose language
 *   7. CompactParticipantCaptionView (Screen 7) → View captions (compact sidebar version)
 *   8. ParticipantError (Screen 8) → Error states
 *
 * MODALS:
 *   4. TierSelectionModal (Screen 4) → Select/upgrade tier
 *   5. UsageWarningModal (Screen 5) → Usage limit warnings
 */

type AppScreen =
  | 'loading'
  | 'error'
  | 'oauth-sso'           // Zoom SSO authorization (simulated in test mode)
  | 'welcome'             // Welcome screen with free trial offer
  | 'trial-activated'     // Free trial activation confirmation
  | 'host-setup'
  | 'host-active'
  | 'session-summary'     // Post-session summary with transcript download
  | 'host-settings'
  | 'participant-language-select'
  | 'participant-caption-view'
  | 'participant-error';

interface AppContentProps {
  testMode?: TestModeConfig | null;
}

function AppContent(props: AppContentProps): React.ReactElement | null {
  const testMode = props.testMode;
  const { isConnected, isLoading, error: zoomError, userContext } = useZoom();
  const { user, setPaymentMethodAdded } = useUser();
  const { isActive } = useSession();

  // Screen state
    const [currentScreen, setCurrentScreen] = useState<AppScreen>('loading');
    const [previousScreen, setPreviousScreen] = useState<AppScreen | null>(null);
    const [participantLanguage, setParticipantLanguage] = useState<string | null>(null);
    const [participantErrorType, setParticipantErrorType] = useState<ParticipantErrorType>('no_session');
    const [hasInitialized, setHasInitialized] = useState(false);
  const [isViewingAsParticipant, setIsViewingAsParticipant] = useState(false); // Track if host is viewing as participant

  // Modal state
  const [showTierModal, setShowTierModal] = useState(false);
  const [tierModalContext, setTierModalContext] = useState<'upgrade' | 'initial' | 'language_limit'>('initial');
  const [showUsageWarningModal, setShowUsageWarningModal] = useState(false);
  const [usageWarningType] = useState<UsageWarningType>('high_usage');
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState(false);
  const [showManagePaymentMethodModal, setShowManagePaymentMethodModal] = useState(false);
  const [paymentModalContext, setPaymentModalContext] = useState<'add' | 'update'>('add');
  // Removed selectedTierForPayment

  // Determine if user is host
  const isHost = userContext?.role === 'host' || userContext?.role === 'cohost';

  // Scroll to top when screen changes (UX improvement)
  useEffect(() => {
    // Exceptions: Don't scroll to top for these screen transitions
    const noScrollScreens = [
      'loading', // Initial load
      'participant-caption-view' // Captions should maintain scroll position for user experience
    ];

    if (!noScrollScreens.includes(currentScreen)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Only show error if there's an actual error message
    // Don't treat "not connected yet" as an error during initial load
    if (zoomError) {
      setCurrentScreen('error');
      setHasInitialized(true);
      return;
    }

    // Wait for connection before proceeding
    if (!isConnected) {
      return;
    }

    // If full-journey test mode and not yet initialized, start with OAuth/SSO screen
    if (testMode?.path === 'full-journey' && !hasInitialized) {
      setHasInitialized(true);
      setCurrentScreen('oauth-sso');
      return;
    }

    // Route based on role (direct-access or after OAuth flow)
    if (!hasInitialized) {
      setHasInitialized(true);

      if (isHost) {
        // Host flow
        if (isActive) {
          setCurrentScreen('host-active');
        } else {
          setCurrentScreen('host-setup');
        }
      } else {
        // Participant flow
        if (!isActive) {
          setParticipantErrorType('no_session');
          setCurrentScreen('participant-error');
        } else if (!participantLanguage) {
          setCurrentScreen('participant-language-select');
        } else {
          setCurrentScreen('participant-caption-view');
        }
      }
    }
  }, [isLoading, zoomError, isConnected, isHost, isActive, participantLanguage, testMode, hasInitialized]);

  // Host screen handlers

  const handleStartSession = () => {
    setCurrentScreen('host-active');
  };

  const handleEndSession = () => {
    setCurrentScreen('session-summary');
  };

  const handleStartNewSession = () => {
    setCurrentScreen('host-setup');
    // Removed selectedTierForPayment
  };

  const handleReturnToDashboard = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('host-settings');
  };

  const handleOpenSettings = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('host-settings');
  };

  const handleCloseSettings = () => {
    // Return to previous screen if available, otherwise default behavior
    if (previousScreen && previousScreen !== 'host-settings') {
      setCurrentScreen(previousScreen);
      setPreviousScreen(null);
    } else if (isActive) {
      setCurrentScreen('host-active');
    } else {
      setCurrentScreen('host-setup');
    }
  };

  const handleViewAsParticipant = () => {
    // Switch to participant view for testing (host is viewing as participant)
    setIsViewingAsParticipant(true);
    setParticipantLanguage(null);
    setCurrentScreen('participant-language-select');
  };

  // Participant screen handlers
  const handleLanguageSelect = (languageCode: string) => {
    setParticipantLanguage(languageCode);
    setCurrentScreen('participant-caption-view');
  };

  const handleChangeLanguage = () => {
    setParticipantLanguage(null);
    setCurrentScreen('participant-language-select');
  };

  const handleParticipantLeave = () => {
    console.log('[App] Participant stopped viewing captions');
    setParticipantLanguage(null);
    
    // If host was viewing as participant, return them to host session view
    if (isViewingAsParticipant) {
      setIsViewingAsParticipant(false);
      setCurrentScreen('host-active');
      console.log('[App] Host returned to session from participant view');
    } else {
      // Real participant - return to language selection
      setCurrentScreen('participant-language-select');
    }
  };

  // Handle when participant wants to leave language selection
  const handleParticipantCancel = () => {
    console.log('[App] Participant canceled language selection');
    setParticipantLanguage(null);
    
    // If host was viewing as participant, return them to host session view
    if (isViewingAsParticipant) {
      setIsViewingAsParticipant(false);
      setCurrentScreen('host-active');
      console.log('[App] Host returned to session from participant language selection');
    } else {
      // Real participant - show welcome screen
      setCurrentScreen('welcome');
    }
  };

  const handleParticipantRetry = () => {
    if (isActive) {
      setCurrentScreen('participant-language-select');
    } else {
      setParticipantErrorType('no_session');
      setCurrentScreen('participant-error');
    }
  };

  // Modal handlers
  const handleSelectTier = (tier: SubscriptionTier, billingType: 'payg') => {
    console.log('[App] Selected tier:', tier, billingType);

    // Close tier selection modal
    setShowTierModal(false);

    // If user doesn't have payment method, need to add payment
    if (!user?.payment_method_added) {
      console.log('[App] User browsing pricing, will add payment method');

      // Open AddPaymentMethodModal directly (no intermediate alert needed)
      // User already saw pricing info in the modal, just proceed to payment
      setTimeout(() => {
        setPaymentModalContext('add');
        setShowAddPaymentMethodModal(true);
      }, 100);

      // Note: Tier is NOT set yet - will be selected on first session (tier lock model)
    } else {
      // Existing PAYG user with payment method - just update tier
      console.log('[App] PAYG user changing tier to:', tier);
      alert(`Tier updated to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!\n\nYour new rate will apply to future sessions.`);
      // In production: await updateUserTier(user.id, tier);
      
      // Navigate back to host-setup (Start Session page)
      setCurrentScreen('host-setup');
    }
  };

  const handleUsageWarningContinue = () => {
    console.log('[App] User continued despite usage warning');
    setShowUsageWarningModal(false);
  };

  const handleManagePayment = () => {
    console.log('[App] User wants to manage payment method');
    setShowUsageWarningModal(false);
    setShowManagePaymentMethodModal(true);
  };

  const handleAddPaymentMethodFromSettings = () => {
    console.log('[App] User wants to add payment method from Settings');
    setPaymentModalContext('add');
    setShowAddPaymentMethodModal(true);
  };

  const handleUpdatePaymentMethod = () => {
    console.log('[App] User wants to update payment method');
    setShowManagePaymentMethodModal(false);
    setPaymentModalContext('update');
    setShowAddPaymentMethodModal(true);
  };

  const handlePaymentMethodAdded = () => {
    console.log('[App] Payment method added successfully');

    // Convert to paid PAYG user (NO tier set yet) - free tier no longer "completes"
    // Note: completeFreeTrial() removed as it's no longer needed for daily free tier model
    
    // CRITICAL: Update user state to reflect payment method has been added
    setPaymentMethodAdded(true);

    setShowAddPaymentMethodModal(false);

    // Show success message and navigate to HostSetup
    setTimeout(() => {
      alert(
        `Payment Method Added Successfully! 🎉\n\n` +
        `You're all set to start using MeetingSync.\n\n` +
        `You'll choose your tier when you start your first session.\n\n` +
        `You'll only be billed for actual usage at the end of each month.`
      );

      // Navigate directly to HostSetup screen (ready to start translating)
      setCurrentScreen('host-setup');
    }, 300);

    // In production: Mark trial as complete and save payment method
    // await completeFreeTrial(user.id);
    // await savePaymentMethod(user.id, paymentMethodId);
    // Backend updates user object:
    // - is_free_trial_active: false
    // - payment_method_added: true
    // - subscription_tier: null (will be set on first session)
    // - unpaid_usage: 0
    // - billing_period_start: null (will be set on first session)
    // - billing_period_end: null (will be set on first session)
  };

  // Removed handleUpgrade - no longer needed for postpaid model

  // OAuth flow handlers
  const handleOAuthSignIn = () => {
    console.log('[App] User signed in via OAuth');
    setCurrentScreen('welcome');
  };

  const handleStartFreeTier = () => {
    console.log('[App] User started daily free tier');
    setCurrentScreen('trial-activated');
  };

  const handleSeePlans = () => {
    console.log('[App] User wants to see plans');
    setTierModalContext('initial');
    setShowTierModal(true);
  };

  const handleSkipWelcome = () => {
    console.log('[App] User skipped welcome');
    setCurrentScreen('host-setup');
  };

  const handleStartFirstSession = () => {
    console.log('[App] User ready to start first session');
    setCurrentScreen('host-setup');
  };

  const handleComparePlans = () => {
    console.log('[App] User wants to compare plans');
    setTierModalContext('upgrade');
    setShowTierModal(true);
  };

  const handleCancelSetup = () => {
    console.log('[App] Setup cancelled');
    // If in full-journey flow, return to welcome
    if (testMode?.path === 'full-journey') {
      setCurrentScreen('welcome');
    } else {
      // Otherwise, go to settings (dashboard)
      setCurrentScreen('host-settings');
    }
  };

  const handleOpenTierModal = () => {
    console.log('[App] Opening tier selection modal');
    setTierModalContext('upgrade');
    setShowTierModal(true);
  };

  // Loading screen
  if (currentScreen === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card variant="default" padding="lg" className="max-w-md w-full">
          <CardContent>
            <div className="flex flex-col items-center py-12 space-y-4">
              <div className="w-16 h-16 border-4 border-teal-600 dark:border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Connecting to Zoom...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please wait while we initialize MeetingSync
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error screen
  if (currentScreen === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card variant="default" padding="lg" className="max-w-md w-full">
          <CardContent>
            <div className="text-center space-y-6">
              <div className="text-6xl">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Connection Error
              </h1>
              <p className="text-gray-700 dark:text-gray-300">
                {zoomError || 'Failed to connect to Zoom SDK'}
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Retry Connection
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  If the problem persists, please contact support
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render current screen
  return (
    <>
      {/* OAuth/Onboarding Screens */}
      {currentScreen === 'oauth-sso' && (
        <OAuthSSOScreen onSignIn={handleOAuthSignIn} />
      )}

      {currentScreen === 'welcome' && user && (
        <WelcomeScreen
          userName={userContext?.screenName || user.name}
          isPaidZoom={user.zoom_account_type !== 1}
          onStartFreeTier={handleStartFreeTier}
          onSeePlans={handleSeePlans}
          onSkip={handleSkipWelcome}
          onCancel={() => setCurrentScreen('host-settings')}
        />
      )}

      {currentScreen === 'trial-activated' && (
        <FreeTrialActivatedScreen
          onStartSession={handleStartFirstSession}
          onComparePlans={handleComparePlans}
        />
      )}

      {/* Host Screens */}
      {currentScreen === 'host-setup' && (
        <HostSetup
          onStart={handleStartSession}
          onCancel={handleCancelSetup}
          onSettings={handleOpenSettings}
          onOpenTierModal={handleOpenTierModal}
        />
      )}

      {currentScreen === 'host-active' && (
        <HostActive
          onEnd={handleEndSession}
          onSettings={handleOpenSettings}
          onViewAsParticipant={handleViewAsParticipant}
        />
      )}

      {currentScreen === 'session-summary' && (
        <SessionSummary
          onStartNewSession={handleStartNewSession}
          onReturnToDashboard={handleReturnToDashboard}
          onOpenTierModal={handleOpenTierModal}
        />
      )}

      {currentScreen === 'host-settings' && (
        <HostSettings
          onBack={handleCloseSettings}
          defaultTab="activity"
          onAddPaymentMethod={handleAddPaymentMethodFromSettings}
        />
      )}

      {/* Participant Screens */}
      {currentScreen === 'participant-language-select' && (
        <ParticipantLanguageSelect
          onLanguageSelect={handleLanguageSelect}
          onCancel={handleParticipantCancel}
        />
      )}

      {currentScreen === 'participant-caption-view' && participantLanguage && (
        <CompactParticipantCaptionView
          selectedLanguage={participantLanguage}
          onChangeLanguage={handleChangeLanguage}
          onLeave={handleParticipantLeave}
        />
      )}

      {currentScreen === 'participant-error' && (
        <ParticipantError
          errorType={participantErrorType}
          onRetry={handleParticipantRetry}
          onContactHost={() => {
            alert('Please contact the meeting host via Zoom chat for assistance.\n\nYou can also reach support at support@meetingsync.com');
          }}
          onLeave={() => console.log('[App] Participant left')}
        />
      )}

      {/* Modals */}
      <TierSelectionModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        currentTier={user?.subscription_tier}
        onSelectTier={handleSelectTier}
        onManagePayment={handleManagePayment}
        context={tierModalContext}
      />

      <UsageWarningModal
        isOpen={showUsageWarningModal}
        onClose={() => setShowUsageWarningModal(false)}
        warningType={usageWarningType}
        estimatedSessionCost={0}
        onContinue={handleUsageWarningContinue}
        onManagePayment={handleManagePayment}
      />

      <AddPaymentMethodModal
        isOpen={showAddPaymentMethodModal}
        onClose={() => setShowAddPaymentMethodModal(false)}
        onPaymentMethodAdded={handlePaymentMethodAdded}
// ...existing code...
        context={paymentModalContext}
      />

      <ManagePaymentMethodModal
        isOpen={showManagePaymentMethodModal}
        onClose={() => setShowManagePaymentMethodModal(false)}
        onUpdatePaymentMethod={handleUpdatePaymentMethod}
      />
    </>
  );
}

function App() {
  const [testModeState, setTestModeState] = useState<TestModeConfig | null>(null);
  const [showTestSelector, setShowTestSelector] = useState(true);
  const [showStartOverButton, setShowStartOverButton] = useState(true);

  // Check if in development mode or forced test mode
  const isDevelopmentMode = import.meta.env.DEV || import.meta.env.VITE_FORCE_TEST_MODE === 'true';

  // Check for "Start Over" button visibility (can be toggled with Ctrl+Shift+S)
  useEffect(() => {
    const storedVisibility = localStorage.getItem('meetingsync-show-start-over');
    if (storedVisibility !== null) {
      setShowStartOverButton(storedVisibility === 'true');
    }

    // Keyboard shortcut: Ctrl+Shift+S to toggle Start Over button
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowStartOverButton(prev => {
          const newValue = !prev;
          localStorage.setItem('meetingsync-show-start-over', String(newValue));
          console.log(`[App] Start Over button ${newValue ? 'enabled' : 'disabled'} (Ctrl+Shift+S)`);
          return newValue;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTestModeStart = (config: TestModeConfig) => {
    setTestModeState(config);
    setShowTestSelector(false);

    // Store in sessionStorage so it persists during development
    sessionStorage.setItem('meetingsync-test-mode', JSON.stringify(config));
  };

  const handleResetToTestMode = () => {
    // Clear test mode and return to selector
    setTestModeState(null);
    setShowTestSelector(true);
    sessionStorage.removeItem('meetingsync-test-mode');
  };

  // Load test mode from sessionStorage on mount
  useEffect(() => {
    if (isDevelopmentMode) {
      const stored = sessionStorage.getItem('meetingsync-test-mode');
      if (stored) {
        try {
          const config = JSON.parse(stored);
          setTestModeState(config);
          setShowTestSelector(false);
        } catch (e) {
          console.error('Failed to parse stored test mode:', e);
        }
      }
    }
  }, [isDevelopmentMode]);

  // Show test selector in development mode
  if (isDevelopmentMode && showTestSelector) {
    return <TestModeSelector onStart={handleTestModeStart} />;
  }

  // Map accountType to user type for UserProvider
  const getUserType = (): 'payg' | 'payg-no-tier' | 'payg-starter' | 'payg-professional' | 'payg-enterprise' | 'free' | 'trial' | 'free-tier' | undefined => {
    if (!testModeState) return undefined;
    // Map TestMode account types to UserProvider types
    if (testModeState.accountType === 'free-tier') return 'free-tier';
    if (testModeState.accountType === 'payg-no-tier') return 'payg-no-tier';
    // Return exact PAYG tier to load correct mock user
    return testModeState.accountType; // 'payg-starter', 'payg-professional', or 'payg-enterprise'
  };

  // Wrap in ZoomAppContainer for development mode
  const appContent = (
    <ZoomProvider testConfig={testModeState}>
      <UserProvider testUserType={getUserType()}>
        <SessionProvider>
          <AppContent testMode={testModeState} />
        </SessionProvider>
      </UserProvider>
    </ZoomProvider>
  );

  // In development, wrap with ZoomAppContainer to simulate sidebar
  if (isDevelopmentMode && !showTestSelector) {
    return (
      <ErrorBoundary>
        <ZoomAppContainer>{appContent}</ZoomAppContainer>

        {/* Floating Start Over Button (Development Only - Toggle with Ctrl+Shift+S) */}
        {showStartOverButton && (
          <button
            onClick={handleResetToTestMode}
            className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-lg transition-colors flex items-center gap-2"
            title="Return to test mode selector (Ctrl+Shift+S to toggle)"
          >
            <span>Start Over</span>
          </button>
        )}
      </ErrorBoundary>
    );
  }

  return <ErrorBoundary>{appContent}</ErrorBoundary>;
}
export default App;
