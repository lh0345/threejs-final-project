# 🦅 Albanian Hall of Legacy

3D virtual museum built with Three.js celebrating Albanian heritage - 24 portraits across 7 themed rooms.

## 🚀 Quick Start

**Start server:**
```bash
python -m http.server 8000
```

**Open:** http://localhost:8000

## 🎮 Controls

- **Mouse**: Drag to rotate, scroll to zoom, click portraits for details
- **Keyboard**: Arrow keys navigate portraits, ESC exits
- **UI**: Auto-tour button, room navigation, audio toggle

## ⚙️ Architecture

- **OOP Design**: Factory pattern for shared geometries & materials
- **Centralized Config**: `config.js` - single source for all settings
- **Optimized**: 3 shared geometries (was 96), material caching
- **Post-processing**: Bloom, SMAA anti-aliasing, shadows, fog

## 📁 Structure

```
├── index.html
├── css/styles.css
└── js/
    ├── config.js          # Centralized settings
    ├── scene.js           # Three.js setup
    ├── portraits.js       # OOP portrait system
    ├── rooms.js           # Room builder
    ├── interactions.js    # Events & animations
    ├── navigation.js      # Camera navigation
    ├── loader.js          # Loading screen
    └── main.js            # Entry point
```

## 🎨 Rooms

1. Historical Figures - Skënderbeu, Ismail Qemali, Isa Boletini, Adem Jashari
2. Scientists & Thinkers - Ismail Kadare, Ibrahim Rugova, Frashëri brothers
3. Actors - John & Jim Belushi, Faruk Begolli, Bekim Fehmiu
4. International Contributors - Mother Teresa, Ferid Murad, Bexhet Pacolli
5. Singers - Rita Ora, Dua Lipa, Inva Mula, Nexhmije Pagarusha
6. Historical Events - Independence 1912, League of Prizren, Kosovo 2008

---

Built with Three.js v0.158.0 | OOP Architecture | Optimized Performance

