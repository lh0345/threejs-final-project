/**
 * SCENE.JS - Three.js Scene, Camera, Renderer, Controls & Lighting
 * 
 * @module scene
 * @description Core Three.js setup with scene, camera, renderer, post-processing, and lighting
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { CONFIG } from './config.js';

// ═══════════════════════════════════════════
// SCENE
// ═══════════════════════════════════════════
/**
 * Main Three.js scene
 * @type {THREE.Scene}
 * @exports
 */
export const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.scene.backgroundColor);

// FOG FOR DEPTH - Dark Albanian theme
scene.fog = new THREE.Fog(CONFIG.scene.fog.color, CONFIG.scene.fog.near, CONFIG.scene.fog.far);

// ═══════════════════════════════════════════
// CAMERA
// ═══════════════════════════════════════════
/**
 * Perspective camera
 * @type {THREE.PerspectiveCamera}
 * @exports
 */
export const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, window.innerWidth / window.innerHeight, CONFIG.camera.near, CONFIG.camera.far);
camera.position.set(CONFIG.camera.initialPosition.x, CONFIG.camera.initialPosition.y, CONFIG.camera.initialPosition.z);

// ═══════════════════════════════════════════
// RENDERER WITH SHADOWS
// ═══════════════════════════════════════════
/**
 * WebGL renderer with shadows and tone mapping
 * @type {THREE.WebGLRenderer}
 * @exports
 */
export const renderer = new THREE.WebGLRenderer({ antialias: CONFIG.renderer.antialias, powerPreference: CONFIG.renderer.powerPreference });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.renderer.maxPixelRatio));

// Enable shadow mapping
renderer.shadowMap.enabled = CONFIG.renderer.shadowMapEnabled;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = CONFIG.renderer.toneMappingExposure;

document.body.appendChild(renderer.domElement);

// ═══════════════════════════════════════════
// POST-PROCESSING
// ═══════════════════════════════════════════
/**
 * Effect composer for post-processing
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
  CONFIG.postProcessing.bloom.strength,
  CONFIG.postProcessing.bloom.radius,
  CONFIG.postProcessing.bloom.threshold
);
composer.addPass(bloomPass);

// SMAA anti-aliasing (better than FXAA)
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
composer.addPass(smaaPass);

// ═══════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════
/**
 * Orbit controls
 * @type {OrbitControls}
 * @exports
 */
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = CONFIG.controls.enableDamping;
controls.dampingFactor = CONFIG.controls.dampingFactor;
controls.target.set(CONFIG.controls.initialTarget.x, CONFIG.controls.initialTarget.y, CONFIG.controls.initialTarget.z); // Look into the museum from entrance

// ═══════════════════════════════════════════
// MATERIALS - Albanian dark theme
// ═══════════════════════════════════════════
/**
 * Default floor material
 * @type {THREE.MeshStandardMaterial}
 * @exports
 */
export const floorMat = new THREE.MeshStandardMaterial({ color: CONFIG.materials.floor.color, roughness: CONFIG.materials.floor.roughness });

/**
 * Default wall material
 * @type {THREE.MeshStandardMaterial}
 * @exports
 */
export const wallMat = new THREE.MeshStandardMaterial({ color: CONFIG.materials.wall.color, roughness: CONFIG.materials.wall.roughness, metalness: CONFIG.materials.wall.metalness });

// ─────────────────────────────────────────────
// LIGHTING WITH SHADOWS
// ─────────────────────────────────────────────

// Ambient light (increased for better visibility)
const ambientLight = new THREE.AmbientLight(CONFIG.lighting.ambient.color, CONFIG.lighting.ambient.intensity);
scene.add(ambientLight);

// Main directional light with shadows (increased intensity)
const mainLight = new THREE.DirectionalLight(CONFIG.lighting.main.color, CONFIG.lighting.main.intensity);
mainLight.position.set(CONFIG.lighting.main.position.x, CONFIG.lighting.main.position.y, CONFIG.lighting.main.position.z);
mainLight.castShadow = CONFIG.lighting.main.castShadow;
mainLight.shadow.mapSize.width = CONFIG.lighting.main.shadowMapSize;
mainLight.shadow.mapSize.height = CONFIG.lighting.main.shadowMapSize;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -30;
mainLight.shadow.camera.right = 30;
mainLight.shadow.camera.top = 30;
mainLight.shadow.camera.bottom = -30;
mainLight.shadow.bias = CONFIG.lighting.main.shadowBias;
scene.add(mainLight);

// Albanian Red accent lights (subtle for atmosphere)
const rimLight = new THREE.DirectionalLight(0xff3333, 0.25);
rimLight.position.set(-10, 6, -10);
scene.add(rimLight);

const rimLight2 = new THREE.DirectionalLight(0xff2020, 0.2);
rimLight2.position.set(10, 6, -10);
scene.add(rimLight2);

const warmAccent = new THREE.PointLight(0xff6644, 0.4, 15);
warmAccent.position.set(0, 2.5, 0);
scene.add(warmAccent);

// Floor detail grid (visual scale reference) - Red accents
const grid = new THREE.GridHelper(60, 30, 0x3a1515, 0x150808);
grid.material.opacity = 0.15;
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
