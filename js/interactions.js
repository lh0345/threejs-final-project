/**
 * INTERACTIONS.JS - Click handling, Auto Tour, Keyboard Events, Animation Loop
 */

import * as THREE from 'three';
import { scene, camera, controls, renderer, composer } from './scene.js';
import { exhibits } from './portraits.js';
import { eagleModel } from './rooms.js';
import { stopLoaderAnimation } from './loader.js';
import { updateNavigation, cancelNavigation, initRoomNavigation, navigateToRoom, roomPositions, isNavigating } from './navigation.js';

// State
let focusTarget = null;
let isLocked = false;
let currentPortraitIndex = 0;
let isTouring = false;
let tourInterval = null;
let pendingPortraitFocus = null; // For delayed portrait focus after room navigation

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// DOM elements
const infoEl = document.getElementById('info');
const portraitCounterEl = document.getElementById('portrait-counter');
const currentPortraitEl = document.getElementById('current-portrait');
const tourBtn = document.getElementById('auto-tour-btn');
const ambientAudio = document.getElementById('ambient-audio');
const soundBtn = document.getElementById('sound-btn');

// ─────────────────────────────────────────────
// HELPER: Get room ID from portrait position
// ─────────────────────────────────────────────
function getRoomFromPortrait(portrait) {
  const pos = new THREE.Vector3();
  portrait.getWorldPosition(pos);
  
  // Match position to room
  for (const [roomId, roomPos] of Object.entries(roomPositions)) {
    if (roomId === 'entrance') continue;
    const dx = Math.abs(pos.x - roomPos.x);
    const dz = Math.abs(pos.z - roomPos.z);
    if (dx < 8 && dz < 8) {
      return roomId;
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// HELPER: Clear Portrait Focus
// ─────────────────────────────────────────────
function clearFocus() {
  if (isLocked) {
    isLocked = false;
    focusTarget = null;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.enableZoom = true;
    infoEl.style.display = 'none';
    portraitCounterEl.style.display = 'none';
  }
}

// ─────────────────────────────────────────────
// HELPER: Clear focus and navigate to room
// ─────────────────────────────────────────────
function clearFocusAndGoToRoom() {
  if (isLocked && focusTarget) {
    const roomId = getRoomFromPortrait(focusTarget);
    clearFocus();
    if (roomId) {
      navigateToRoom(roomId, null);
    }
  } else {
    clearFocus();
  }
}

// ─────────────────────────────────────────────
// HELPER: Update Info Panel
// ─────────────────────────────────────────────
function updateInfoPanel(target, showTourHint = false) {
  let infoHtml = `<h3>${target.userData.label}</h3>`;
  if (target.userData.years) {
    infoHtml += `<div class="years">${target.userData.years}</div>`;
  }
  if (target.userData.description) {
    infoHtml += `<div class="description">${target.userData.description}</div>`;
  }
  if (target.userData.achievement) {
    infoHtml += `<div class="achievement">🏆 ${target.userData.achievement}</div>`;
  }
  if (target.userData.quote) {
    infoHtml += `<div class="quote">${target.userData.quote}</div>`;
  }
  if (target.userData.wiki) {
    infoHtml += `<a href="${target.userData.wiki}" target="_blank" class="wiki-link">📖 Learn More on Wikipedia</a>`;
  }
  if (showTourHint) {
    infoHtml += `<div class="close-hint">Auto Tour • Press ESC to exit</div>`;
  } else {
    infoHtml += `<div class="close-hint">Press ESC to exit • Arrow keys to navigate</div>`;
  }
  infoEl.innerHTML = infoHtml;
}

// ─────────────────────────────────────────────
// AMBIENT SOUND SYSTEM
// ─────────────────────────────────────────────
let isSoundPlaying = false;
ambientAudio.volume = 0.2;

soundBtn.addEventListener('click', () => {
  if (isSoundPlaying) {
    ambientAudio.pause();
    soundBtn.textContent = '🔇';
    soundBtn.classList.remove('playing');
    isSoundPlaying = false;
  } else {
    ambientAudio.play().catch(e => console.log('Audio play failed:', e));
    soundBtn.textContent = '🔊';
    soundBtn.classList.add('playing');
    isSoundPlaying = true;
  }
});

// ─────────────────────────────────────────────
// AUTO TOUR SYSTEM
// ─────────────────────────────────────────────
tourBtn.addEventListener('click', () => {
  if (isTouring) {
    // Stop tour
    isTouring = false;
    clearInterval(tourInterval);
    tourBtn.textContent = '▶ Start Tour';
    tourBtn.classList.remove('touring');
  } else {
    // Start tour
    isTouring = true;
    tourBtn.textContent = '⏹ Stop Tour';
    tourBtn.classList.add('touring');
    
    currentPortraitIndex = 0;
    
    function showNextPortrait() {
      if (!isTouring) return;
      
      focusTarget = exhibits[currentPortraitIndex];
      isLocked = true;
      
      portraitCounterEl.style.display = 'block';
      currentPortraitEl.textContent = currentPortraitIndex + 1;
      
      controls.enableRotate = false;
      controls.enablePan = false;
      controls.enableZoom = false;
      
      infoEl.style.display = 'block';
      updateInfoPanel(focusTarget, true);
      
      currentPortraitIndex = (currentPortraitIndex + 1) % exhibits.length;
      
      // Stop at the end
      if (currentPortraitIndex === 0) {
        setTimeout(() => {
          if (isTouring) {
            isTouring = false;
            clearInterval(tourInterval);
            tourBtn.textContent = '▶ Start Tour';
            tourBtn.classList.remove('touring');
          }
        }, 4000);
      }
    }
    
    showNextPortrait();
    tourInterval = setInterval(showNextPortrait, 4000);
  }
});

// ─────────────────────────────────────────────
// CLICK TO FOCUS
// ─────────────────────────────────────────────
window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(exhibits, true);

  if (hits.length > 0) {
    focusTarget = hits[0].object;
    isLocked = true;
    
    currentPortraitIndex = exhibits.indexOf(focusTarget) + 1;

    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;

    portraitCounterEl.style.display = 'block';
    currentPortraitEl.textContent = currentPortraitIndex;

    infoEl.style.display = 'block';
    updateInfoPanel(focusTarget);
  }
});

// ─────────────────────────────────────────────
// KEYBOARD EVENTS
// ─────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Stop auto tour if running
    if (isTouring) {
      isTouring = false;
      clearInterval(tourInterval);
      tourBtn.textContent = '▶ Start Tour';
      tourBtn.classList.remove('touring');
    }
    
    // Exit portrait focus and go back to room view
    clearFocusAndGoToRoom();
  }
  
  // Arrow key navigation between portraits
  if (isLocked && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    let newIndex = currentPortraitIndex - 1;
    
    if (e.key === 'ArrowRight') {
      newIndex = (newIndex - 1 + exhibits.length) % exhibits.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (newIndex + 1) % exhibits.length;
    }
    
    const newPortrait = exhibits[newIndex];
    const currentRoom = focusTarget ? getRoomFromPortrait(focusTarget) : null;
    const newRoom = getRoomFromPortrait(newPortrait);
    
    // Check if we're changing rooms
    if (currentRoom && newRoom && currentRoom !== newRoom) {
      // Different room - navigate to room first, then focus portrait
      clearFocus();
      pendingPortraitFocus = { portrait: newPortrait, index: newIndex };
      navigateToRoom(newRoom, null);
    } else {
      // Same room - just switch portrait
      focusTarget = newPortrait;
      currentPortraitIndex = newIndex + 1;
      
      currentPortraitEl.textContent = currentPortraitIndex;
      updateInfoPanel(focusTarget);
    }
  }
});

