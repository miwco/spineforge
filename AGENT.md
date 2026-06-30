# SpineForge - Future Agent Guide

## Product Summary
SpineForge is a phone-first, PWA-friendly React/Vite app for a short daily lower-back maintenance routine. The user presses start once, then the app automatically runs a guided workout with timers, transition previews, beeps/vibration cues, streak tracking, coins, progression, and shop rewards.

The visual identity is "Forged in the Dark": deep black, industrial steel, molten orange, glowing borders, heavy Oswald headings, compact mobile cards, and a centered 480px max-width app shell on desktop.

## Tech Stack
- Framework: React 19 + Vite
- Language: TypeScript
- Styling: vanilla CSS in `src/index.css`, with many view-level inline styles
- Icons: `lucide-react`
- State: local-only `localStorage`
- PWA files: `public/manifest.json` and `public/sw.js`

Commands:
- `npm run dev` - start local Vite dev server
- `npm run build` - TypeScript build plus Vite production build
- `npm run lint` - oxlint
- `npm run preview` - preview production build locally

## Main File Map
- `src/App.tsx` - top-level shell, tab routing, fullscreen workout/completion routing, hooks wiring
- `src/hooks/useAppState.ts` - app persistence, streaks, coins, progression, shop ownership/equips
- `src/hooks/useWorkoutTimer.ts` - workout queue construction, interval timer, transition/switch/finish cues
- `src/views/HomeView.tsx` - dashboard, start button, session length, streak repair/saver, calendar export
- `src/views/WorkoutPlayerView.tsx` - fullscreen workout UI, countdown, large picture/video media, next step, controls, exit modal
- `src/views/CompletionView.tsx` - completion rewards screen and spark animation
- `src/views/ExerciseInfoView.tsx` - exercise library, image thumbnails, expandable videos
- `src/views/StatsView.tsx` - streak cards, monthly calendar, progression bars
- `src/views/ShopView.tsx` - shop catalog, purchases, equips, routine blueprint selection
- `src/views/SafetyView.tsx` - medical/safety guidance
- `src/utils/assets.ts` - exercise id to image/video mapping
- `src/utils/audioSynth.ts` - Web Audio beep/sound-pack synthesis
- `public/images/` - 1:1 exercise images used by workout/library
- `public/video/` - 16:9 exercise demo videos used by the library

## Current Workout Logic
The default routine is built in `buildWorkoutQueue` inside `src/hooks/useWorkoutTimer.ts`.

Default flow:
1. Get Ready - 8 seconds
2. Hip Hinge Wall Taps - 60 seconds plus progression
3. Transition Rest - 10 seconds, previews Bird Dog
4. Bird Dog - 60 seconds plus progression
5. Transition Rest - 10 seconds, previews Side Plank Left
6. Side Plank Left - 30 seconds plus half of side-plank progression
7. Side Plank Right - 30 seconds plus the other half of side-plank progression
8. Transition Rest - 10 seconds, previews Dead Bug
9. Dead Bug - 60 seconds plus progression
10. Transition Rest - 10 seconds, previews Glute Bridge
11. Glute Bridge + Hip Mobility - 60 seconds plus progression

The workout starts paused on the player screen. Pressing the round play button initializes audio and starts the timer. The timer advances automatically. The UI shows a compact countdown, current exercise/rest label, large media, one-line cue text, and next-up bar. Get-ready/rest/transition states show the next exercise picture as a large square preview. Active work states show the exercise demo video looping muted in a 16:9 frame.

Audio/vibration behavior:
- Start cue when the timer begins from the initial get-ready step
- Beep and vibration on transitions
- Special `switchSides` cue when moving from side plank left to right
- Final cue and vibration pattern on completion
- Final three seconds beep/vibrate each second

Alternative routines:
- `routine-decompress` and `routine-glutes` are unlocked in the shop.
- They are stored outside the main app state in `localStorage` key `spineforge_active_routine`.
- Alternative routine media currently reuses closest-match core media from `src/utils/assets.ts`.

## Progression
Progression lives in `state.progression` in `src/hooks/useAppState.ts`.

Current rules:
- First completion of a local calendar day awards progression.
- Each completed day adds +1 second to one exercise for the next workout.
- Rotation order is `hip-hinge`, `bird-dog`, `side-plank`, `dead-bug`, `glute-bridge`.
- Each exercise progression is capped at +30 seconds.
- Side plank progression is split between left and right sides.
- Home and Stats show total daily target as 300 base seconds plus total progression seconds. This does not include the initial 8-second get-ready step or transition rests.

## Streaks, Coins, Repair, and Rewards
Primary state is stored in `localStorage` under `spineforge_state`.

Important fields:
- `completedDates`
- `streakCurrent`
- `streakLongest`
- `coins`
- `lastWorkoutDate`
- `lastRepairDate`
- `progression`
- `unlockedCosmetics`
- `activeTheme`
- `activeSoundPack`
- `activeTitle`
- `activeBadge`
- `activeAnimation`
- `reminderTime`

Current economy:
- New users start with 20 coins.
- First workout completion per local date gives 10 coins.
- Every 7-day streak milestone gives a bonus: 50 coins at day 7, then +10 more for each later week.
- Streak repair costs 150 coins.
- Streak saver/rest day costs 200 coins.
- Shop prices range from 50 coins to 5000 coins.

