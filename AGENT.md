# SpineForge - Future Agent Guide

## App Goal and Current Status
SpineForge is a mobile-first, PWA-friendly React/Vite application designed as a daily 5-minute lower-back maintenance routine. 
The visual identity follows a "Forged in the Dark" aesthetic—cinematic, dark industrial gym atmosphere, concrete/steel textures, and molten orange highlights.
The app is fully functional with workout logic, timers, progression, streaks, economy (coins), shop/rewards, and local data persistence.

## Tech Stack and Important Commands
- **Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS (`src/index.css`) utilizing CSS variables for themeing. Mobile-first constraint (root div capped at 480px).
- **Icons:** `lucide-react`
- **Commands:**
  - `npm run dev` - Start local development server
  - `npm run build` - Build for production
  - `npm run preview` - Preview production build locally

## Core Logic & Mechanics

### Workout Logic & Timing
- The base workout runs automatically once started. It consists of `get-ready`, `work`, and `rest` (transition) steps.
- **Timing:** Built around `src/hooks/useWorkoutTimer.ts`. The timer tick drives the entire sequence.
- **Transitions:** 10-second rests between core exercises. During rest, the UI previews the next exercise photograph and name.

### Progression, Streaks, & Coins
- **Single Source of Truth:** `src/hooks/useAppState.ts` holds `AppState` (coins, streak, items).
- **Economy:** 
  - Base reward per workout: 10 coins.
  - 7-Day Streak Loop Bonus: Hitting a 7-day streak grants 50 extra coins. Consecutive 7-day streaks scale by +10 coins each week.
  - Streak Saver (Rest Day): Can be bought for 200 coins to protect a streak.
  - Streak Repair: Rebuilding a broken streak from yesterday costs 150 coins.
- **Shop/Rewards:** The `ShopView` features a grid of unlockable themes, animations, badges, and end-game relics.

### Data Persistence
- Handled entirely via `localStorage` (key: `spineforge_state`).
- `DEFAULT_STATE` initializes the app for new users.

### Asset Folders and Media
- **Location:** All active production media must live in the `public/` directory (e.g., `public/images/`, `public/video/`).
- **Mapping Utility:** `src/utils/assets.ts` exports `getExerciseMedia(id)` which maps exercise IDs to their static paths.
- **UI Constraints:** Images use `aspect-ratio: 1 / 1` and videos use `aspect-ratio: 16 / 9` to prevent stretching. `object-fit: contain` is strictly enforced.

## Visual Theme Notes ("Forged in the Dark")
- Avoid flat vector styles and generic colors. 
- Use deep shadow black (#050508), industrial slate, and vivid molten orange highlights.
- The theme relies on glowing drop shadows (`var(--shadow-lg)`), thick borders, and heavy, spaced typography (e.g., `Oswald`, `Montserrat`).
- Themes are injected by adding CSS classes to the body (e.g., `theme-retro`, `theme-volcanic`) which override CSS variables in `index.css`.

## Known Priorities or Caveats
- No backend database; it is fully local. If cloud sync is requested later, `useAppState.ts` will need a major overhaul.
- The UI is designed for mobile screens. Desktop view simply centers the 480px root container.

## How to Test/Build/Deploy
- **Build/Test:** Run `npm run build` to verify there are no TypeScript or Vite build errors.
- **Deploy:** The repo is pushed to GitHub (`miwco/spineforge`) and deployed automatically on Vercel. Vercel relies on standard Vite build commands.
