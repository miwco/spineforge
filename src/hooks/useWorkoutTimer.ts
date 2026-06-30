import { useState, useEffect, useRef } from 'react';
import type { Progression } from './useAppState';
import { audioSynth } from '../utils/audioSynth';
import type { SoundPack } from '../utils/audioSynth';

export interface WorkoutStep {
  type: 'get-ready' | 'work' | 'rest';
  name: string;
  duration: number;
  cue: string;
  exerciseId?: string;
  nextName?: string;
}

// Cat-Cow / Child's pose etc. for decompress routine
const DECOMPRESS_STEPS: Omit<WorkoutStep, 'duration'>[] = [
  { type: 'work', name: 'Cat-Cow Stretch', cue: 'Arch your back up like a cat, then let your belly sink down', exerciseId: 'cat-cow' },
  { type: 'work', name: 'Child’s Pose Stretch', cue: 'Sit back on your heels, extend arms forward, and lower your chest', exerciseId: 'child-pose' },
  { type: 'work', name: 'Supine Twist (Left)', cue: 'Lie on your back, drop knees to left side, keep shoulders flat', exerciseId: 'supine-twist' },
  { type: 'work', name: 'Supine Twist (Right)', cue: 'Drop knees to the right side, maintain flat opposite shoulder', exerciseId: 'supine-twist' },
  { type: 'work', name: 'Double Knee to Chest', cue: 'Pull both knees gently to your chest, hugging them with arms', exerciseId: 'knees-to-chest' }
];

// Clamshells / Bridge holds etc. for glutes routine
const GLUTES_STEPS: Omit<WorkoutStep, 'duration'>[] = [
  { type: 'work', name: 'Clamshells (Left Side)', cue: 'Lie on side, keep feet together, open and close top knee', exerciseId: 'clamshells' },
  { type: 'work', name: 'Clamshells (Right Side)', cue: 'Roll over, keep feet together, open and close top knee', exerciseId: 'clamshells' },
  { type: 'work', name: 'Glute Bridge Isometric Hold', cue: 'Lift hips and hold the top bridge position, squeeze glutes', exerciseId: 'bridge-holds' },
  { type: 'work', name: 'Donkey Kicks (Left Side)', cue: 'On hands/knees, kick left heel up toward the ceiling', exerciseId: 'donkey-kicks' },
  { type: 'work', name: 'Donkey Kicks (Right Side)', cue: 'Kick right heel up, keep lower back flat, squeeze glute', exerciseId: 'donkey-kicks' }
];

const buildWorkoutQueue = (progression: Progression): WorkoutStep[] => {
  const transitionTime = 10;
  const queue: WorkoutStep[] = [];
  
  const activeRoutine = localStorage.getItem('spineforge_active_routine') || 'default';
  
  // 0. Get Ready
  queue.push({
    type: 'get-ready',
    name: 'Get Ready',
    duration: 8,
    cue: 'Get onto your mat or feet',
    nextName: activeRoutine === 'routine-decompress' ? 'Cat-Cow Stretch' : activeRoutine === 'routine-glutes' ? 'Clamshells' : 'Hip Hinge Wall Taps'
  });

  if (activeRoutine === 'routine-decompress') {
    DECOMPRESS_STEPS.forEach((step, i) => {
      queue.push({
        ...step,
        duration: 50, // standard 50s for alternative stretch steps
        nextName: i === DECOMPRESS_STEPS.length - 1 ? 'Finished!' : 'Rest'
      } as WorkoutStep);
      
      if (i < DECOMPRESS_STEPS.length - 1) {
        queue.push({
          type: 'rest',
          name: 'Transition Rest',
          duration: transitionTime,
          cue: `Get ready for ${DECOMPRESS_STEPS[i+1].name}`,
          nextName: DECOMPRESS_STEPS[i+1].name
        });
      }
    });
  } else if (activeRoutine === 'routine-glutes') {
    GLUTES_STEPS.forEach((step, i) => {
      queue.push({
        ...step,
        duration: 50, // standard 50s for alternative glute steps
        nextName: i === GLUTES_STEPS.length - 1 ? 'Finished!' : 'Rest'
      } as WorkoutStep);
      
      if (i < GLUTES_STEPS.length - 1) {
        queue.push({
          type: 'rest',
          name: 'Transition Rest',
          duration: transitionTime,
          cue: `Get ready for ${GLUTES_STEPS[i+1].name}`,
          nextName: GLUTES_STEPS[i+1].name
        });
      }
    });
  } else {
    // 1. Hip hinge wall taps
    queue.push({
      type: 'work',
      name: 'Hip Hinge Wall Taps',
      duration: 60 + (progression['hip-hinge'] || 0),
      cue: 'Stand 1 foot from wall, hinge hips back until glutes tap wall',
      exerciseId: 'hip-hinge',
      nextName: 'Rest'
    });
    
    // Rest
    queue.push({
      type: 'rest',
      name: 'Transition Rest',
      duration: transitionTime,
      cue: 'Get ready for Bird Dog on your hands and knees',
      nextName: 'Bird Dog'
    });
    
    // 2. Bird dog
    queue.push({
      type: 'work',
      name: 'Bird Dog',
      duration: 60 + (progression['bird-dog'] || 0),
      cue: 'Keep neck long, extend opposite arm and leg, maintain flat back',
      exerciseId: 'bird-dog',
      nextName: 'Rest'
    });
    
    // Rest
    queue.push({
      type: 'rest',
      name: 'Transition Rest',
      duration: transitionTime,
      cue: 'Get ready for Side Plank on your Left forearm',
      nextName: 'Side Plank (Left)'
    });
    
    // 3. Side plank Left
    const sidePlankBonus = progression['side-plank'] || 0;
    const sidePlankL = 30 + Math.floor(sidePlankBonus / 2);
    const sidePlankR = 30 + Math.ceil(sidePlankBonus / 2);
    
    queue.push({
      type: 'work',
      name: 'Side Plank (Left Side)',
      duration: sidePlankL,
      cue: 'Elbow under shoulder, lift hips, keep body in a straight line',
      exerciseId: 'side-plank',
      nextName: 'Switch Side: Side Plank (Right)'
    });
    
    // 3b. Side plank Right
    queue.push({
      type: 'work',
      name: 'Side Plank (Right Side)',
      duration: sidePlankR,
      cue: 'Roll to your right side, elbow under shoulder, lift hips',
      exerciseId: 'side-plank',
      nextName: 'Rest'
    });
    
    // Rest
    queue.push({
      type: 'rest',
      name: 'Transition Rest',
      duration: transitionTime,
      cue: 'Lie on your back, get ready for Dead Bug',
      nextName: 'Dead Bug'
    });
    
    // 4. Dead bug
    queue.push({
      type: 'work',
      name: 'Dead Bug',
      duration: 60 + (progression['dead-bug'] || 0),
      cue: 'Press lower back flat into floor, lower opposite arm and leg',
      exerciseId: 'dead-bug',
      nextName: 'Rest'
    });
    
    // Rest
    queue.push({
      type: 'rest',
      name: 'Transition Rest',
      duration: transitionTime,
      cue: 'Keep lying on back, bend knees for Glute Bridge',
      nextName: 'Glute Bridge + Hip Mobility'
    });
    
    // 5. Glute bridge + hip mobility
    queue.push({
      type: 'work',
      name: 'Glute Bridge + Hip Mobility',
      duration: 60 + (progression['glute-bridge'] || 0),
      cue: 'Drive feet down, lift hips, engage glutes, rotate knees gently',
      exerciseId: 'glute-bridge',
      nextName: 'Finished!'
    });
  }
  
  return queue;
};

