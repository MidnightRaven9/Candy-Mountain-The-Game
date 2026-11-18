# Shift Mountain - Game Off 2026

## 📁 Repository Structure

```
shift-mountain/
├── index.html                  — HTML entry point
├── package.json                — (optional, for tooling)
├── LICENSE                     — MIT open source license
├── README.md                   — This file
├── .gitignore                  — Git ignore rules
└── js/
    ├── phaser-min.js           — Phaser 3.87 engine (vendored, 1.2MB)
    ├── config.js               — Phaser game configuration
    └── scenes/
        ├── MenuScene.js        — Main menu, SHIFT to start
        ├── GameScene.js        — Gameplay with 4 gears
        └── GameOverScene.js    — Game over / restart
```

## 🚀 Upload to GitHub

### Option 1: Using the GitHub CLI (recommended)

```bash
# 1. Create a new repo on github.com: https://github.com/new
# Name it: shift-mountain (or your preferred name)

# 2. Initialize and push
cd /root/projects/shift-mountain
git remote add origin git@github.com:YOUR-USERNAME/shift-mountain.git
git branch -M main
git push -u origin main
```

### Option 2: Using the GitHub Web UI

1. Go to https://github.com/new and create a new repository
2. Skip "Initialize with README" since we already have one
3. Click "Create repository"
4. Follow the push instructions shown on the page, or:

```bash
git remote add origin git@github.com:YOUR-USERNAME/shift-mountain.git
git push -u origin main
```

### ✅ What's already prepared

- `README.md` — Full game description, controls, tech stack, license, inspiration
- `LICENSE` — MIT open source license (free for others to fork/learn)
- `.gitignore` — Excludes `node_modules`, `platforms/`, build caches
- `index.html` — Clean, professional single-page setup
- All 3 scene files with clean ES6 module architecture

## 📱 APK Build Instructions

This is a Phaser 3 HTML5 game, so converting to APK requires a native wrapper. Here are three professional options:

### Option A: Capacitor (recommended, modern)

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "shift-mountain" "com.yourdomain.shiftmountain"
npx cap add android
# Then open in Android Studio:
npx cap sync
# Open android/ in Android Studio and build → Generate Signed APK
```

**Pros**: Live reloading, web technologies only, active maintenance
**Cons**: Requires Android Studio, ~2GB+ download

### Option B: Cordova (traditional)

```bash
npm install -g cordova
cordova create shift-mountain shift.mountain.ShiftMountain "Shift Mountain"
cd shift-mountain
# Copy our www/* files into www/
cordova platform add android
cordova build android
# Find APK at: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

**Pros**: Well-documented, works with existing Cordova workflows
**Cons**: Older tooling, harder live reloading

### Option C: Expo Go (if you know React Native)

Convert the Phaser canvas to a React Native WebView component, then:
```bash
npm install expo-router expo-web-browser
# Build with: expo build:android
```

### 📝 Note for Game Off Submission

The Game Off jam requires:
- ✅ Public GitHub repo (source code)
- ✅ itch.io submission (zip of the game folder)
- APK is **optional** — the web version via itch.io is the primary delivery

## 📸 Screenshots for itch.io/GitHub

Since I can't generate actual gameplay screenshots from this environment, here's how to create professional ones:

### Option 1: Local Screenshots (recommended)

