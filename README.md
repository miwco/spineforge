# SpineForge

SpineForge is a phone-first, gamified daily back-maintenance workout app. It guides a short lower-back stability routine, tracks consistency locally, and rewards repeat use with streaks, coins, micro-progression, and cosmetic unlocks.

The app is built for the small daily habit: open it, press start, follow the timer, and keep the streak alive.

## What It Does

- Runs a guided daily back routine with automatic timers.
- Shows the current exercise, countdown, movement image, cue text, and next exercise.
- Uses 10-second transition periods so the user can prepare for the next movement.
- Plays synthesized beep cues and uses device vibration where supported.
- Tracks completed days, current streak, longest streak, coins, and progression.
- Lets the user assign a gentle +1 second micro-progression after each completed day.
- Includes a shop for themes, sound packs, titles, badges, animations, routines, and relic-style rewards.
- Stores all user data locally in the browser for now.

## Core Routine

The default SpineForge session is about 5 minutes of exercise plus short transitions.

1. Hip hinge wall taps
2. Bird dog
3. Side plank
   - 30 seconds left side
   - 30 seconds right side
   - side-switch cue between sides
4. Dead bug
5. Glute bridge + hip mobility

During transitions, the workout screen previews the next movement so the user can get into position before the work interval begins.

## Exercise Media

The app uses square exercise images in the workout player and demo videos in the exercise library.

| Movement | Image | Demo video |
| --- | --- | --- |
| Hip hinge wall taps | ![Hip hinge wall taps](public/images/1.hip-hinge-wall-taps.jpeg) | [MP4](public/video/hip-hinge-wall-taps-video.mp4) |
| Bird dog | ![Bird dog](public/images/2.bird-dog.jpeg) | [MP4](public/video/bird-dog-video.mp4) |
| Side plank | ![Side plank](public/images/3.side-plank.jpeg) | [MP4](public/video/side-plank_video.mp4) |
| Dead bug | ![Dead bug](public/images/4.dead-bug.jpeg) | [MP4](public/video/Dead-bug-video.mp4) |
| Glute bridge + hip mobility | ![Glute bridge](public/images/5.glute-bridge.jpeg) | [MP4](public/video/glute-bridge-video.mp4) |

## Progression

SpineForge uses gentle, user-directed micro-progression:

- Each first completed workout of the day adds +1 second to one exercise for the next session.
- The completion screen lets the user choose which exercise receives the extra second.
- An unallocated point is saved locally, so closing the PWA does not lose it.
- Each exercise is capped at +30 seconds.
- Side plank progression is split across left and right sides.
- The Home and Stats views show the current daily target time.

## Streaks, Coins, and Rewards

Completing workouts earns coins and protects the user's streak.

Current economy:

- 10 base coins for the first workout completion of a day.
- 1 additional coin for every progression second completed during that workout.
- 7-day streak milestone bonus starts at 50 coins.
- Later 7-day milestones scale upward by +10 coins each week.
- Streak repair costs 150 coins.
- Streak saver/rest day costs 200 coins.

The shop contains unlockable:

- Visual themes
- Sound packs
- Dashboard badges
- Completion animations
- Titles/ranks
- Alternative routine blueprints
- Long-term relic rewards

Rewards are intentionally priced so they require consistency instead of being unlocked instantly.

## Local-Only Data

SpineForge currently has no backend, accounts, or cloud sync. Browser data is stored with `localStorage`.

Main storage keys:

- `spineforge_state` - app state, streaks, coins, progression, cosmetics
- `spineforge_active_routine` - selected routine blueprint

Clearing browser site data will reset progress.

## Project Structure

```text
src/
  App.tsx                    App shell, tab navigation, player/completion routing
  hooks/
    useAppState.ts           Local state, streaks, coins, progression, shop logic
    useWorkoutTimer.ts       Workout queue, countdown, transition and cue logic
  views/
    HomeView.tsx             Dashboard, start button, streak repair/saver, alert export
    WorkoutPlayerView.tsx    Fullscreen guided workout
    CompletionView.tsx       Rewards and completion screen
    ExerciseInfoView.tsx     Exercise library with images/videos
    StatsView.tsx            Calendar and progression stats
    ShopView.tsx             Rewards shop and routine unlocks
    SafetyView.tsx           Safety guidance
  utils/
    assets.ts                Exercise image/video path mapping
    audioSynth.ts            Web Audio sound packs
public/
  images/                    Exercise images
  video/                     Exercise demo videos
  manifest.json              PWA manifest
  sw.js                      Service worker
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Deployment

This repository is intended to deploy through Vercel from GitHub.

Current setup:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- No custom `vercel.json` is required at the moment.

Typical flow:

1. Commit changes.
2. Push to GitHub.
3. Vercel detects the push.
4. Vercel runs the Vite build and deploys `dist`.

Before pushing, run `npm run build` to keep the GitHub-to-Vercel deployment path clean.

## Design Direction

SpineForge uses a "Forged in the Dark" identity: black steel, molten orange, heavy typography, glowing edges, compact mobile cards, and a centered phone-sized shell on desktop. Future UI work should keep the app practical, readable, and phone-first while strengthening that forge/gym identity.

## Notes for Future Work

- Separate real workout dates from repaired/rest-saver dates for cleaner stats.
- Move active routine selection into the main app state.
- Add tests for streak calculation, repair cooldowns, manual progression allocation, progression bonus coins, and once-per-day rewards.
- Finish mismatched shop items whose runtime behavior is incomplete.
- Improve service worker cache update behavior if production users see stale deploys.