const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
};

export const useWorkoutTimer = (
  progression: Progression,
  soundPack: SoundPack,
  onComplete: () => void,
  activeView: string // Hook activeView to recreate queue when starting workout
) => {
  const queue = useRef<WorkoutStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Initialize/rebuild steps queue when workout begins
  useEffect(() => {
    queue.current = buildWorkoutQueue(progression);
    setCurrentStepIndex(0);
    setSecondsRemaining(queue.current[0]?.duration || 1);
    setIsActive(false);
  }, [progression, activeView]);

  const currentStep = queue.current[currentStepIndex] || null;
  const nextStep = queue.current[currentStepIndex + 1] || null;

  const totalDuration = currentStep ? currentStep.duration : 1;
  const progressPercent = currentStep
    ? ((totalDuration - secondsRemaining) / totalDuration) * 100
    : 0;

  const totalDurationWorkout = queue.current.reduce((acc, step) => acc + step.duration, 0);
  let totalDurationRemaining = secondsRemaining;
  for (let i = currentStepIndex + 1; i < queue.current.length; i++) {
    totalDurationRemaining += queue.current[i].duration;
  }

  const startTimer = () => {
    audioSynth.init();
    setIsActive(true);
    if (currentStepIndex === 0 && secondsRemaining === queue.current[0]?.duration) {
      audioSynth.play(soundPack, 'start');
      vibrate(150);
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const skipStep = () => {
    if (currentStepIndex < queue.current.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setSecondsRemaining(queue.current[nextIndex].duration);
      audioSynth.play(soundPack, 'beep');
      vibrate(50);
    } else {
      handleWorkoutComplete();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    if (queue.current.length > 0) {
      setSecondsRemaining(queue.current[0].duration);
    }
  };

  const handleWorkoutComplete = () => {
    setIsActive(false);
    audioSynth.play(soundPack, 'finish');
    vibrate([200, 100, 200, 100, 400]);
    onComplete();
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (currentStepIndex < queue.current.length - 1) {
              const nextIndex = currentStepIndex + 1;
              const next = queue.current[nextIndex];
              setCurrentStepIndex(nextIndex);
              
              if (
                currentStep?.name.includes('Left Side') &&
                next.name.includes('Right Side')
              ) {
                audioSynth.play(soundPack, 'switchSides');
                vibrate([100, 100, 100]);
              } else {
                audioSynth.play(soundPack, 'beep');
                vibrate(100);
              }
              
              return next.duration;
            } else {
              clearInterval(intervalRef.current!);
              setTimeout(() => {
                handleWorkoutComplete();
              }, 100);
              return 0;
            }
          }

          const nextVal = prev - 1;
          if (nextVal <= 3 && nextVal >= 1) {
            audioSynth.play(soundPack, 'beep');
            vibrate(50);
          }

          return nextVal;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentStepIndex, soundPack, currentStep]);

  return {
    currentStep,
    nextStep,
    secondsRemaining,
    progressPercent,
    isActive,
    startTimer,
    pauseTimer,
    skipStep,
    resetTimer,
    totalDurationRemaining,
    totalDurationWorkout,
  };
};
