import React, { useState } from 'react';
import { Flame, Coins, Play, AlertTriangle, Shield } from 'lucide-react';
import { getLocalDateString } from '../hooks/useAppState';
import type { AppState } from '../hooks/useAppState';

interface HomeViewProps {
  state: AppState;
  onStartWorkout: () => void;
  repairStreak: () => { success: boolean; error?: string };
  checkStreakRepairAvailable: () => { available: boolean; reason?: string; cost: number };
  buyStreakSaver: () => { success: boolean; error?: string };
}

export const HomeView: React.FC<HomeViewProps> = ({
  state,
  onStartWorkout,
  repairStreak,
  checkStreakRepairAvailable,
  buyStreakSaver,
}) => {
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const todayStr = getLocalDateString();
  const isCompletedToday = state.completedDates.includes(todayStr);

  const repairCheck = checkStreakRepairAvailable();

  const handleRepair = () => {
    setActionError(null);
    const res = repairStreak();
    if (res.success) {
      setActionSuccess('STREAK WELDED SUCCESSFULLY!');
    } else {
      setActionError(res.error || 'Failed to repair.');
    }
  };

  const handleStreakSaver = () => {
    setActionError(null);
    const res = buyStreakSaver();
    if (res.success) {
      setActionSuccess('STREAK SAVER APPLIED. REST DAY SECURED.');
    } else {
      setActionError(res.error || 'Failed to buy Streak Saver.');
    }
  };

  const baseSeconds = 300;
  const addedSeconds = Object.values(state.progression).reduce((a, b) => a + b, 0);
  const totalSeconds = baseSeconds + addedSeconds;
  
  const formatWorkoutTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return remainder > 0 ? `${mins}M ${remainder}S` : `${mins} MIN`;
  };

  return (
    <div className="fade-in scroll-container">
      {/* Cinematic Logo Header */}
      <div className="brand-hero">
        <img
          className="brand-hero-image"
          src="/brand/spineforge-logo.jpeg"
          alt="SpineForge"
        />
        <div className="brand-title-row">
          <span className="title-pill equipped brand-user-title">
            {state.activeTitle}
          </span>
        </div>
      </div>

      {/* Streak and Forged Coins Plate */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderLeftColor: 'var(--primary)' }}>
          <Flame size={26} color="var(--primary)" fill="var(--primary)" style={{ filter: 'drop-shadow(0 0 4px var(--primary-glow))' }} />
          <div>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{state.streakCurrent} DAYS</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FORGE STREAK</span>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderLeftColor: 'var(--primary)' }}>
          <Coins size={26} color="var(--primary)" fill="var(--primary)" style={{ filter: 'drop-shadow(0 0 4px var(--primary-glow))' }} />
          <div>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{state.coins}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FORGED COINS</span>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="glass-card highlight" style={{ borderColor: '#c0392b', borderLeftColor: '#c0392b', color: '#ff2a00', padding: '12px 18px', fontWeight: '700', fontSize: '0.85rem' }}>
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="glass-card highlight" style={{ borderColor: 'var(--primary)', borderLeftColor: 'var(--primary)', color: 'var(--primary)', padding: '12px 18px', fontWeight: '700', fontSize: '0.9rem' }}>
          {actionSuccess}
        </div>
      )}

      {/* Streak Danger Warning Plate */}
      {repairCheck.available && !actionSuccess?.includes('WELDED') && (
        <div className="glass-card highlight" style={{ borderColor: '#c0392b', borderLeftColor: '#c0392b', display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px', boxShadow: '0 0 15px rgba(192, 57, 43, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2a00' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.02em' }}>STREAK IN DANGER</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your core routine was missed yesterday. Reforge yesterday to weld your streak back together.
          </p>
          <button 
            onClick={handleRepair} 
            className="btn btn-secondary" 
            style={{ 
              borderColor: 'rgba(255, 42, 0, 0.4)', 
              color: '#ff2a00', 
              padding: '8px 16px', 
              fontSize: '0.8rem', 
              alignSelf: 'flex-start', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              width: 'auto',
              backgroundColor: 'rgba(255, 42, 0, 0.03)'
            }}
          >
            <Coins size={14} />
            REBUILD STREAK ({repairCheck.cost} COINS)
          </button>
        </div>
      )}

      {/* Streak Saver (Weekend Break) */}
      {!isCompletedToday && !repairCheck.available && state.streakCurrent > 0 && (
        <div className="glass-card highlight" style={{ borderColor: 'var(--secondary)', borderLeftColor: 'var(--secondary)', display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
            <Shield size={20} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.02em', color: 'var(--text-primary)' }}>REST DAY SHIELD</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Need a break today? Purchase a Streak Saver to skip today without losing your hard-earned progress.
          </p>
          <button 
            onClick={handleStreakSaver} 
            className="btn btn-secondary" 
            style={{ 
              borderColor: 'var(--secondary)', 
              color: 'var(--text-primary)', 
              padding: '8px 16px', 
              fontSize: '0.8rem', 
              alignSelf: 'flex-start', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              width: 'auto',
              backgroundColor: 'rgba(52, 73, 94, 0.1)'
            }}
          >
            <Coins size={14} />
            BUY STREAK SAVER (200 COINS)
          </button>
        </div>
      )}

      {/* Main Routine Start Plate */}
      <div className="glass-card highlight" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.25rem 1.5rem', textAlign: 'center', gap: '18px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '0.02em', color: isCompletedToday ? 'var(--text-primary)' : 'var(--primary)' }}>
          {isCompletedToday ? "SPINE FORGED TODAY" : "READY FOR TODAY'S FORGE"}
        </h2>
        
        <p style={{ maxWidth: '320px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          {isCompletedToday 
            ? "Your spinal stabilizers are locked down. Return tomorrow to continue your micro-progression."
            : "Lock your core, align your pelvis, and invest 5 minutes in spine integrity."
          }
        </p>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#08090d', padding: '8px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SESSION LENGTH:</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{formatWorkoutTime(totalSeconds)}</span>
        </div>

        <button 
          onClick={onStartWorkout} 
          className="btn btn-primary"
          style={{ width: '100%', gap: '10px', fontSize: '1.15rem', padding: '1.1rem' }}
        >
          <Play size={20} fill="#ffffff" stroke="none" />
          <span>{isCompletedToday ? "RE-ACTIVATE WORKOUT" : "BEGIN SPINE FORGE"}</span>
        </button>
      </div>

    </div>
  );
};
