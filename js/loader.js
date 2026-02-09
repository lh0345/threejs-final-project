/**
 * LOADER.JS - 3D Eagle loading animation with progress tracking
 * 
 * @module loader
 * @description Loading screen animation and progress tracking
 */

import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { CONFIG } from './config.js';

// ═══════════════════════════════════════════
// Loading Progress Tracking
// ═══════════════════════════════════════════
const loadingManager = {
  total: 0,
  loaded: 0,
  startTime: Date.now(),
  minLoadTime: CONFIG.loading.minLoadTime, // Minimum time to show loading screen (ms)
};

const loadingBar = document.querySelector('.loading-bar');
const loadingScreen = document.getElementById('loading-screen');

/**
 * Updates the loading progress bar
 * @param {number} progress - Progress between 0 and 1
 */
function updateLoadingProgress(progress) {
  if (loadingBar) {
    loadingBar.style.width = `${progress * 100}%`;
  }
}

/**
 * Registers a new asset to be loaded
 * @returns {Function} Callback to call when asset is loaded
 */
export function registerAsset() {
  loadingManager.total++;
  
  return function onAssetLoaded() {
    loadingManager.loaded++;
    const progress = loadingManager.loaded / loadingManager.total;
    updateLoadingProgress(progress);
    
    // Check if all assets are loaded
    if (loadingManager.loaded >= loadingManager.total) {
      checkLoadingComplete();
    }
  };
}

/**
 * Checks if minimum load time has elapsed
 */
function checkLoadingComplete() {
  const elapsed = Date.now() - loadingManager.startTime;
  const remaining = Math.max(0, loadingManager.minLoadTime - elapsed);
  
  setTimeout(() => {
    hideLoadingScreen();
  }, remaining);
}

/**
 * Hides the loading screen
 */
function hideLoadingScreen() {
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    
    // Clean up after transition
    setTimeout(() => {
      stopLoaderAnimation();
    }, 800); // Match CSS transition duration
  }
}

// ═══════════════════════════════════════════
// Loading Screen 3D Eagle Animation
// ═══════════════════════════════════════════

// Setup mini scene for loading screen
const canvas = document.getElementById('loading-eagle-canvas');
const loaderScene = new THREE.Scene();
const loaderCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
loaderCamera.position.set(0, 0, 5);

const loaderRenderer = new THREE.WebGLRenderer({ 
  canvas: canvas, 
  alpha: true, 
  antialias: true 
});
loaderRenderer.setSize(200, 200);
loaderRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
loaderScene.add(ambientLight);

const frontLight = new THREE.DirectionalLight(0xffffff, 1);
frontLight.position.set(0, 2, 5);
loaderScene.add(frontLight);

const backLight = new THREE.DirectionalLight(CONFIG.materials.rope.color, 0.5);
backLight.position.set(0, -2, -5);
loaderScene.add(backLight);

// Load and display eagle
let loaderEagle = null;
let loaderAnimationId = null;

const eagleAssetLoaded = registerAsset();

const stlLoader = new STLLoader();
stlLoader.load(
  '3d/Albanian_Eagle.stl',
  (geometry) => {
    geometry.center();
    
    const material = new THREE.MeshStandardMaterial({
      color: CONFIG.loading.eagleColor,
      roughness: CONFIG.loading.eagleRoughness,
      metalness: CONFIG.loading.eagleMetalness,
      side: THREE.DoubleSide
    });
    
    loaderEagle = new THREE.Mesh(geometry, material);
    
    // Scale to fit view
    const box = new THREE.Box3().setFromObject(loaderEagle);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.5 / maxDim;
    loaderEagle.scale.setScalar(scale);
    
    loaderScene.add(loaderEagle);
    
    // Start animation
    animateLoader();
    
    // Mark asset as loaded
    eagleAssetLoaded();
  },
  (xhr) => {
    // Progress callback for STL loading
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total;
      updateLoadingProgress(percentComplete * 0.5); // Eagle is 50% of loading
    }
  },
  (error) => {
    console.error('Loader eagle failed to load:', error);
    
    // Fallback: simple rotating cube
    try {
      const fallbackGeom = new THREE.BoxGeometry(1.5, 1.5, 0.2);
      const fallbackMat = new THREE.MeshStandardMaterial({ 
        color: CONFIG.loading.eagleColor, 
        metalness: CONFIG.loading.eagleMetalness 
      });
      loaderEagle = new THREE.Mesh(fallbackGeom, fallbackMat);
      loaderScene.add(loaderEagle);
      animateLoader();
    } catch (fallbackError) {
      console.error('Fallback loader also failed:', fallbackError);
    }
    
    // Still mark as loaded even on error
    eagleAssetLoaded();
  }
);

/**
 * Animation loop for the loading screen
 */
function animateLoader() {
  loaderAnimationId = requestAnimationFrame(animateLoader);
  
  if (loaderEagle) {
    loaderEagle.rotation.y += CONFIG.loading.rotationSpeed;
  }
  
  loaderRenderer.render(loaderScene, loaderCamera);
}

/**
 * Stops the loader animation and cleans up resources
 */
export function stopLoaderAnimation() {
  if (loaderAnimationId) {
    cancelAnimationFrame(loaderAnimationId);
    loaderAnimationId = null;
  }
  
  // Dispose resources to free memory
  if (loaderEagle) {
    if (loaderEagle.geometry) {
      loaderEagle.geometry.dispose();
    }
    if (loaderEagle.material) {
      loaderEagle.material.dispose();
    }
  }
  
  if (loaderRenderer) {
    loaderRenderer.dispose();
  }
  
  // Clear the scene
  while (loaderScene.children.length > 0) {
    loaderScene.remove(loaderScene.children[0]);
  }
}
