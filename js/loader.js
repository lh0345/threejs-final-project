/**
 * LOADER.JS - 3D Eagle loading animation
 */

import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

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

const backLight = new THREE.DirectionalLight(0x8b0000, 0.5);
backLight.position.set(0, -2, -5);
loaderScene.add(backLight);

// Load and display eagle
let loaderEagle = null;
let loaderAnimationId = null;

const stlLoader = new STLLoader();
stlLoader.load(
  '3d/Albanian_Eagle.stl',
  (geometry) => {
    geometry.center();
    
    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.8,
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
  },
  undefined,
  (error) => {
    console.error('Loader eagle failed:', error);
    // Fallback: simple rotating cube
    const fallbackGeom = new THREE.BoxGeometry(1.5, 1.5, 0.2);
    const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
    loaderEagle = new THREE.Mesh(fallbackGeom, fallbackMat);
    loaderScene.add(loaderEagle);
    animateLoader();
  }
);

function animateLoader() {
  loaderAnimationId = requestAnimationFrame(animateLoader);
  
  if (loaderEagle) {
    loaderEagle.rotation.y += 0.02;
  }
  
  loaderRenderer.render(loaderScene, loaderCamera);
}

// Export cleanup function
export function stopLoaderAnimation() {
  if (loaderAnimationId) {
    cancelAnimationFrame(loaderAnimationId);
    loaderAnimationId = null;
  }
  // Dispose resources
  if (loaderEagle) {
    loaderEagle.geometry.dispose();
    loaderEagle.material.dispose();
  }
  loaderRenderer.dispose();
}
