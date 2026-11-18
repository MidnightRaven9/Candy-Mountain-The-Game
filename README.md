# Shift Mountain

**Game Off 2026 Entry** — Theme: SHIFT

A gear-shifting auto-runner where every gear changes more than just your speed. Inspired by the classic *Charlie The Unicorn* video, you play as Charlie the Unicorn being dragged toward Candy Mountain by two obnoxious blue companions. But watch out — each gear shift alters physics, gravity, and control in unexpected ways.

## 🎮 How to Play

- **SHIFT** — Cycle through 4 gears
- Reach Candy Mountain while avoiding obstacles
- Each gear radically changes gameplay:

| Gear | Effect |
|------|--------|
| 1 | Normal physics |
| 2 | Reverse gravity |
| 3 | Slow time / visual flash |
| 4 | Ice physics / no brakes (auto-revert) |

## 🕹️ Controls

- **SHIFT** — Shift gears (start from menu, shift during gameplay)
- Single-key control, designed for keyboard or on-screen shift key

## 📂 Repository Structure

```
shift-mountain/
├── index.html          — Entry point, Phaser 3 config
├── js/
│   ├── phaser-min.js   — Phaser 3.87 engine (vendored)
│   ├── config.js       — Game configuration
│   ├── scenes/
│   │   ├── MenuScene.js     — Main menu with SHIFT prompt
│   │   ├── GameScene.js     — Main gameplay
│   │   ├── GameOverScene.js — Game over screen
│   │   └── MenuScene.js     — Start screen
│   └── ...
├── README.md           — This file
├── LICENSE             — MIT open source license
└── .gitignore          — Node modules and build outputs
```

## 🚀 Build & Play

### Web Version
1. Clone the repo: `git clone https://github.com/your-username/shift-mountain.git`
2. Open `index.html` in any modern browser
3. Or host on GitHub Pages — the game runs entirely client-side

### APK Version
This Phaser 3 game can be converted to an APK using:
- **Capacitor**: `npm install @capacitor/core @capapacitor/cli && npx cap add android`
- **Cordova**: `cordova platform add android`
- **Expo Go**: For React Native workflows

The game has no native dependencies beyond the web, so any standard Phaser-to-native wrapper will work.

## 📜 License

MIT — See the `LICENSE` file for details. Feel free to fork, modify, and use this as a base for your own Game Off entries or learning experiments.

## 🎨 Assets & Design

- **All graphics procedural** — drawn entirely with Phaser Graphics, no external image assets
- **Theme**: SHIFT — gear-shifting mechanics, perspective shifts, reality changes
- **Inspiration**: Charlie The Unicorn (YouTube) — the reluctant unicorn, the two blue companions, the journey to Candy Mountain
- **No AI-generated art** — all visuals hand-coded with geometric shapes and colors

## 🛠️ Technologies

- **Phaser 3.87** — 2D game framework, vendored, no build step required
- **Vanilla HTML5 Canvas** — runs in any browser supporting WebGL2
- **ES6 JavaScript** — modular scene architecture
- **Git & GitHub** — version control, public repository for the jam

## 📬 Contact

Created for [Game Off 2026](https://itch.io/jam/game-off-2026) by GitHub · Theme: SHIFT