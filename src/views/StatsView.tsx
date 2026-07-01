import React from 'react';
import { Calendar, Flame, Trophy, Clock } from 'lucide-react';
import { getLocalDateString, EXERCISE_KEYS } from '../hooks/useAppState';
import type { AppState } from '../hooks/useAppState';

interface StatsViewProps {
  state: AppState;
}

const EXERCISE_NAMES: Record<string, string> = {
  'hip-hinge': 'Hip Hinge Wall Taps',
  'bird-dog': 'Bird Dog',
  'side-plank': 'Side Plank',
  'dead-bug': 'Dead Bug',
  'glute-bridge': 'Glute Bridge',
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const StatsView: React.FC<StatsViewProps> = ({ state }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const numDays = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0
  
  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= numDays; d++) {
    calendarCells.push(new Date(year, month, d));
  }

  const monthName = now.toLocaleString('default', { month: 'long' }).toUpperCase();
  const todayStr = getLocalDateString(now);

  const totalWorkouts = state.completedDates.length;

  const baseWorkoutSeconds = 300;
  const addedSeconds = Object.values(state.progression).reduce((a, b) => a + b, 0);
  const totalWorkoutTime = baseWorkoutSeconds + addedSeconds;
  
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}M ${secs}S`;
  };

  return (
    <div className="fade-in scroll-container">
      <h2>PROGRESS LOG</h2>

      {/* Streak Dashboard Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderLeftColor: 'var(--primary)' }}>
          <Flame size={28} color="var(--primary)" fill="var(--primary)" style={{ marginBottom: '6px', filter: 'drop-shadow(0 0 6px var(--primary-glow))' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{state.streakCurrent}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CURRENT STREAK</span>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderLeftColor: 'var(--primary)' }}>
          <Trophy size={28} color="var(--primary)" fill="var(--primary)" style={{ marginBottom: '6px', filter: 'drop-shadow(0 0 6px var(--primary-glow))' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{state.streakLongest}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LONGEST RECORD</span>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', textAlign: 'center', padding: '14px', borderLeftColor: 'var(--secondary)' }}>
        <div>
          <span style={{ display: 'block', fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{totalWorkouts}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL WELDS</span>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.03)', height: '24px' }}></div>
        <div>
          <span style={{ display: 'block', fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{formatTime(totalWorkoutTime)}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DAILY TARGET</span>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.03)', height: '24px' }}></div>
        <div>
          <span style={{ display: 'block', fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>{state.activeTitle.toUpperCase()}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FORGE RANK</span>
        </div>
      </div>

      {/* Steel Block Calendar Plate */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Calendar size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{monthName} {year}</h3>
        </div>
        
        <div className="calendar-grid">
          {/* Day Headers */}
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
            <div key={d} className="calendar-day-header">{d}</div>
          ))}
          
          {/* Calendar Cells */}
          {calendarCells.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="calendar-day-cell" style={{ opacity: 0 }} />;
            }
            
            const cellStr = getLocalDateString(date);
            const isCompleted = state.completedDates.includes(cellStr);
            const isToday = cellStr === todayStr;
            
            return (
              <div 
                key={cellStr} 
                className={`calendar-day-cell ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                title={cellStr}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Molten Progression Levels */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Clock size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>TEMPORAL PROGRESSION</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {EXERCISE_KEYS.map((key) => {
            const added = state.progression[key] || 0;
            const base = 60;
            const total = base + added;
            const progressPercent = (added / 30) * 100;
            
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{EXERCISE_NAMES[key]}</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                    {total}S <span style={{ color: added > 0 ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.75rem' }}>({added > 0 ? `+${added}S` : 'BASE'})</span>
                  </span>
                </div>
                {/* Molten Progress Bar */}
                <div style={{ height: '6px', width: '100%', backgroundColor: '#07080a', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${progressPercent}%`, 
                      background: 'linear-gradient(90deg, #ff2a00, var(--primary))',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: '0 0 8px rgba(243,112,33,0.5)',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
