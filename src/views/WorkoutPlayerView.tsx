import React, { useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX, X, HelpCircle } from 'lucide-react';
import type { WorkoutStep } from '../hooks/useWorkoutTimer';
import { getExerciseMedia } from '../utils/assets';

interface WorkoutPlayerViewProps {
  currentStep: WorkoutStep | null;
  nextStep: WorkoutStep | null;
  secondsRemaining: number;
  progressPercent: number;
  isActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  skipStep: () => void;
  resetTimer: () => void;
  totalDurationRemaining: number;
  onExit: () => void;
}

export const WorkoutPlayerView: React.FC<WorkoutPlayerViewProps> = ({
  currentStep,
  nextStep,
  secondsRemaining,
  progressPercent,
  isActive,
  startTimer,
  pauseTimer,
  skipStep,
  resetTimer,
  totalDurationRemaining,
  onExit,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  if (!currentStep) return null;

  const formatRemainingTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const strokeDashoffset = 2 * Math.PI * 120 * (1 - progressPercent / 100);

  // Get active media assets (static JPEG image)
  const activeMedia = getExerciseMedia(currentStep.exerciseId);
  const nextMedia = nextStep ? getExerciseMedia(nextStep.exerciseId) : null;

  return (
    <div 
      className="workout-fullscreen fade-in"
      style={{
        background: `radial-gradient(circle at 50% -20%, rgba(243, 112, 33, ${currentStep.type === 'rest' ? '0.07' : '0.15'}) 0%, #050508 70%)`,
        transition: 'background 0.5s ease'
      }}
    >
      {/* Header Info */}
      <div className="workout-header">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
          REMAINING: {formatRemainingTime(totalDurationRemaining)}
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="stat-pill" 
            style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button 
            onClick={() => setShowExitModal(true)} 
            className="stat-pill"
            style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Molten Progress Ring */}
      <div className="timer-circle-container">
        <svg className="timer-svg" viewBox="0 0 260 260">
          <defs>
            <linearGradient id="timer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff1100" />
              <stop offset="60%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#ffb300" />
            </linearGradient>
          </defs>
          <circle className="timer-circle-bg" cx="130" cy="130" r="120" />
          <circle 
            className="timer-circle-fg" 
            cx="130" 
            cy="130" 
            r="120"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        
        <div className="timer-text-container">
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {currentStep.type === 'get-ready' ? 'GET READY' : currentStep.type === 'rest' ? 'REST' : 'ENGAGED'}
          </span>
          <span className="timer-number">{secondsRemaining}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>seconds</span>
        </div>
      </div>

      {/* Active Exercise Photographic Display */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', justifyContent: 'center', zIndex: 10 }}>
        <h2 className="timer-exercise-name" style={{ color: currentStep.type === 'rest' ? '#ffa200' : 'var(--text-primary)', letterSpacing: '0.02em' }}>
          {currentStep.type === 'rest' && nextStep ? `UP NEXT: ${nextStep.name}` : currentStep.name}
        </h2>
        
        {/* Cinematic Photographic Image Frame */}
        <div className={`exercise-image-frame ${currentStep.type === 'work' ? 'active' : ''}`}>
          {currentStep.exerciseId ? (
            <img src={activeMedia.image} alt={currentStep.name} />
          ) : nextStep?.exerciseId && nextMedia ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={nextMedia.image} alt={nextStep.name} />
              <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(243, 112, 33, 0.9)', padding: '2px 6px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: '#000', fontWeight: '900', textTransform: 'uppercase' }}>PREVIEW</span>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <HelpCircle size={40} />
            </div>
          )}
        </div>

        <p className="timer-exercise-cues">
          {currentStep.cue}
        </p>
      </div>

      {/* Heavy Controls Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', margin: '20px 0', zIndex: 10 }}>
        <button 
          onClick={resetTimer} 
          className="btn btn-secondary" 
          style={{ width: '52px', height: '52px', borderRadius: '50%', padding: 0, border: '1px solid rgba(255,255,255,0.03)' }}
          title="Restart Workout"
        >
          <RotateCcw size={18} />
        </button>

        {isActive ? (
          <button 
            onClick={pauseTimer} 
            className="btn btn-primary" 
            style={{ width: '70px', height: '70px', borderRadius: '50%', padding: 0, background: 'var(--accent)', boxShadow: '0 0 15px rgba(211, 84, 0, 0.4)' }}
            title="Pause"
          >
            <Pause size={26} />
          </button>
        ) : (
          <button 
            onClick={startTimer} 
            className="btn btn-primary" 
            style={{ width: '70px', height: '70px', borderRadius: '50%', padding: 0, background: 'linear-gradient(135deg, var(--accent), var(--primary))', boxShadow: '0 0 20px rgba(243, 112, 33, 0.4)' }}
            title="Start"
          >
            <Play size={26} style={{ transform: 'translateX(2px)' }} />
          </button>
        )}

        <button 
          onClick={skipStep} 
          className="btn btn-secondary" 
          style={{ width: '52px', height: '52px', borderRadius: '50%', padding: 0, border: '1px solid rgba(255,255,255,0.03)' }}
          title="Skip Step"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Next Up Status Overlay */}
      {nextStep && (
        <div className="timer-next-bar">
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NEXT UP:</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>{nextStep.name}</span>
        </div>
      )}

      {/* Exit confirmation modal */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}>ABANDON FORGE?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Your spinal activation record for today will be lost and your streak may break.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => setShowExitModal(false)} 
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                RESUME
              </button>
              <button 
                onClick={() => {
                  setShowExitModal(false);
                  onExit();
                }} 
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                ABANDON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
