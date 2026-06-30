import React from 'react';

interface ForgeLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const ForgeLogo: React.FC<ForgeLogoProps> = ({
  size = 120,
  className = "",
  glow = true
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: glow ? 'drop-shadow(0 0 12px rgba(243, 112, 33, 0.6))' : 'none',
        display: 'block'
      }}
    >
      <defs>
        {/* Steel metallic gradient for Anvil */}
        <linearGradient id="steel-grad" x1="20" y1="120" x2="180" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f5b66" />
          <stop offset="35%" stopColor="#2c3e50" />
          <stop offset="70%" stopColor="#1a252f" />
          <stop offset="100%" stopColor="#0d1318" />
        </linearGradient>

        {/* Highlight metal gradient for anvil top */}
        <linearGradient id="steel-highlight" x1="40" y1="120" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7f8c8d" />
          <stop offset="50%" stopColor="#bdc3c7" />
          <stop offset="100%" stopColor="#34495e" />
        </linearGradient>

        {/* Molten Orange Fire gradient for Spine */}
        <linearGradient id="molten-grad" x1="100" y1="140" x2="100" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff2a00" />
          <stop offset="30%" stopColor="#ff6a00" />
          <stop offset="70%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ffffdd" />
        </linearGradient>

        {/* Soft yellow fire/energy glow */}
        <radialGradient id="fire-glow" cx="100" cy="80" r="60" fx="100" fy="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255, 120, 0, 0.4)" />
          <stop offset="50%" stopColor="rgba(255, 50, 0, 0.15)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
        </radialGradient>
      </defs>

      {/* Volumetric ambient background energy aura */}
      <circle cx="100" cy="85" r="70" fill="url(#fire-glow)" />

      {/* Background fire flames licking up from anvil */}
      <path 
        d="M 65 130 C 50 100 80 60 75 40 C 85 60 92 80 100 70 C 108 80 115 60 125 40 C 120 60 150 100 135 130 Z" 
        fill="#ff3c00" 
        opacity="0.3" 
      />
      <path 
        d="M 80 130 C 70 105 85 80 90 60 C 95 80 105 80 110 60 C 115 80 130 105 120 130 Z" 
        fill="#ff8c00" 
        opacity="0.5" 
      />

      {/* ANVIL BASE SHAPE (Massive steel foundation) */}
      {/* Anvil Horn (left tip at 30,120) and Tail (right flat block at 170,120) */}
      <path 
        d="M 30 120 C 50 120 70 115 85 110 L 115 110 C 130 115 150 120 170 120 L 170 135 C 160 135 150 135 140 145 C 135 150 135 160 145 170 L 155 170 L 155 180 L 45 180 L 45 170 L 55 170 C 65 160 65 150 60 145 C 50 135 40 135 30 135 Z" 
        fill="url(#steel-grad)" 
        stroke="#161f27"
        strokeWidth="2.5"
      />
      
      {/* Anvil top face highlight plate */}
      <path 
        d="M 40 120 L 160 120 L 160 125 L 40 125 Z" 
        fill="url(#steel-highlight)" 
        opacity="0.9"
      />

      {/* Anvil center seam depression shadow */}
      <path 
        d="M 80 135 Q 100 142 120 135 Q 100 152 80 135 Z" 
        fill="#0a0f14" 
      />

      {/* MOLTEN SPINE (Rising from the center of the anvil) */}
      {/* 9 stackable glowing vertebrae segments starting at y=130 and climbing to y=25 */}
      {/* L5 segment (base, widest) */}
      <path d="M 82 122 C 82 116 118 116 118 122 L 112 129 C 100 131 100 131 88 129 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="120" r="3" fill="#ffea00" />
      
      {/* L4 segment */}
      <path d="M 84 111 C 84 106 116 106 116 111 L 110 117 C 100 119 100 119 90 117 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="109" r="3" fill="#ffea00" />

      {/* L3 segment */}
      <path d="M 86 100 C 86 95 114 95 114 100 L 108 106 C 100 108 100 108 92 106 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="98" r="2.5" fill="#ffea00" />

      {/* L2 segment */}
      <path d="M 87 89 C 87 84 113 84 113 89 L 107 95 Q 100 97 93 95 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="87" r="2.5" fill="#ffea00" />

      {/* L1 segment */}
      <path d="M 88 78 C 88 74 112 74 112 78 L 106 84 Q 100 86 94 84 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="76" r="2" fill="#ffea00" />

      {/* T12 segment */}
      <path d="M 89 68 C 89 64 111 64 111 68 L 105 73 Q 100 75 95 73 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="66" r="2" fill="#ffea00" />

      {/* T11 segment */}
      <path d="M 90 58 C 90 54 110 54 110 58 L 104 63 Q 100 65 96 63 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="56" r="1.5" fill="#ffea00" />

      {/* T10 segment */}
      <path d="M 91 48 C 91 44 109 44 109 48 L 103 53 Q 100 55 97 53 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="46" r="1.5" fill="#ffea00" />

      {/* T9 segment (top vertebrae) */}
      <path d="M 92 38 C 92 34 108 34 108 38 L 102 43 Q 100 45 98 43 Z" fill="url(#molten-grad)" stroke="#2b0800" strokeWidth="1" />
      <circle cx="100" cy="36" r="1" fill="#ffea00" />

      {/* Rib-like lateral wings branching from thoracic vertebrae to frame the composition */}
      <path d="M 88 78 Q 70 70 65 55 Q 75 68 88 74" fill="url(#molten-grad)" opacity="0.8" />
      <path d="M 112 78 Q 130 70 135 55 Q 125 68 112 74" fill="url(#molten-grad)" opacity="0.8" />
      
      <path d="M 89 68 Q 72 60 68 45 Q 77 58 89 64" fill="url(#molten-grad)" opacity="0.8" />
      <path d="M 111 68 Q 128 60 132 45 Q 123 58 111 64" fill="url(#molten-grad)" opacity="0.8" />

      <path d="M 90 58 Q 74 52 70 38 Q 78 50 90 55" fill="url(#molten-grad)" opacity="0.8" />
      <path d="M 110 58 Q 126 52 130 38 Q 122 50 110 55" fill="url(#molten-grad)" opacity="0.8" />

      {/* Sparks flying off anvil */}
      <circle cx="45" cy="90" r="1.5" fill="#ffa200" />
      <circle cx="155" cy="85" r="1" fill="#ffea00" />
      <circle cx="138" cy="110" r="1.5" fill="#ffa200" />
      <circle cx="62" cy="105" r="1" fill="#ffa200" />
    </svg>
  );
};
