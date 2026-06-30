import React, { useEffect, useState } from 'react';
import { Home, BookOpen, BarChart3, ShoppingBag, ShieldAlert, Coins, Download, Smartphone } from 'lucide-react';
import { useAppState } from './hooks/useAppState';
import { useWorkoutTimer } from './hooks/useWorkoutTimer';
import type { SoundPack } from './utils/audioSynth';

// Views
import { HomeView } from './views/HomeView';
import { WorkoutPlayerView } from './views/WorkoutPlayerView';
import { CompletionView } from './views/CompletionView';
import { ExerciseInfoView } from './views/ExerciseInfoView';
import { StatsView } from './views/StatsView';
import { ShopView } from './views/ShopView';
import { SafetyView } from './views/SafetyView';

type MainTab = 'home' | 'info' | 'stats' | 'shop' | 'safety';
type ViewState = MainTab | 'player' | 'completion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isRunningStandalone = () => {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
};

export const App: React.FC = () => {
  const {
    state,
    completeWorkout,
    checkStreakRepairAvailable,
    repairStreak,
    buyStreakSaver,
    purchaseCosmetic,
    equipCosmetic,
  } = useAppState();

  const [activeView, setActiveView] = useState<ViewState>('home');
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Results captured from completing a workout to pass to the completion screen
  const [workoutResult, setWorkoutResult] = useState<{
    coinsEarned: number;
    newStreak: number;
    exerciseIncremented: string | null;
  } | null>(null);

  useEffect(() => {
    setIsInstalled(isRunningStandalone());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
      setIsInstalled(false);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Callback when workout finishes successfully
  const handleWorkoutComplete = () => {
    const res = completeWorkout();
    if (res.success) {
      setWorkoutResult({
        coinsEarned: res.coinsEarned || 10,
        newStreak: res.newStreak || 0,
        exerciseIncremented: res.exerciseIncremented || null,
      });
    } else {
      // If worked out twice in a day, give default screen results but no new coins
      setWorkoutResult({
        coinsEarned: 0,
        newStreak: state.streakCurrent,
        exerciseIncremented: null,
      });
    }
    setActiveView('completion');
  };

  // Connect workout timer engine
  const timer = useWorkoutTimer(
    state.progression,
    state.activeSoundPack as SoundPack,
    handleWorkoutComplete,
    activeView
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView
            state={state}
            onStartWorkout={() => setActiveView('player')}
            repairStreak={repairStreak}
            checkStreakRepairAvailable={checkStreakRepairAvailable}
            buyStreakSaver={buyStreakSaver}
          />
        );
      case 'info':
        return <ExerciseInfoView />;
      case 'stats':
        return <StatsView state={state} />;
      case 'shop':
        return (
          <ShopView
            state={state}
            purchaseCosmetic={purchaseCosmetic}
            equipCosmetic={equipCosmetic}
          />
        );
      case 'safety':
        return <SafetyView />;
      default:
        return null;
    }
  };

  const handleInstallApp = async () => {
    if (!installPromptEvent) return;

    await installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    if (choice.outcome !== 'dismissed') {
      setIsInstalled(true);
    }
    setInstallPromptEvent(null);
  };

  // Fullscreen player and completion screens bypass general shell layout
  if (activeView === 'player') {
    return (
      <WorkoutPlayerView
        currentStep={timer.currentStep}
        nextStep={timer.nextStep}
        secondsRemaining={timer.secondsRemaining}
        progressPercent={timer.progressPercent}
        isActive={timer.isActive}
        startTimer={timer.startTimer}
        pauseTimer={timer.pauseTimer}
        skipStep={timer.skipStep}
        resetTimer={timer.resetTimer}
        totalDurationRemaining={timer.totalDurationRemaining}
        onExit={() => {
          timer.resetTimer();
          setActiveView('home');
        }}
      />
    );
  }

  if (activeView === 'completion' && workoutResult) {
    return (
      <CompletionView
        coinsEarned={workoutResult.coinsEarned}
        newStreak={workoutResult.newStreak}
        exerciseIncremented={workoutResult.exerciseIncremented}
        onReturnHome={() => {
          setWorkoutResult(null);
          setActiveView('home');
        }}
      />
    );
  }

  return (
    <>
      {/* Shell Header */}
      <header className="header-bar">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SpineForge
        </h2>
        
        {/* Quick balance display */}
        <div className="stat-pill coins" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
          <Coins size={14} />
          <span>{state.coins}</span>
        </div>
      </header>

      {!isInstalled && (
        <section className="install-card" aria-label="Install SpineForge app">
          <div className="install-card-icon">
            <Smartphone size={24} />
          </div>
          <div className="install-card-copy">
            <h3>Install SpineForge</h3>
            <p>
              Browser mode is only a backup. Add SpineForge to your home screen for daily training and cleaner PWA updates.
            </p>
            {!installPromptEvent && (
              <p className="install-card-hint">
                iPhone: tap Share, then Add to Home Screen. Android: use the browser menu and choose Install app.
              </p>
            )}
          </div>
          {installPromptEvent && (
            <button className="btn btn-primary install-card-button" onClick={handleInstallApp}>
              <Download size={16} />
              Install
            </button>
          )}
        </section>
      )}

      {/* Main View Scroll Area */}
      {renderActiveView()}

      {/* Sticky Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button
          onClick={() => setActiveView('home')}
          className={`bottom-nav-item ${activeView === 'home' ? 'active' : ''}`}
        >
          <Home size={22} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('info')}
          className={`bottom-nav-item ${activeView === 'info' ? 'active' : ''}`}
        >
          <BookOpen size={22} />
          <span>Library</span>
        </button>

        <button
          onClick={() => setActiveView('stats')}
          className={`bottom-nav-item ${activeView === 'stats' ? 'active' : ''}`}
        >
          <BarChart3 size={22} />
          <span>Stats</span>
        </button>

        <button
          onClick={() => setActiveView('shop')}
          className={`bottom-nav-item ${activeView === 'shop' ? 'active' : ''}`}
        >
          <ShoppingBag size={22} />
          <span>Shop</span>
        </button>

        <button
          onClick={() => setActiveView('safety')}
          className={`bottom-nav-item ${activeView === 'safety' ? 'active' : ''}`}
        >
          <ShieldAlert size={22} />
          <span>Safety</span>
        </button>
      </nav>
    </>
  );
};

export default App;
