import React from 'react';

interface ForgeLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const ForgeLogo: React.FC<ForgeLogoProps> = ({
  size = 120,
  className = '',
  glow = true
}) => {
  return (
    <img
      src="/brand/spineforge-logo.jpeg"
      alt="SpineForge"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: '18px',
        border: '1px solid rgba(243, 112, 33, 0.28)',
        boxShadow: glow
          ? '0 0 24px rgba(243, 112, 33, 0.28), 0 18px 45px rgba(0, 0, 0, 0.55)'
          : 'none',
        display: 'block'
      }}
    />
  );
};
