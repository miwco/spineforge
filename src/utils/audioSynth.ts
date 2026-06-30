// Audio Synthesis Utility using Web Audio API for custom sound packs in SpineForge
// No external assets required, works 100% offline.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundPack = '8-bit' | 'zen' | 'synthwave';

// Helper to play a simple synth tone
function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  volumeStart: number,
  fadeOutType: 'linear' | 'exponential' | 'none' = 'linear',
  frequencyEnd?: number
) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    if (frequencyEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(frequencyEnd, ctx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(volumeStart, ctx.currentTime);
    if (fadeOutType === 'linear') {
      gainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration);
    } else if (fadeOutType === 'exponential') {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    }

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio synthesis failed (context may not be initialized yet):', e);
  }
}

// 8-bit sound package
const play8Bit = {
  beep: () => {
    // Short square beep
    playTone(660, 'square', 0.1, 0.05);
  },
  switchSides: () => {
    // High double beep
    playTone(880, 'square', 0.08, 0.05);
    setTimeout(() => playTone(1100, 'square', 0.12, 0.05), 80);
  },
  start: () => {
    // Quick ascending arpeggio
    const freqs = [330, 440, 550, 660];
    freqs.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'square', 0.08, 0.05), i * 80);
    });
  },
  finish: () => {
    // Victory arcade flourish
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'square', 0.15, i === 3 ? 0.1 : 0.05), i * 100);
    });
  }
};

// Zen sounds
const playZen = {
  beep: () => {
    // Soft high chime
    playTone(880, 'sine', 0.4, 0.08, 'exponential');
  },
  switchSides: () => {
    // Two gentle chime notes
    playTone(554.37, 'sine', 0.8, 0.08, 'exponential'); // C#5
    setTimeout(() => playTone(659.25, 'sine', 1.0, 0.08, 'exponential'), 250); // E5
  },
  start: () => {
    // Deep bell chime
    playTone(220, 'sine', 2.0, 0.15, 'exponential');
  },
  finish: () => {
    // Singing bowl bell arpeggio
    const baseFreqs = [220, 277.18, 329.63, 440]; // A3, C#4, E4, A4
    baseFreqs.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 'sine', 2.5, 0.1, 'exponential');
        // add higher harmonic for metallic bell character
        playTone(freq * 3, 'sine', 1.2, 0.02, 'exponential');
      }, i * 300);
    });
  }
};

// Synthwave sounds
const playSynthwave = {
  beep: () => {
    // Retro synth short laser chirp
    playTone(800, 'sawtooth', 0.15, 0.03, 'exponential', 200);
  },
  switchSides: () => {
    // Cyber sweep
    playTone(300, 'sawtooth', 0.25, 0.03, 'linear', 900);
  },
  start: () => {
    // Rising sweep
    playTone(150, 'sawtooth', 0.4, 0.05, 'linear', 600);
  },
  finish: () => {
    // Heavy detuned synthesizer major chord
    const ctx = getAudioContext();
    const freqs = [196.00, 293.66, 392.00, 493.88, 587.33]; // G3, D4, G4, B4, D5
    freqs.forEach((freq) => {
      // play overlapping sawtooth oscillators
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq - 1, ctx.currentTime); // slightly detuned
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq + 1, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.5);
        osc2.stop(ctx.currentTime + 1.5);
      } catch (e) {}
    });
  }
};

export const audioSynth = {
  // Call this on user click to unlock AudioContext on mobile
  init: () => {
    getAudioContext();
  },
  play: (soundPack: SoundPack, soundType: 'beep' | 'switchSides' | 'start' | 'finish') => {
    try {
      const pack = soundPack === 'zen' ? playZen : soundPack === 'synthwave' ? playSynthwave : play8Bit;
      pack[soundType]();
    } catch (err) {
      console.error('Audio synth error:', err);
    }
  }
};
