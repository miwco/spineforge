import React from 'react';

interface IllustrationProps {
  className?: string;
}

// 1. Hip Hinge Wall Taps
export const HipHingeIllustration: React.FC<IllustrationProps> = ({ className = "illustration-svg" }) => {
  return (
    <svg className={className} viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Floor */}
      <line x1="20" y1="100" x2="180" y2="100" className="floor-line" />
      {/* Wall */}
      <line x1="60" y1="20" x2="60" y2="100" className="floor-line" style={{ strokeDasharray: '3,3' }} />
      <text x="65" y="30" style={{ fontSize: '7px', fill: 'var(--text-muted)', fontWeight: 'bold' }}>WALL</text>
      
      {/* Stick Figure Hinging */}
      {/* Feet */}
      <circle cx="95" cy="100" r="3" fill="var(--text-muted)" />
      {/* Legs */}
      <line x1="95" y1="100" x2="92" y2="75" />
      {/* Spine / Torso - bent forward, glutes touching wall at x=60 */}
      <line x1="92" y1="75" x2="62" y2="70" /> {/* Glute touch point */}
      <line x1="62" y1="70" x2="115" y2="45" /> {/* Back/Spine */}
      {/* Head */}
      <circle cx="123" cy="41" r="6" />
      {/* Arms reaching slightly forward/down */}
      <line x1="105" y1="50" x2="120" y2="75" />
      
      {/* Arrow indicating hip direction */}
      <path d="M 98 62 Q 78 68 64 69" className="highlight-arrow" markerEnd="url(#arrow)" />
      
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--secondary)" />
        </marker>
      </defs>
    </svg>
  );
};

// 2. Bird Dog
export const BirdDogIllustration: React.FC<IllustrationProps> = ({ className = "illustration-svg" }) => {
  return (
    <svg className={className} viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Floor */}
      <line x1="20" y1="100" x2="180" y2="100" className="floor-line" />
      
      {/* Stick Figure */}
      {/* Support Knee */}
      <circle cx="90" cy="100" r="3" fill="var(--text-muted)" />
      <line x1="90" y1="100" x2="90" y2="75" /> {/* Lower Leg */}
      <line x1="90" y1="75" x2="115" y2="75" /> {/* Thigh to hips */}
      
      {/* Support Hand */}
      <circle cx="130" cy="100" r="3" fill="var(--text-muted)" />
      <line x1="130" y1="100" x2="130" y2="75" /> {/* Arm */}
      
      {/* Spine / Torso (Flat Back!) */}
      <line x1="85" y1="75" x2="135" y2="75" style={{ strokeWidth: 4.5 }} />
      {/* Head */}
      <circle cx="145" cy="75" r="6" />
      
      {/* Extended Leg (horizontal) */}
      <line x1="85" y1="75" x2="45" y2="75" />
      {/* Extended Arm (horizontal) */}
      <line x1="130" y1="75" x2="170" y2="75" />
      
      {/* Alignment helper dotted line */}
      <line x1="40" y1="71" x2="175" y2="71" style={{ stroke: 'var(--secondary)', strokeWidth: '1', strokeDasharray: '2,2' }} />
    </svg>
  );
};

// 3. Side Plank
export const SidePlankIllustration: React.FC<IllustrationProps> = ({ className = "illustration-svg" }) => {
  return (
    <svg className={className} viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Floor */}
      <line x1="20" y1="100" x2="180" y2="100" className="floor-line" />
      
      {/* Stick Figure Side Plank */}
      {/* Supporting Forearm on ground */}
      <line x1="115" y1="100" x2="130" y2="100" style={{ stroke: 'var(--text-muted)', strokeWidth: '4' }} />
      <line x1="120" y1="100" x2="120" y2="75" /> {/* Supporting Upper Arm */}
      
      {/* Body Line - straight from feet to head */}
      {/* Feet at (50, 95) */}
      <circle cx="50" cy="95" r="3" fill="var(--text-muted)" />
      {/* Body Line */}
      <line x1="50" y1="95" x2="140" y2="65" style={{ strokeWidth: 4.5 }} />
      
      {/* Head */}
      <circle cx="150" cy="62" r="6" />
      
      {/* Top Arm resting on hip */}
      <line x1="115" y1="73" x2="100" y2="80" />
      
      {/* Glow arrow indicating lifting hips */}
      <path d="M 90 90 Q 95 80 97 73" className="highlight-arrow" markerEnd="url(#arrow)" />
      
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--secondary)" />
        </marker>
      </defs>
    </svg>
  );
};

