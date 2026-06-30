import React, { useEffect, useState } from 'react';
import { Coins, Flame, ArrowRight, Activity } from 'lucide-react';
import { ForgeLogo } from '../components/ForgeLogo';

interface CompletionViewProps {
  coinsEarned: number;
  newStreak: number;
  exerciseIncremented: string | null;
  onReturnHome: () => void;
}

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
  newStreak,
  exerciseIncremented,
  onReturnHome,
}) => {
  const [quote, setQuote] = useState("");
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

  const getExerciseDisplayName = (key: string | null): string => {
    if (!key) return '';
    const map: Record<string, string> = {
      'hip-hinge': 'Hip Hinge Wall Taps',
      'bird-dog': 'Bird Dog',
      'side-plank': 'Side Plank',
      'dead-bug': 'Dead Bug',
      'glute-bridge': 'Glute Bridge + Hip Mobility',
    };
    return map[key] || key;
  };

  return (
    <div 
      className="workout-fullscreen fade-in" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center', 
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(243, 112, 33, 0.1) 0%, #050508 80%)'
      }}
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

      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', maxWidth: '350px' }}>
        {/* Anvil Spine Logo Header */}
        <div style={{ position: 'relative' }}>
          <ForgeLogo size={140} />
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: '900', letterSpacing: '0.04em', background: 'linear-gradient(135deg, #ffffff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 20px rgba(243,112,33,0.3)' }}>
          WELD COMPLETED
        </h1>

        <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          "{quote}"
        </p>

        {/* Steel Plate Rewards Card */}
        <div className="glass-card" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', padding: '1.5rem', borderLeftColor: 'var(--primary)' }}>
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              <Coins size={16} color="var(--primary)" />
              COINS FORGED:
            </span>
            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
              +{coinsEarned}
            </span>
          </div>

          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              <Flame size={16} color="var(--primary)" />
              STREAK RETAINED:
            </span>
            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
              {newStreak} DAYS
            </span>
          </div>

          {exerciseIncremented && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px', marginTop: '4px', textAlign: 'left' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                <Activity size={12} />
                MICRO-PROGRESSION CALIBRATED
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                <strong>{getExerciseDisplayName(exerciseIncremented)}</strong> extended by <strong>+1 second</strong> for your next session.
              </p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <button className="btn btn-primary" onClick={onReturnHome} style={{ gap: '10px', marginTop: '5px' }}>
          <span>RETURN TO HOME</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
