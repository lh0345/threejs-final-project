/**
 * SCENE.JS - Three.js Scene, Camera, Renderer, Controls & Lighting
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

// ─────────────────────────────────────────────
// SCENE
// ─────────────────────────────────────────────
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0505);

// FOG FOR DEPTH (kills flatness) - Dark Albanian theme
scene.fog = new THREE.Fog(0x0a0505, 12, 45);

// ─────────────────────────────────────────────
// CAMERA
// ─────────────────────────────────────────────
export const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4, 22);

// ─────────────────────────────────────────────
// RENDERER WITH SHADOWS
// ─────────────────────────────────────────────
export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

document.body.appendChild(renderer.domElement);

// ─────────────────────────────────────────────
// POST-PROCESSING
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// CONTROLS
// ─────────────────────────────────────────────
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 3); // Look into the museum from entrance

// ─────────────────────────────────────────────
// MATERIALS - Albanian dark theme
// ─────────────────────────────────────────────
export const floorMat = new THREE.MeshStandardMaterial({ color: 0x120808, roughness: 0.85 });
export const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a0d0d, roughness: 0.6, metalness: 0.1 });

// ─────────────────────────────────────────────
// LIGHTING WITH SHADOWS
// ─────────────────────────────────────────────

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

// Main directional light with shadows
const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
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

// Albanian Red accent lights
const rimLight = new THREE.DirectionalLight(0xff3333, 0.3);
rimLight.position.set(-10, 6, -10);
scene.add(rimLight);

const rimLight2 = new THREE.DirectionalLight(0xff2020, 0.25);
rimLight2.position.set(10, 6, -10);
scene.add(rimLight2);

const warmAccent = new THREE.PointLight(0xff6644, 0.5, 10);
warmAccent.position.set(0, 2.5, 0);
scene.add(warmAccent);

// Floor detail grid (visual scale reference) - Red accents
const grid = new THREE.GridHelper(60, 30, 0x3a1515, 0x150808);
grid.material.opacity = 0.35;
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