1. Open `index.html` in Chrome or Firefox
2. Press **F12** to open DevTools
3. Press **Ctrl+Shift+P** (or Cmd+Shift+P) → Type "Capture full size screenshot"
4. Or use a tool like: [awesome-screenshot](https://www.awesomescreenshot.com/) or [Nimbus Screenshot](https://nimbusweb.io/)

### Option 2: Generated Mockups

Use these descriptions for your itch.io/GitHub page:

#### Screenshot 1 — Main Gameplay
> "Charlie the Unicorn auto-running toward Candy Mountain, with gear indicator showing GEAR: 2, reverse gravity active. Two blue companion characters float beside him. Candy obstacles and lollipop spikes in the foreground. Sky blue background with clouds."

#### Screenshot 2 — Gear Menu / UI
> "Close-up of the gear indicator: GEAR: 3 with slow-time visual flash effect. Distance counter: 'DIST: 1250 m'. SHIFT key prompt at bottom. Minimalist HUD with Courier font, gold accents on sky blue background."

#### Screenshot 3 — Game Over / Menu
> "Game over screen with 'CRASHED! Better luck next time.' message. Distance traveled displayed: 'Distance: 840 m'. Restart button: 'PRESS SHIFT TO RESTART'. Background continues the sky blue theme with subtle gradient."

#### Screenshot 4 — Gear Effects Demo
> "Four-panel grid showing each gear's effect:
> - Gear 1: Normal gravity, standard gameplay
> - Gear 2: Player falling upward (reverse gravity)
> - Gear 3: Time slow visual, player moving in slow motion
> - Gear 4: Ice physics, player sliding with trailing dust effect"

### Option 3: Use the itch.io Game Off Theme

Create screenshots that clearly show the **SHIFT** theme:
- UI prominently showing gear numbers
- Visual demonstrations of gravity reversal
- Text overlay: "Theme: SHIFT • Game Off 2026"

## 🎮 Game Overview

**Shift Mountain** is a single-key auto-runner for the Game Off 2026 jam, themed around **SHIFT**:

- **Core Mechanic**: Press SHIFT to cycle 4 gears, each changes physics dramatically
- **Inspiration**: Charlie The Unicorn video — reluctant unicorn, two blue companions, journey to Candy Mountain
- **Gameplay**: Dodge obstacles (candy canes, lollipops, rainbow bridges), manage gear effects
- **Unique Twist**: The two companions from the video may "betray" you (organ theft joke)
- **Accessibility**: One key only, designed for keyboard or mobile touch

### Gears Effect Summary

| Gear | Visual Cue | Gameplay Change |
|------|-----------|-----------------|
| 1 | Gold text "GEAR: 1" | Standard physics |
| 2 | 🔄 Reversed arrow | Gravity flips, player falls upward |
| 3 | ⏱️ Flash effect | Time slows, game becomes easier/different |
| 4 | ❄️ Ice crystal | Ice physics, no brakes, auto-reverts after 1.5s |

## 🛠️ Technical Stack

- **Engine**: Phaser 3.87 (vendored, no build step)
- **Graphics**: Procedural — all drawn with Phaser Graphics primitives
- **Audio**: None (silent game, suitable for own soundtrack)
- **Resolution**: 400 × 600 canvas, pixel-art scaled
- **Input**: Single SHIFT key
- **Platform**: Any browser with HTML5/WebGL support
- **License**: MIT — free for learning, modification, commercial use

## 📜 License

**MIT License** — See `LICENSE` file.

Permission is freely granted to fork, modify, and use this code for:
- Game Off jam entries
- Learning Phaser 3 game development
- Commercial projects (attribution appreciated but not required)

The art and concept are inspired by *Charlie The Unicorn* (YouTube video), used under fair use/parody for Game Jam purposes.

## 👤 Created For

**Game Off 2026** — Hosted by GitHub on itch.io
- Theme: **SHIFT**
- Submission window: November 1 – December 1, 2026
- Voting: January 1, 2027
- Categories: Overall, Gameplay, Graphics, Audio, Innovation, Theme Interpretation

**Repository**: GitHub.com/YOUR-USERNAME/shift-mountain
**Playable**: itch.io (upload the `/root/projects/shift-mountain` folder as a zip)
**Source**: Public GitHub repo with full ES6 source

---

*All graphics hand-coded with Phaser geometric shapes. No AI-generated art. No external asset dependencies. Pure ES6 JavaScript, Phaser 3.87 framework.*