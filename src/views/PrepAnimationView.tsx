import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SkipForward, Volume2, VolumeX, X } from 'lucide-react';

interface PrepAnimationViewProps {
  onComplete: () => void;
  onExit: () => void;
}

const PREP_ANIMATION_SRC = '/prep-animation/prep-animation-2.mp4';
const PREP_FALLBACK_MS = 10500;

export const PrepAnimationView: React.FC<PrepAnimationViewProps> = ({
  onComplete,
  onExit,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasCompleted = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  const completeIntro = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const fallback = window.setTimeout(completeIntro, PREP_FALLBACK_MS);
    const video = videoRef.current;

    if (video) {
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => undefined);
      });
    }

    return () => window.clearTimeout(fallback);
  }, [completeIntro]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="prep-fullscreen fade-in">
      <video
        ref={videoRef}
        className="prep-video"
        src={PREP_ANIMATION_SRC}
        playsInline
        autoPlay
        preload="auto"
        onEnded={completeIntro}
      />

      <div className="prep-scrim" />

      <div className="prep-topbar">
        <button
          className="prep-icon-button"
          onClick={() => setIsMuted((value) => !value)}
          aria-label={isMuted ? 'Turn prep animation sound on' : 'Mute prep animation'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button className="prep-icon-button danger" onClick={onExit} aria-label="Exit workout intro">
          <X size={20} />
        </button>
      </div>

      <div className="prep-content">
        <p className="prep-kicker">SPINEFORGE IGNITION</p>
        <h1>THE FORGE IS HOT</h1>
        <p>Brace, breathe, and step into position.</p>
      </div>

      <button className="btn btn-primary prep-skip-button" onClick={completeIntro}>
        <SkipForward size={18} />
        Start Now
      </button>
    </div>
  );
};
