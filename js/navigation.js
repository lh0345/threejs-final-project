/**
 * NAVIGATION.JS - Room Navigation System
 * 
 * @module navigation
 * @description Smooth camera transitions between museum rooms
 */

import * as THREE from 'three';
import { camera, controls } from './scene.js';
import { CONFIG } from './config.js';

/**
 * Room positions and configurations
 * @type {Object.<string, {x: number, z: number, facing: string}>}
 */
export const roomPositions = {
  'entrance': { x: 0, z: 18, facing: 'front' },
  'historical': { x: -10, z: 0, facing: 'right' },
  'scientists': { x: -10, z: -14, facing: 'right' },
  'actors': { x: -10, z: -28, facing: 'right' },
  'international': { x: 10, z: 0, facing: 'left' },
  'singers': { x: 10, z: -14, facing: 'left' },
  'events': { x: 10, z: -28, facing: 'left' },
};

// Navigation state
export let navigationTarget = null;
export let isNavigating = false;
let navProgress = 0;
let navStartPos = null;
let navStartTarget = null;
let navEndPos = null;
let navEndTarget = null;
let navCrossingSides = false;

// Exported state setters
export function setNavigating(value) {
  isNavigating = value;
}

export function setNavigationTarget(value) {
  navigationTarget = value;
}

/**
 * Navigate to a specific room
 */
export function navigateToRoom(roomId, clearFocusCallback) {
  const roomPos = roomPositions[roomId];
  
  if (!roomPos) return;
  
  // Clear any portrait focus via callback
  if (clearFocusCallback) {
    clearFocusCallback();
  }
  
  // Calculate camera position based on room facing
  let cameraX, cameraZ, lookAtZ;
  if (roomPos.facing === 'right') {
    cameraX = roomPos.x + CONFIG.navigation.roomOffsetDistance;
    cameraZ = roomPos.z;
    lookAtZ = roomPos.z;
  } else if (roomPos.facing === 'left') {
    cameraX = roomPos.x - CONFIG.navigation.roomOffsetDistance;
    cameraZ = roomPos.z;
    lookAtZ = roomPos.z;
  } else {
    // Front facing (entrance hall)
    cameraX = roomPos.x;
    cameraZ = roomPos.z + CONFIG.navigation.entranceDistance;
    lookAtZ = roomPos.z - CONFIG.navigation.entranceDistance;
  }
  
  // Store start and end positions
  navStartPos = camera.position.clone();
  navStartTarget = controls.target.clone();
  navEndPos = new THREE.Vector3(cameraX, CONFIG.navigation.roomViewHeight, cameraZ);
  navEndTarget = new THREE.Vector3(roomPos.x, CONFIG.navigation.lookAtHeight, lookAtZ);
  
  // Check if crossing sides
  navCrossingSides = (navStartPos.x < 0 && navEndPos.x > 0) || (navStartPos.x > 0 && navEndPos.x < 0);
  
  // Set navigation
  isNavigating = true;
  navProgress = 0;
  
  navigationTarget = {
    cameraPos: navEndPos,
    lookAt: navEndTarget
  };
  
  // Update active button state
  document.querySelectorAll('.room-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[data-room="${roomId}"]`);
  if (btn) btn.classList.add('active');
}

/**
 * Update navigation animation
 */
export function updateNavigation() {
  if (!isNavigating || !navigationTarget) return;
  
  navProgress += 0.012; // Balanced speed
  
  if (navProgress >= 1) {
    navProgress = 1;
    isNavigating = false;
  }
  
  // Smooth easing function
  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const t = easeInOutQuad(navProgress);
  
  if (navCrossingSides) {
    // When crossing sides, go through the center hallway
    const midX = 0;
    const midZ = (navStartPos.z + navEndPos.z) / 2;
    const midPoint = new THREE.Vector3(midX, CONFIG.navigation.roomViewHeight, midZ);
    
    if (t < 0.5) {
      // First half: move to center
      const t2 = t * 2;
      camera.position.lerpVectors(navStartPos, midPoint, t2);
      // Look toward center first, then toward destination
      const lookX = navStartTarget.x * (1 - t2);
      controls.target.set(lookX, CONFIG.navigation.lookAtHeight, midZ);
    } else {
      // Second half: move to destination
      const t2 = (t - 0.5) * 2;
      camera.position.lerpVectors(midPoint, navEndPos, t2);
      controls.target.lerpVectors(
        new THREE.Vector3(0, CONFIG.navigation.lookAtHeight, midZ),
        navEndTarget,
        t2
      );
    }
    
  } else {
    // Simple smooth interpolation for same-side navigation
    camera.position.lerpVectors(navStartPos, navEndPos, t);
    controls.target.lerpVectors(navStartTarget, navEndTarget, t);
  }
  
  // Snap to final position when done
  if (navProgress >= 1) {
    camera.position.copy(navEndPos);
    controls.target.copy(navEndTarget);
  }
}

/**
 * Cancel any ongoing navigation
 */
export function cancelNavigation() {
  isNavigating = false;
  navigationTarget = null;
  document.querySelectorAll('.room-btn').forEach(b => b.classList.remove('active'));
}

/**
 * Initialize room navigation buttons
 */
export function initRoomNavigation(clearFocusCallback) {
  document.querySelectorAll('.room-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const roomId = btn.dataset.room;
      navigateToRoom(roomId, clearFocusCallback);
    });
  });
}
