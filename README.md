# Candy Mountain The Game

**Game Off 2026 Entry** — Theme: **SHIFT**

A one-button gear-shifting auto-runner. You play as **Charlie the Unicorn**, dragged toward **Candy Mountain** by two obnoxious blue companions. Every gear changes more than just your speed.

## 🎮 How to Play

| Input | Action |
|-------|--------|
| **SHIFT** | Cycle gears: 1 → 2 → 3 → 4 → 1 |
| **Tap screen** | Same as SHIFT (mobile friendly) |

Reach **500 m** to Candy Mountain while avoiding obstacles. Obstacles sit in two lanes:

- **Bottom lane** — candy canes and lollipop spikes (float: press SHIFT to go upward)
- **Top lane** — floating candy canes and rainbow fragments (stay grounded: press SHIFT to flip back down)

### Gears

| Gear | Effect |
|------|--------|
| **1** | Normal physics (falls to floor) |
| **2** | Reverse gravity (falls toward the sky) |
| **3** | Slow time (all motion slows for 3 s, then auto-returns to gear 1) |
| **4** | Nitro boost (much faster distance accrual for 2.5 s, then auto-returns to gear 1) |

If you crash into an obstacle, it's game over. The companions will laugh.

## 📁 Repository Structure

```
shift-mountain/
├── index.html                  — Web entry point
├── LICENSE                     — MIT open source license
├── README.md                   — This file
├── .gitignore
├── build-apk.sh                — Script to build the Android APK (no Gradle)
└── js/
    ├── phaser.min.js           — Phaser 3 engine (vendored, no build step)
    └── scenes/
        ├── MenuScene.js        — Main menu, SHIFT to start
        ├── GameScene.js        — Gameplay (4 gears, obstacles, win/lose)
        └── GameOverScene.js    — Game over (currently unused helper scene)
```

## ▶️ Play in a Browser

Either open `index.html` directly in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 📱 Build the Android APK

The APK is built with the Android SDK command-line tools (aapt2/d8/apksigner), no Gradle required:

```bash
./build-apk.sh
```

The signed APK is written to `../shift-mountain-android/Shift-Mountain.apk`.

Then copy it to your phone (USB, email, etc.), tap it, and install.

## 🛠️ Technical Stack

- **Phaser 3.87** (vendored) — 2D game framework
- **Vanilla HTML5 Canvas** — no build step
- **ES6 JavaScript** — plain script tags, no modules
- **Procedural graphics** — all sprites generated at runtime from Phaser Graphics primitives; no image assets
- **One key** — SHIFT (plus tap for mobile)

## 📜 License

MIT — see `LICENSE`. Free for learning, jams, and modification.

## 🚀 Game Off 2026

- Jam: https://itch.io/jam/game-off-2026
- Theme: **SHIFT** — interpreted as a gear-shifting racer
- Submissions close December 1, 2026

Inspired by the *Charlie The Unicorn* video as a parody fan homage. Fair-use parody for game-jam purposes.
