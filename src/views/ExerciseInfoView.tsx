import React, { useState } from 'react';
import { getExerciseMedia } from '../utils/assets';
import { BookOpen, Video, ChevronDown, ChevronUp, Play } from 'lucide-react';

interface ExerciseDetail {
  id: string;
  name: string;
  desc: string;
  cues: string[];
}

const DEFAULT_EXERCISES: ExerciseDetail[] = [
  {
    id: 'hip-hinge',
    name: 'Hip Hinge Wall Taps',
    desc: 'Teaches you to bend from the hips instead of rounding your spine. Crucial for daily movements like picking up groceries.',
    cues: [
      'Stand about 10-12 inches in front of a wall, facing away.',
      'Soften your knees slightly (do not bend them into a squat).',
      'Push your hips backward until your glutes gently tap the wall.',
      'Keep your back perfectly straight throughout.'
    ]
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    desc: 'Builds cross-body coordination and stabilizes the lower back muscles (erector spinae) without loading the spine.',
    cues: [
      'Start on your hands and knees in a tabletop position.',
      'Extend your left arm straight forward and right leg straight back.',
      'Reach with your fingers and push through your heel.',
      'Keep your hips level and avoid arching your lower back.'
    ]
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    desc: 'Targets the lateral core stabilizers (especially the quadratus lumborum), which are essential for preventing back tweaks.',
    cues: [
      'Lie on your side, supporting your weight on your forearm.',
      'Stack your feet (or bend your knees for an easier version).',
      'Lift your hips until your body forms a straight line from head to heels.',
      'Avoid sagging at the shoulder; push actively away from the floor.'
    ]
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    desc: 'Trains your deep core (transversus abdominis) to keep your spine stable while your arms and legs are moving.',
    cues: [
      'Lie on your back, arms pointing up, knees bent at 90 degrees.',
      'Press your lower back flat into the floor; leave no gap!',
      'Slowly lower your left arm and right leg toward the floor.',
      'Return to start and repeat with opposite arm and leg.'
    ]
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    desc: 'Strengthens the glutes to support the pelvis and reduce unnecessary strain on the lower back.',
    cues: [
      'Lie on your back, knees bent, feet flat on the floor hip-width apart.',
      'Drive through your heels to lift your hips until knees, hips, and shoulders align.',
      'Squeeze your glutes tightly at the top.',
      'Pause briefly, then lower your hips with control.'
    ]
  }
];

const ROUTINE_EXERCISES: Record<string, ExerciseDetail[]> = {
  'routine-decompress': [
    {
      id: 'cat-cow',
      name: 'Cat-Cow Stretch',
      desc: 'Gentle mobilization for the spinal joints.',
      cues: [
        'On hands and knees, arch your back up like a cat while tucking chin.',
        'Inhale, let belly sink down while lifting chest and tailbone.',
        'Move slowly and gently through a pain-free range.'
      ]
    },
    {
      id: 'child-pose',
      name: 'Child’s Pose',
      desc: 'Gently stretches the lower back muscles and provides relaxation.',
      cues: [
        'Kneel on the floor, touch big toes together, sit on your heels.',
        'Extend arms forward and lower your chest to the floor.',
        'Hold and breathe deeply, letting your back widen.'
      ]
    }
  ],
  'routine-glutes': [
    {
      id: 'clamshells',
      name: 'Clamshells',
      desc: 'Strengthens the gluteus medius, improving pelvic stability.',
      cues: [
        'Lie on your side with hips at 45 degrees, knees bent at 90 degrees.',
        'Keep feet together, lift top knee as high as possible without rotating pelvis.',
        'Lower knee and repeat. Keep core engaged.'
      ]
    },
    {
      id: 'bridge-holds',
      name: 'Glute Bridge Hold',
      desc: 'Builds isometric endurance in the glutes and hamstrings.',
      cues: [
        'Lift into a glute bridge.',
        'Hold the top position, keeping hips high and glutes contracted.',
        'Focus on breathing and keep your lower back neutral.'
      ]
    }
  ]
};

export const ExerciseInfoView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'core' | 'variants'>('core');
  
  // Track which exercise card has its video expanded
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);

  const hasUnlockedRoutines = 
    localStorage.getItem('spineforge_state')?.includes('routine-decompress') ||
    localStorage.getItem('spineforge_state')?.includes('routine-glutes');

  const toggleVideo = (id: string) => {
    if (expandedVideoId === id) {
      setExpandedVideoId(null);
    } else {
      setExpandedVideoId(id);
    }
  };

  const renderExerciseCard = (ex: ExerciseDetail) => {
    const media = getExerciseMedia(ex.id);
    const isVideoExpanded = expandedVideoId === ex.id;

    return (
      <div key={ex.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
          <h3 style={{ color: 'var(--text-primary)', letterSpacing: '0.02em', fontSize: '1.15rem' }}>
            {ex.name}
          </h3>
          <button
            onClick={() => toggleVideo(ex.id)}
            className="stat-pill"
            style={{ 
              fontSize: '0.75rem', 
              cursor: 'pointer', 
              background: 'rgba(243, 112, 33, 0.05)', 
              borderColor: isVideoExpanded ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: isVideoExpanded ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Video size={14} />
            <span>{isVideoExpanded ? 'HIDE VIDEO' : 'WATCH DEMO'}</span>
            {isVideoExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Video Player or Photographic Cover */}
        {isVideoExpanded ? (
          <div className="video-player-container fade-in">
            <video 
              src={media.video} 
              controls 
              autoPlay 
              playsInline 
              muted 
              loop
            />
          </div>
        ) : (
          <div className="library-thumbnail fade-in" onClick={() => toggleVideo(ex.id)}>
            <img src={media.image} alt={ex.name} style={{ filter: 'grayscale(20%) brightness(85%)' }} />
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Play size={24} color="var(--primary)" style={{ transform: 'translateX(2px)' }} />
              </div>
            </div>
          </div>
        )}

        <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          {ex.desc}
        </p>

        <div style={{ backgroundColor: '#090a0d', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.02)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: 'var(--primary)', letterSpacing: '0.05em' }}>KEY ALIGNMENT CUES:</h4>
          <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', listStyleType: 'square' }}>
            {ex.cues.map((cue, idx) => (
              <li key={idx} style={{ color: 'var(--text-secondary)', lineHeight: '1.3' }}>{cue}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in scroll-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
        <BookOpen size={22} color="var(--primary)" />
        <h2>EXERCISE LIBRARY</h2>
      </div>

      {hasUnlockedRoutines && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
          <button 
            className={`btn ${activeTab === 'core' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem', flex: 1 }}
            onClick={() => setActiveTab('core')}
          >
            CORE ROUTINE
          </button>
          <button 
            className={`btn ${activeTab === 'variants' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '0.75rem', flex: 1 }}
            onClick={() => setActiveTab('variants')}
          >
            UNLOCKED EXTRAS
          </button>
        </div>
      )}

      {activeTab === 'core' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {DEFAULT_EXERCISES.map((ex) => renderExerciseCard(ex))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(ROUTINE_EXERCISES).map(([routineId, exercises]) => {
            const unlocked = localStorage.getItem('spineforge_state')?.includes(routineId);
            if (!unlocked) return null;

            return (
              <div key={routineId} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--primary)', borderLeft: '2px solid var(--primary)', paddingLeft: '8px' }}>
                  FROM: {routineId === 'routine-decompress' ? 'DECOMPRESS & STRETCH' : 'GLUTE BOOSTER'}
                </h4>
                {exercises.map((ex) => renderExerciseCard(ex))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
