import React, { useEffect, useState } from 'react';
import { Coins, Flame, ArrowRight, Activity, Plus, Check } from 'lucide-react';
import { ForgeLogo } from '../components/ForgeLogo';
import { EXERCISE_KEYS } from '../hooks/useAppState';
import type { Progression } from '../hooks/useAppState';

interface CompletionViewProps {
  coinsEarned: number;
  progressionBonusCoins: number;
  newStreak: number;
  exerciseIncremented: keyof Progression | null;
  progression: Progression;
  canAllocateProgression: boolean;
  onAllocateProgression: (key: keyof Progression) => { success: boolean; error?: string };
  onReturnHome: () => void;
}

const EXERCISE_NAMES: Record<keyof Progression, string> = {
  'hip-hinge': 'Hip Hinge Wall Taps',
  'bird-dog': 'Bird Dog',
  'side-plank': 'Side Plank',
  'dead-bug': 'Dead Bug',
  'glute-bridge': 'Glute Bridge + Hip Mobility',
};

const FUN_QUOTES = [
  "Spinal stabilization locked. The forge burns bright.",
  "Decompression complete. Core armor integrity increased.",
  "L4 and L5 vertebrae welded in alignment. Good work.",
  "Weld completed. Sciatic pathways stabilized.",
  "Your lumbar spine has been fortified against gravity.",
  "Consistency forms the steel. Your spine salutes the discipline.",
  "Precision movements build invincible structures.",
  "Anvil-grade stabilization achieved. Lock it down."
];

export const CompletionView: React.FC<CompletionViewProps> = ({
  coinsEarned,
  progressionBonusCoins,
  newStreak,
  exerciseIncremented,
  progression,
  canAllocateProgression,
  onAllocateProgression,
  onReturnHome,
}) => {
  const [quote, setQuote] = useState("");
  const [allocationError, setAllocationError] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; size: number; color: string }[]>([]);

  useEffect(() => {
    // Select a disciplined atmospheric quote
    const rand = FUN_QUOTES[Math.floor(Math.random() * FUN_QUOTES.length)];
    setQuote(rand);

    // Generate floating glowing orange sparks (forge theme)
    const colors = ['#f37021', '#ffaa44', '#ff3c00', '#ffffff', '#ffea00'];
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5, // 5% to 95%
      delay: Math.random() * 2,
      size: Math.random() * 4 + 2, // 2px to 6px sparks
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(generated);
  }, []);

  const handleAllocation = (key: keyof Progression) => {
    setAllocationError(null);
    const result = onAllocateProgression(key);
    if (!result.success) {
      setAllocationError(result.error || 'Could not allocate this progression second.');
    }
  };

  return (
    <div 
      className="completion-fullscreen fullscreen-fade-in"
    >
      {/* Floating Orange Forge Sparks */}
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            animation: `float-up 2.5s linear infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      ))}

      {/* Sparks float-up animation */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(0.2); opacity: 0; }
        }
      `}</style>

      <div className="completion-content">
        {/* Anvil Spine Logo Header */}
        <div className="completion-logo">
          <ForgeLogo size={108} />
        </div>

        <h1 className="completion-title">
          WELD COMPLETED
        </h1>

        <p className="completion-quote">
          "{quote}"
        </p>

        {/* Steel Plate Rewards Card */}
        <div className="glass-card completion-card">
          <div className="completion-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              <Coins size={16} color="var(--primary)" />
              COINS FORGED:
            </span>
            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
              +{coinsEarned}
            </span>
          </div>

          {progressionBonusCoins > 0 && (
            <p className="completion-coin-bonus">
              +{progressionBonusCoins} from the extra seconds you completed today
            </p>
          )}

          <div className="completion-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              <Flame size={16} color="var(--primary)" />
              STREAK RETAINED:
            </span>
            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
              {newStreak} DAYS
            </span>
          </div>

        </div>

        {canAllocateProgression && (
          <section className="progression-allocation" aria-labelledby="progression-heading">
            <div className="progression-allocation-heading">
              <Activity size={18} />
              <div>
                <h2 id="progression-heading">Choose Your +1 Second</h2>
                <p>Add it to your next workout. Complete that extra second to earn one extra coin.</p>
              </div>
            </div>

            <div className="progression-options">
              {EXERCISE_KEYS.map((key) => {
                const isAtCap = progression[key] >= 30;
                return (
                  <button
                    key={key}
                    type="button"
                    className="progression-option"
                    onClick={() => handleAllocation(key)}
                    disabled={isAtCap}
                    aria-label={`Add one second to ${EXERCISE_NAMES[key]}`}
                  >
                    <span>
                      <strong>{EXERCISE_NAMES[key]}</strong>
                      <small>{isAtCap ? 'MAX +30S' : `CURRENT +${progression[key]}S`}</small>
                    </span>
                    <Plus size={20} aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            {allocationError && <p className="progression-error" role="alert">{allocationError}</p>}
          </section>
        )}

        {exerciseIncremented && (
          <div className="progression-confirmed" role="status">
            <Check size={18} />
            <p><strong>{EXERCISE_NAMES[exerciseIncremented]}</strong> gets +1 second next workout.</p>
          </div>
        )}

        {/* Back Button */}
        {!canAllocateProgression && (
          <button className="btn btn-primary" onClick={onReturnHome} style={{ gap: '10px', marginTop: '5px' }}>
            <span>RETURN TO HOME</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
