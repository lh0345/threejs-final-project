/**
 * SCENE.JS - Three.js Scene, Camera, Renderer, Controls & Lighting
 * 
 * @module scene
 * @description Core Three.js setup including scene, camera, renderer, post-processing, and lighting
 * All visual components are configured here and exported for use in other modules
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

// ═══════════════════════════════════════════
// SCENE
// ═══════════════════════════════════════════
/**
 * Main Three.js scene containing all 3D objects
 * @type {THREE.Scene}
 * @exports
 */
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0505);

// FOG FOR DEPTH - Dark Albanian theme
scene.fog = new THREE.Fog(0x0a0505, 12, 45);

// ═══════════════════════════════════════════
// CAMERA
// ═══════════════════════════════════════════
/**
 * Perspective camera for viewing the 3D scene
 * @type {THREE.PerspectiveCamera}
 * @exports
 */
export const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4, 22);

// ═══════════════════════════════════════════
// RENDERER WITH SHADOWS
// ═══════════════════════════════════════════
/**
 * WebGL renderer with shadow mapping and tone mapping
 * @type {THREE.WebGLRenderer}
 * @exports
 */
export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

document.body.appendChild(renderer.domElement);

// ═══════════════════════════════════════════
// POST-PROCESSING
// ═══════════════════════════════════════════
/**
 * Effect composer for post-processing passes (bloom, anti-aliasing)
 * @type {EffectComposer}
 * @exports
 */
export const composer = new EffectComposer(renderer);

// Render pass
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom pass - subtle glow on lights
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.4,    // strength
  0.4,    // radius
  0.85    // threshold
);
composer.addPass(bloomPass);

// SMAA anti-aliasing (better than FXAA)
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
composer.addPass(smaaPass);

// ═══════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════
/**
 * Orbit controls for camera movement
 * @type {OrbitControls}
 * @exports
 */
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 3); // Look into the museum from entrance

// ═══════════════════════════════════════════
// MATERIALS - Albanian dark theme
// ═══════════════════════════════════════════
/**
 * Default floor material
 * @type {THREE.MeshStandardMaterial}
 * @exports
 */
export const floorMat = new THREE.MeshStandardMaterial({ color: 0x120808, roughness: 0.85 });

/**
 * Default wall material
 * @type {THREE.MeshStandardMaterial}
 * @exports
 */
export const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a0d0d, roughness: 0.6, metalness: 0.1 });

// ─────────────────────────────────────────────
// LIGHTING WITH SHADOWS
// ─────────────────────────────────────────────

// Ambient light (increased for better visibility)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Main directional light with shadows (increased intensity)
const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
mainLight.position.set(5, 15, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -30;
mainLight.shadow.camera.right = 30;
mainLight.shadow.camera.top = 30;
mainLight.shadow.camera.bottom = -30;
mainLight.shadow.bias = -0.0001;
scene.add(mainLight);

// Albanian Red accent lights (increased for atmosphere)
const rimLight = new THREE.DirectionalLight(0xff3333, 0.5);
rimLight.position.set(-10, 6, -10);
scene.add(rimLight);

const rimLight2 = new THREE.DirectionalLight(0xff2020, 0.4);
rimLight2.position.set(10, 6, -10);
scene.add(rimLight2);

const warmAccent = new THREE.PointLight(0xff6644, 0.8, 15);
warmAccent.position.set(0, 2.5, 0);
scene.add(warmAccent);

// Floor detail grid (visual scale reference) - Red accents
const grid = new THREE.GridHelper(60, 30, 0x3a1515, 0x150808);
grid.material.opacity = 0.25;
grid.material.transparent = true;
scene.add(grid);

// ─────────────────────────────────────────────
// HANDLE RESIZE
// ─────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
