# 🦅 Albanian Hall of Legacy

A stunning 3D virtual museum built with Three.js, celebrating Albanian heritage, historical figures, and cultural achievements.

## 📋 Overview

This interactive web application showcases Albanian history through an immersive virtual museum experience with:
- 24 portraits of historical figures, scientists, artists, and international contributors
- 7 themed exhibition rooms
- Smooth navigation and auto-tour functionality
- Atmospheric lighting and post-processing effects
- Comprehensive error handling and loading system

## 🎯 Features

### Core Functionality
✅ **Interactive 3D Museum** - Navigate through multiple themed rooms  
✅ **Portrait Gallery** - Click on portraits to learn about Albanian figures  
✅ **Auto-Tour Mode** - Automated guided tour through all exhibits  
✅ **Room Navigation** - Quick jump buttons for each exhibition room  
✅ **Ambient Audio** - Background music with toggle controls  
✅ **Keyboard Navigation** - Arrow keys to move between portraits  
✅ **Functional Loading Screen** - Progress tracking with animated eagle  
✅ **Error Handling** - Comprehensive fallbacks and error recovery  
✅ **Responsive Design** - CSS variables for easy theming  

### Technical Features
- **Post-Processing Effects**: Bloom, SMAA anti-aliasing
- **Shadow Mapping**: Realistic shadows with PCF soft shadows
- **Fog and Atmosphere**: Depth-enhancing fog effects
- **3D Model Loading**: STL format Albanian eagle monument
- **Smooth Animations**: Lerp-based camera movements
- **Asset Loading**: Progress tracking for all resources

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Local web server (e.g., Live Server, Python http.server, Node http-server)

### Installation

1. **Clone or download** the project files

2. **Start a local web server** in the project directory:

   **Using Python 3:**
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

