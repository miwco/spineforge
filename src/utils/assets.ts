// Asset Mapping Utility for SpineForge exercises and demonstration videos.
// Images and videos are stored in public/images/ and public/video/ directories respectively.

export interface ExerciseMedia {
  image: string;
  video: string;
}

export const EXERCISE_MEDIA: Record<string, ExerciseMedia> = {
  // Core Back Routine
  'hip-hinge': {
    image: '/images/1.hip-hinge-wall-taps.jpeg',
    video: '/video/hip-hinge-wall-taps-video.mp4'
  },
  'bird-dog': {
    image: '/images/2.bird-dog.jpeg',
    video: '/video/bird-dog-video.mp4'
  },
  'side-plank': {
    image: '/images/3.side-plank.jpeg',
    video: '/video/side-plank_video.mp4'
  },
  'dead-bug': {
    image: '/images/4.dead-bug.jpeg',
    video: '/video/Dead-bug-video.mp4'
  },
  'glute-bridge': {
    image: '/images/5.glute-bridge.jpeg',
    video: '/video/glute-bridge-video.mp4'
  },

  // Decompress & Stretch Routine (Fallback mapping to closest visual JPEGs/Videos)
  'cat-cow': {
    image: '/images/2.bird-dog.jpeg', // quadruped position
    video: '/video/bird-dog-video.mp4'
  },
  'child-pose': {
    image: '/images/5.glute-bridge.jpeg', // lying close to mat
    video: '/video/glute-bridge-video.mp4'
  },
  'supine-twist': {
    image: '/images/4.dead-bug.jpeg', // supine
    video: '/video/Dead-bug-video.mp4'
  },
  'knees-to-chest': {
    image: '/images/4.dead-bug.jpeg', // supine
    video: '/video/Dead-bug-video.mp4'
  },

  // Glute Booster Routine
  'clamshells': {
    image: '/images/3.side-plank.jpeg', // side-lying
    video: '/video/side-plank_video.mp4'
  },
  'bridge-holds': {
    image: '/images/5.glute-bridge.jpeg', // bridge
    video: '/video/glute-bridge-video.mp4'
  },
  'donkey-kicks': {
    image: '/images/2.bird-dog.jpeg', // quadruped
    video: '/video/bird-dog-video.mp4'
  }
};

export const getExerciseMedia = (id: string | undefined): ExerciseMedia => {
  if (!id || !EXERCISE_MEDIA[id]) {
    // Return default fallback if key is invalid
    return {
      image: '/images/1.hip-hinge-wall-taps.jpeg',
      video: '/video/hip-hinge-wall-taps-video.mp4'
    };
  }
  return EXERCISE_MEDIA[id];
};