// ─────────────────────────────────────────────
// ANIMATION LOOP
// ─────────────────────────────────────────────
let wasNavigating = false;

function animate() {
  requestAnimationFrame(animate);

  // Rotate the eagle model
  if (eagleModel) {
    eagleModel.rotation.y += 0.005;
  }

  // Check if room navigation just completed - focus pending portrait
  if (wasNavigating && !isNavigating && pendingPortraitFocus) {
    // Small delay to let the view settle
    setTimeout(() => {
      if (pendingPortraitFocus) {
        focusTarget = pendingPortraitFocus.portrait;
        currentPortraitIndex = pendingPortraitFocus.index + 1;
        isLocked = true;
        
        controls.enableRotate = false;
        controls.enablePan = false;
        controls.enableZoom = false;
        
        portraitCounterEl.style.display = 'block';
        currentPortraitEl.textContent = currentPortraitIndex;
        
        infoEl.style.display = 'block';
        updateInfoPanel(focusTarget);
        
        pendingPortraitFocus = null;
      }
    }, 300);
  }
  wasNavigating = isNavigating;

  if (focusTarget && isLocked) {
    const targetPos = new THREE.Vector3();
    focusTarget.getWorldPosition(targetPos);
    
    let cameraOffset = new THREE.Vector3(0, 0, 3.5);
    
    const facing = focusTarget.userData.facing;
    if (facing === 'right') {
      cameraOffset = new THREE.Vector3(3.5, 0, 0);
    } else if (facing === 'left') {
      cameraOffset = new THREE.Vector3(-3.5, 0, 0);
    }
    
    camera.position.lerp(
      new THREE.Vector3(
        targetPos.x + cameraOffset.x,
        targetPos.y,
        targetPos.z + cameraOffset.z
      ),
      0.06
    );
    controls.target.lerp(targetPos, 0.08);
  }
  
  // Room navigation animation
  updateNavigation();

  controls.update();
  composer.render(); // Use post-processing composer
}

// ─────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────
export function initInteractions() {
  // Initialize room navigation with callback to clear focus
  initRoomNavigation(clearFocus);
  
  // Start animation loop
  animate();
  
  // Hide loading screen after everything is ready
  setTimeout(() => {
    stopLoaderAnimation();
    document.getElementById('loading-screen').classList.add('hidden');
  }, 2200);
}
