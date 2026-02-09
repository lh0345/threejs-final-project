/**
 * CONFIG.JS - Centralized configuration
 * 
 * All configurable parameters for the museum
 */

export const CONFIG = {
  // ═══════════════════════════════════════════
  // SCENE SETTINGS
  // ═══════════════════════════════════════════
  scene: {
    backgroundColor: 0x0a0505,
    fog: {
      enabled: true,
      color: 0x0a0505,
      near: 12,
      far: 45
    }
  },

  // ═══════════════════════════════════════════
  // CAMERA SETTINGS
  // ═══════════════════════════════════════════
  camera: {
    fov: 60,
    near: 0.1,
    far: 100,
    initialPosition: { x: 0, y: 4, z: 22 }
  },

  // ═══════════════════════════════════════════
  // RENDERER SETTINGS
  // ═══════════════════════════════════════════
  renderer: {
    antialias: true,
    powerPreference: 'high-performance',
    maxPixelRatio: 2,
    shadowMapEnabled: true,
    shadowMapType: 'PCFSoft', // 'PCFSoft', 'PCF', 'VSM'
    toneMapping: 'ACESFilmic', // 'ACESFilmic', 'Linear', 'Reinhard'
    toneMappingExposure: 1.4
  },

  // ═══════════════════════════════════════════
  // POST-PROCESSING EFFECTS
  // ═══════════════════════════════════════════
  postProcessing: {
    bloom: {
      enabled: true,
      strength: 0.4,
      radius: 0.4,
      threshold: 0.85
    },
    smaa: {
      enabled: true
    }
  },

  // ═══════════════════════════════════════════
  // CONTROLS SETTINGS
  // ═══════════════════════════════════════════
  controls: {
    enableDamping: true,
    dampingFactor: 0.05,
    initialTarget: { x: 0, y: 3, z: 3 },
    enableTouch: true,
    touchDampingFactor: 0.08
  },

  // ═══════════════════════════════════════════
  // LIGHTING SETTINGS
  // ═══════════════════════════════════════════
  lighting: {
    ambient: {
      color: 0xffffff,
      intensity: 0.6
    },
    main: {
      color: 0xffffff,
      intensity: 1.8,
      position: { x: 5, y: 15, z: 5 },
      castShadow: true,
      shadowMapSize: 2048,
      shadowBias: -0.0001
    }
  },

  // ═══════════════════════════════════════════
  // MATERIALS
  // ═══════════════════════════════════════════
  materials: {
    floor: {
      color: 0x120808,
      roughness: 0.85,
      metalness: 0.0
    },
    wall: {
      color: 0x1a0d0d,
      roughness: 0.6,
      metalness: 0.1
    },
    ceiling: {
      color: 0x0a0505,
      roughness: 0.9,
      metalness: 0.0
    },
    benchWood: {
      color: 0x2a1810,
      roughness: 0.7,
      metalness: 0.1
    },
    benchLeather: {
      color: 0x1a0a0a,
      roughness: 0.5,
      metalness: 0.0
    },
    rope: {
      color: 0x8b0000,
      roughness: 0.8,
      metalness: 0.1
    },
    post: {
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.8
    }
  },

  // ═══════════════════════════════════════════
  // AUDIO SETTINGS
  // ═══════════════════════════════════════════
  audio: {
    enabled: true,
    defaultVolume: 0.2,
    audioFile: 'audio/background-music.mp3',
    enableUserGesture: true, // Require user interaction to start
    fallbackEnabled: true
  },

  // ═══════════════════════════════════════════
  // LOADING SCREEN SETTINGS
  // ═══════════════════════════════════════════
  loading: {
    eagleModelPath: '3d/Albanian_Eagle.stl',
    eagleColor: 0x111111,
    eagleMetalness: 0.8,
    eagleRoughness: 0.3,
    minLoadTime: 1500, // Minimum time to show loading screen (ms)
    fadeOutDuration: 800, // Fade out animation duration (ms)
    rotationSpeed: 0.02
  },

  // ═══════════════════════════════════════════
  // NAVIGATION SETTINGS
  // ═══════════════════════════════════════════
  navigation: {
    speed: 0.012, // Speed of camera movement when navigating rooms
    portraitFocusDistance: 2.5, // Distance from portrait when focused
    portraitFocusHeight: 1.5, // Height offset when focusing portrait
    portraitFocusSpeed: 0.05, // Speed of zoom to portrait
    roomOffsetDistance: 8, // Distance from room when viewing
    roomViewHeight: 4, // Camera height when viewing room
    lookAtHeight: 3, // Height to look at when viewing room
    entranceDistance: 15 // Distance for entrance hall camera
  },

  // ═══════════════════════════════════════════
  // AUTO TOUR SETTINGS
  // ═══════════════════════════════════════════
  tour: {
    enabled: true,
    intervalDuration: 5000, // Time to show each portrait (ms)
    autoStart: false
  },

  // ═══════════════════════════════════════════
  // PORTRAIT SETTINGS
  // ═══════════════════════════════════════════
  portrait: {
    width: 1.5,
    height: 2,
    depth: 0.05,
    spacing: 3, // Space between portraits
    heightFromFloor: 1.5,
    frameThickness: 0.08,
    frameDepth: 0.12,
    frameColor: 0x1a0a00,
    spotlightIntensity: 40,
    spotlightAngle: Math.PI / 6,
    spotlightPenumbra: 0.3,
    spotlightDistance: 5,
    spotlightDecay: 2
  },

  // ═══════════════════════════════════════════
  // ROOM SETTINGS
  // ═══════════════════════════════════════════
  room: {
    width: 6,
    depth: 12,
    wallHeight: 5,
    wallThickness: 0.2,
    floorThickness: 0.1
  },

  // ═══════════════════════════════════════════
  // EAGLE MONUMENT SETTINGS
  // ═══════════════════════════════════════════
  eagle: {
    enabled: true,
    position: { x: 0, y: 0, z: -5 },
    scale: 2.5,
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.2,
    rotationSpeed: 0.002, // Slow rotation speed
    spotlightColor: 0x8b0000,
    spotlightIntensity: 100,
    enableAnimation: true
  },

  // ═══════════════════════════════════════════
  // INTERACTION SETTINGS
  // ═══════════════════════════════════════════
  interaction: {
    enableKeyboard: true,
    enableMouse: true,
    enableTouch: true,
    hoverHighlight: true,
    clickToFocus: true,
    doubleClickToExit: false
  },

  // ═══════════════════════════════════════════
  // UI SETTINGS
  // ═══════════════════════════════════════════
  ui: {
    showPortraitCounter: true,
    showRoomNavigation: true,
    showTitleBar: true,
    showInfoPanel: true,
    infoPanelPosition: 'left', // 'left', 'right', 'bottom'
    infoPanelMaxWidth: 400
  },

  // ═══════════════════════════════════════════
  // PERFORMANCE SETTINGS
  // ═══════════════════════════════════════════
  performance: {
    autoDetect: true, // Automatically adjust based on FPS
    targetFPS: 60,
    lowPerformanceThreshold: 30, // FPS below this triggers low-perf mode
    disableBloomOnLowPerf: true,
    reduceShadowsOnLowPerf: true
  },

  // ═══════════════════════════════════════════
  // DEBUG SETTINGS
  // ═══════════════════════════════════════════
  debug: {
    enabled: false,
    showStats: false,
    showAxesHelper: false,
    showCameraHelper: false,
    logEvents: false
  }
};

/**
 * Helper function to get nested config values safely
 * @param {string} path - Dot notation path (e.g., 'scene.fog.color')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} The config value or default
 */
export function getConfig(path, defaultValue = null) {
  const keys = path.split('.');
  let value = CONFIG;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return value;
}

/**
 * Helper function to update config values at runtime
 * @param {string} path - Dot notation path
 * @param {*} value - New value to set
 */
export function setConfig(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let target = CONFIG;
  
  for (const key of keys) {
    if (!(key in target)) {
      target[key] = {};
    }
    target = target[key];
  }
  
  target[lastKey] = value;
}
