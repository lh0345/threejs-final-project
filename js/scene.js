/**
 * SCENE.JS - Three.js Scene, Camera, Renderer, Controls & Lighting
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
// RENDERER
// ─────────────────────────────────────────────
export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
document.body.appendChild(renderer.domElement);

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
// LIGHTING
// ─────────────────────────────────────────────

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Main directional light
const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(5, 10, 5);
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
});