Streak calculation:
- `calculateStreak` deduplicates/sorts `completedDates`.
- Current streak is counted backward from today if today is completed, otherwise from yesterday if yesterday is completed.
- Longest streak is calculated historically from the completed date list.

Repair behavior:
- Repair only inserts yesterday into `completedDates`.
- Repair is blocked if yesterday is already completed.
- Repair has a 7-day cooldown using `lastRepairDate`.
- Repair requires enough coins.

Streak saver behavior:
- Streak saver inserts today into `completedDates` and subtracts 200 coins.
- It prevents losing the current streak but is currently indistinguishable from a real workout in Stats.

## Shop and Cosmetics
The shop catalog is hardcoded in `SHOP_ITEMS` in `src/views/ShopView.tsx`.

Supported item types:
- `theme`
- `sound`
- `title`
- `routine`
- `badge`
- `animation`
- `relic`

Theme classes are applied on `document.body` from `state.activeTheme`. Implemented CSS theme variants currently include:
- `theme-classic-dark` through default `:root`
- `theme-retro`
- `theme-forest`
- `theme-cyber`

Known current mismatch: `theme-ember` is sold in the shop but does not have a matching CSS body theme yet.

Sound packs implemented in `audioSynth.ts`:
- `8-bit`
- `zen`
- `synthwave`

Known current mismatch: `sound-arcane` is sold in the shop but `SoundPack` does not include `arcane`, so it effectively falls back to the default 8-bit pack when played.

Badges/titles display on Home. Completion animations and relics are purchasable/equippable in state, but the completion screen does not currently branch on `activeAnimation`.

## Data Persistence Notes
- There is no backend or account system.
- Do not assume cross-device sync.
- `spineforge_state` is the main durable state.
- `spineforge_active_routine` is a separate localStorage key.
- There is no schema version or migration layer yet.
- `completedDates` currently mixes real workouts, repairs, and streak saver days. The expected future model should separate real completed days, missed days, repaired days, and rest/saver days.

## Media Notes
Production media should remain in `public/` so Vite serves it at stable root paths.

Current core images:
- `/images/1.hip-hinge-wall-taps.jpeg`
- `/images/2.bird-dog.jpeg`
- `/images/3.side-plank.jpeg`
- `/images/4.dead-bug.jpeg`
- `/images/5.glute-bridge.jpeg`

Current core videos:
- `/video/hip-hinge-wall-taps-video.mp4`
- `/video/bird-dog-video.mp4`
- `/video/side-plank_video.mp4`
- `/video/Dead-bug-video.mp4`
- `/video/glute-bridge-video.mp4`

Workout exercise media should prioritize readability on a phone. Square exercise pictures can use a large square preview frame during get-ready/rest/transition states. Active work states should loop the corresponding 16:9 exercise video muted with `object-fit: contain`. Library videos also use `aspect-ratio: 16 / 9` and `object-fit: contain`.

## Visual Theme and UX Guidance
- Keep the app phone-first.
- Preserve the dark steel and molten orange identity unless explicitly asked to redesign.
- Avoid broad desktop layouts; desktop should continue to center the mobile shell.
- Exercise pictures in workout previews should remain square, large, and inspectable; active exercise videos should be 16:9 and loop during the working interval.
- Use existing CSS variables and component classes before introducing a new design system.
- Be careful with inline styles: the current app uses many of them, but future cleanup should extract repeated card/button styles gradually.

## Vercel and Deployment
This repo is connected to GitHub at `miwco/spineforge` and is expected to deploy through Vercel's Git integration.

Current deployment setup:
- No `vercel.json`
- No checked-in `.vercel` directory
- No GitHub Actions workflows
- Vercel should auto-detect Vite
- Build command: `npm run build`
- Output directory: `dist`

Before pushing deployable changes, run:
- `npm run build`
- `npm run lint` when relevant

Service worker warning:
- `public/sw.js` uses a cache-first strategy for same-origin GET requests and a manual cache name (`spineforge-cache-v1`). If production users report stale deploys, review service worker update/cache behavior.

## Known Fragile Areas
- README was previously the default Vite README; keep it product-specific.
- `package.json` name is still `old-man-back`.
- Some source copy contains mojibake, for example corrupted apostrophes in "Child's" and corrupted bullet characters, and should be cleaned when editing those files.
- `WorkoutPlayerView` has a mute icon state, but it does not currently suppress sounds in `audioSynth`.
- `useWorkoutTimer` has a lint warning about `handleWorkoutComplete` in an effect dependency list.
- `SVGIllustrations.tsx` has a Fast Refresh warning because it exports non-component helpers/constants.
- Repair/saver days are counted as `completedDates`, which inflates total workouts and calendar completions.
- Routine selection is not part of `AppState`; it is a separate localStorage key and some UI detects unlocks by searching serialized localStorage text.

## Safe Change Guidance
- Keep changes scoped. This project deploys from GitHub to Vercel.
- Prefer adding tests around `calculateStreak`, repair cooldown, progression rotation, and once-per-day rewards before changing state logic.
- If changing persistence, add a migration plan and preserve existing `spineforge_state` users.
- If adding new shop item types, make sure the purchase, equip, display, and runtime behavior all exist.
- If changing media paths or names, update `src/utils/assets.ts` and README references together.