// 4. Dead Bug
export const DeadBugIllustration: React.FC<IllustrationProps> = ({ className = "illustration-svg" }) => {
  return (
    <svg className={className} viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Floor */}
      <line x1="20" y1="100" x2="180" y2="100" className="floor-line" />
      
      {/* Lie-down Torso (flat on floor) */}
      <line x1="75" y1="92" x2="135" y2="92" style={{ strokeWidth: 4.5 }} />
      {/* Head flat on mat */}
      <circle cx="65" cy="92" r="6" />
      
      {/* Leg 1: Bent at 90 degrees (active support) */}
      <line x1="125" y1="92" x2="125" y2="65" /> {/* Thigh up */}
      <line x1="125" y1="65" x2="145" y2="65" /> {/* Shin forward */}
      
      {/* Arm 1: Straight up (active support) */}
      <line x1="95" y1="92" x2="95" y2="65" />
      
      {/* Leg 2: Extended down close to floor */}
      <line x1="125" y1="92" x2="170" y2="96" />
      
      {/* Arm 2: Extended overhead */}
      <line x1="95" y1="92" x2="40" y2="92" />
      
      {/* Lower Back flat warning line */}
      <line x1="90" y1="96" x2="115" y2="96" style={{ stroke: 'var(--secondary)', strokeWidth: '2' }} />
      <text x="91" y="108" style={{ fontSize: '6px', fill: 'var(--secondary)', fontWeight: 'bold' }}>FLAT BACK</text>
    </svg>
  );
};

// 5. Glute Bridge
export const GluteBridgeIllustration: React.FC<IllustrationProps> = ({ className = "illustration-svg" }) => {
  return (
    <svg className={className} viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      {/* Floor */}
      <line x1="20" y1="100" x2="180" y2="100" className="floor-line" />
      
      {/* Feet flat on floor */}
      <line x1="140" y1="100" x2="150" y2="100" style={{ strokeWidth: '3' }} />
      {/* Shins up */}
      <line x1="145" y1="100" x2="145" y2="70" />
      
      {/* Shoulders on ground */}
      <circle cx="75" cy="94" r="3" fill="var(--text-muted)" />
      <line x1="75" y1="94" x2="65" y2="94" />
      {/* Head on floor */}
      <circle cx="58" cy="94" r="6" />
      
      {/* Bridge line: straight from shoulders (75, 94) to hips (115, 65) to knees (145, 70) */}
      <line x1="75" y1="94" x2="115" y2="70" style={{ strokeWidth: 4.5 }} />
      <line x1="115" y1="70" x2="145" y2="70" style={{ strokeWidth: 4.5 }} />
      
      {/* Arms flat on ground for support */}
      <line x1="75" y1="97" x2="105" y2="97" />
      
      {/* Hips lift indicator arrow */}
      <path d="M 110 88 Q 115 80 115 74" className="highlight-arrow" markerEnd="url(#arrow)" />
      
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--secondary)" />
        </marker>
      </defs>
    </svg>
  );
};

// Mappings for easy access
export const getIllustration = (id: string, className?: string) => {
  switch (id) {
    case 'hip-hinge':
      return <HipHingeIllustration className={className} />;
    case 'bird-dog':
      return <BirdDogIllustration className={className} />;
    case 'side-plank':
      return <SidePlankIllustration className={className} />;
    case 'dead-bug':
      return <DeadBugIllustration className={className} />;
    case 'glute-bridge':
      return <GluteBridgeIllustration className={className} />;
    default:
      return null;
  }
};
