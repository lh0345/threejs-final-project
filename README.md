# 🦅 Albanian Hall of Legacy

A stunning 3D virtual museum built with Three.js, celebrating Albanian heritage, historical figures, and cultural achievements.

## 📋 Overview

This interactive web application showcases Albanian history through an immersive virtual museum experience with:
- 24 portraits of historical figures, scientists, artists, and international contributors
- 6 themed exhibition rooms
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

   **Using Node.js:**
   ```bash
   npx http-server -p 8000
   ```

   **Using VS Code:**
   - Install "Live Server" extension
   - Right-click on `index.html` → "Open with Live Server"

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

## 🎮 Controls

### Mouse Controls
- **Left Click + Drag** - Rotate camera
- **Right Click + Drag** - Pan camera
- **Scroll Wheel** - Zoom in/out
- **Click Portrait** - Focus and view details

### Keyboard Controls
- **ESC** - Exit portrait focus / Stop tour
- **Arrow Left** - Previous portrait
- **Arrow Right** - Next portrait

### UI Controls
- **▶ Start Tour** - Begin automated tour
- **🔇 / 🔊** - Toggle ambient audio
- **Room Buttons** - Jump to specific room

## 📁 Project Structure

```
threejs-final-project/
├── index.html              # Main HTML file
├── README.md              # This file
├── 3d/
│   └── Albanian_Eagle.stl  # 3D model of Albanian eagle
├── audio/
│   └── background-music.mp3
├── css/
│   └── styles.css         # CSS with custom properties
└── js/
    ├── config.js          # ✨ Centralized configuration
    ├── loader.js          # ✨ Loading screen with progress
    ├── main.js            # Entry point
    ├── scene.js           # Three.js scene setup
    ├── rooms.js           # Room building functions
    ├── portraits.js       # Portrait creation and data
    ├── navigation.js      # Room navigation system
    └── interactions.js    # ✨ User interactions with error handling
```

## ⚙️ Configuration

### Easy Customization via `config.js`

The project now includes a centralized configuration file for easy customization:

```javascript
import { CONFIG, getConfig, setConfig } from './js/config.js';

// Example: Change camera field of view
setConfig('camera.fov', 70);

// Example: Adjust bloom effect
setConfig('postProcessing.bloom.strength', 0.6);

// Example: Change navigation speed
setConfig('navigation.speed', 0.02);
```

### CSS Theming via Variables

Customize the visual theme by editing CSS variables in `styles.css`:

```css
:root {
  --color-primary: #d4af37;     /* Gold */
  --color-secondary: #8b0000;    /* Dark Red */
  --bg-main: #0a0505;           /* Background */
  --transition-fast: 0.3s ease;
  /* ... and many more */
}
```

## 🎨 Exhibition Rooms

1. **🏛️ Entrance Hall** - Grand lobby with welcome area
2. **⚔️ Historical Figures** - Skënderbeu, Ismail Qemali, Isa Boletini, Fan Noli
3. **🔬 Scientists & Thinkers** - Ismail Kadare, Ibrahim Rugova, Sami & Naim Frashëri
4. **🎬 Actors** - James Belushi, Eliza Dushku, Masiela Lusha, Bekim Fehmiu
5. **🌍 International Contributors** - Mother Teresa and Albanian diaspora figures
6. **🎤 Singers** - Rita Ora, Dua Lipa, Bebe Rexha, Era Istrefi
7. **📜 Historical Events** - Independence 1912, League of Prizren, Kosovo Independence

## 🔧 Recent Improvements

### ✨ What Was Fixed

#### 1. **Functional Loading Bar** ✅
- Progress tracking for all assets (STL models, textures)
- Minimum load time for smooth experience
- Automatic hiding when ready

#### 2. **Comprehensive Error Handling** ✅
- Try-catch blocks throughout the codebase
- Safe DOM operations
- Audio fallbacks for autoplay restrictions
- 3D model loading fallbacks
- Graceful degradation

#### 3. **Centralized Configuration** ✅
- `config.js` with all settings in one place
- Easy customization for developers
- Runtime configuration updates

#### 4. **CSS Variables for Theming** ✅
- Complete set of CSS custom properties
- Easy color scheme changes
- Consistent spacing and sizing
- Reusable gradients and effects

#### 5. **Professional Documentation** ✅
- JSDoc comments on all major functions
- Module-level documentation
- Parameter type annotations
- Clear code organization

## 🎯 Performance Tips

1. **Lower-end devices**: Reduce post-processing by modifying `config.js`:
   ```javascript
   setConfig('postProcessing.bloom.enabled', false);
   ```

2. **Slow loading**: Check network connection, assets load from CDN

3. **Audio issues**: Click the sound button after page loads (browser autoplay policy)

## 🐛 Troubleshooting

### Loading Screen Stuck
- Check browser console for errors
- Ensure local server is running
- Verify `3d/Albanian_Eagle.stl` file exists

### Audio Not Playing
- Click the 🔇 button to enable sound
- Browser autoplay policies require user interaction
- Check `audio/background-music.mp3` exists

### Performance Issues
- Close other browser tabs
- Reduce browser window size
- Disable post-processing effects in `config.js`

### Controls Not Working
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page (Ctrl/Cmd + Shift + R)

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Opera 76+

## 🛠️ Technologies Used

- **Three.js** (v0.158.0) - 3D graphics library
- **OrbitControls** - Camera control system
- **EffectComposer** - Post-processing pipeline
- **STLLoader** - 3D model loading
- **Vanilla JavaScript** (ES6 Modules)
- **CSS3** with Custom Properties
- **HTML5** Canvas

## 📝 Code Quality

- ✅ Modular ES6 architecture
- ✅ Comprehensive error handling
- ✅ JSDoc documentation
- ✅ Consistent code style
- ✅ Separation of concerns
- ✅ No external dependencies (except Three.js)

## 🎓 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## 📜 License

Educational project for learning Three.js and web 3D development.

## 🙏 Acknowledgments

- Albanian heritage and historical figures
- Three.js community and documentation
- All contributors to Albanian culture worldwide

## 📧 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all files are present and server is running

---

**Enjoy exploring the Albanian Hall of Legacy!** 🦅

*Built with passion for Albanian heritage and modern web technology.*
