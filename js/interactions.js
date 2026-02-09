/**
 * INTERACTIONS.JS - Click handling, Auto Tour, Keyboard Events, Animation Loop
 * 
 * @module interactions
 * @description Manages user interactions with clicks, keyboard, audio, and animations
 */

import * as THREE from 'three';
import { scene, camera, controls, renderer, composer } from './scene.js';
import { exhibits } from './portraits.js';
import { eagleModel } from './rooms.js';
import { stopLoaderAnimation } from './loader.js';
import { updateNavigation, cancelNavigation, initRoomNavigation, navigateToRoom, roomPositions, isNavigating } from './navigation.js';
import { CONFIG } from './config.js';

// State
let focusTarget = null;
let isLocked = false;
let currentPortraitIndex = 0;
let isTouring = false;
let tourInterval = null;
let pendingPortraitFocus = null; // For delayed portrait focus after room navigation

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// DOM elements with safety checks
const infoEl = document.getElementById('info');
const portraitCounterEl = document.getElementById('portrait-counter');
const currentPortraitEl = document.getElementById('current-portrait');
const tourBtn = document.getElementById('auto-tour-btn');
const ambientAudio = document.getElementById('ambient-audio');
const soundBtn = document.getElementById('sound-btn');

// ═══════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════

/**
 * Logs errors without breaking the application
 * @param {string} context - Context where error occurred
 * @param {Error} error - The error object
 */
function logError(context, error) {
  console.error(`[${context}]`, error);
  // Could send to analytics/monitoring service here
}

/**
 * Updates DOM element text content
 * @param {HTMLElement} element - DOM element to update
 * @param {string} content - Text content to set
 */
function safeSetContent(element, content) {
  try {
    if (element) {
      element.textContent = content;
    }
  } catch (error) {
    logError('safeSetContent', error);
  }
}

/**
 * Updates DOM element innerHTML
 * @param {HTMLElement} element - DOM element to update
 * @param {string} html - HTML content to set
 */
function safeSetHTML(element, html) {
  try {
    if (element) {
      element.innerHTML = html;
    }
  } catch (error) {
    logError('safeSetHTML', error);
  }
}

/**
 * Toggles CSS classes
 * @param {HTMLElement} element - DOM element to modify
 * @param {string} className - Class name to toggle
 * @param {boolean} add - True to add, false to remove
 */
function safeToggleClass(element, className, add) {
  try {
    if (element) {
      if (add) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  } catch (error) {
    logError('safeToggleClass', error);
  }
}

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
  try {
    if (isLocked) {
      isLocked = false;
      focusTarget = null;
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.enableZoom = true;
      
      if (infoEl) infoEl.style.display = 'none';
      if (portraitCounterEl) portraitCounterEl.style.display = 'none';
    }
  } catch (error) {
    logError('clearFocus', error);
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
/**
 * Updates the info panel with portrait information
 * @param {THREE.Object3D} target - The portrait object
 * @param {boolean} showTourHint - Whether to show tour hints
 */
function updateInfoPanel(target, showTourHint = false) {
  try {
    if (!target || !target.userData) return;
    
    let infoHtml = `<h3>${target.userData.label || 'Unknown'}</h3>`;
    
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
      infoHtml += `<a href="${target.userData.wiki}" target="_blank" rel="noopener noreferrer" class="wiki-link">📖 Learn More on Wikipedia</a>`;
    }
    
    if (showTourHint) {
      infoHtml += `<div class="close-hint">Auto Tour • Press ESC to exit</div>`;
    } else {
      infoHtml += `<div class="close-hint">Press ESC to exit • Arrow keys to navigate</div>`;
    }
    
    safeSetHTML(infoEl, infoHtml);
  } catch (error) {
    logError('updateInfoPanel', error);
  }
}

// ─────────────────────────────────────────────
// AMBIENT SOUND SYSTEM WITH ERROR HANDLING
// ─────────────────────────────────────────────
let isSoundPlaying = false;
let audioLoadFailed = false;

// Configure audio with error handling
if (ambientAudio) {
  try {
    ambientAudio.volume = CONFIG.audio.defaultVolume;
    
    // Handle audio loading errors
    ambientAudio.addEventListener('error', (e) => {
      audioLoadFailed = true;
      logError('Audio loading failed', e);
      
      // Update UI to show audio unavailable
      if (soundBtn) {
        soundBtn.textContent = '🔇';
        soundBtn.disabled = true;
        soundBtn.title = 'Audio unavailable';
      }
    });
    
    // Handle successful audio load
    ambientAudio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded successfully');
    });
  } catch (error) {
    logError('Audio configuration', error);
    audioLoadFailed = true;
  }
}

// Sound button click handler with error handling
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    try {
      if (audioLoadFailed || !ambientAudio) {
        console.warn('Audio is unavailable');
        return;
      }
      
      if (isSoundPlaying) {
        ambientAudio.pause();
        safeSetContent(soundBtn, '🔇');
        safeToggleClass(soundBtn, 'playing', false);
        isSoundPlaying = false;
      } else {
        // Play with promise handling for autoplay policies
        const playPromise = ambientAudio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              safeSetContent(soundBtn, '🔊');
              safeToggleClass(soundBtn, 'playing', true);
              isSoundPlaying = true;
            })
            .catch(error => {
              logError('Audio playback', error);
              // Browser autoplay policy prevented playback
              console.warn('Audio autoplay blocked. User interaction required.');
            });
        }
      }
    } catch (error) {
      logError('Sound button click', error);
    }
  });
} else {
  console.warn('Sound button element not found');
}

// ─────────────────────────────────────────────
// AUTO TOUR SYSTEM WITH ERROR HANDLING
// ─────────────────────────────────────────────
if (tourBtn) {
  tourBtn.addEventListener('click', () => {
    try {
      if (isTouring) {
        // Stop tour
        isTouring = false;
        if (tourInterval) {
          clearInterval(tourInterval);
          tourInterval = null;
        }
        safeSetContent(tourBtn, '▶ Start Tour');
        safeToggleClass(tourBtn, 'touring', false);
      } else {
        // Start tour
        if (exhibits.length === 0) {
          console.warn('No exhibits available for tour');
          return;
        }
        
        isTouring = true;
        safeSetContent(tourBtn, '⏹ Stop Tour');
        safeToggleClass(tourBtn, 'touring', true);
        
        currentPortraitIndex = 0;
        
        function showNextPortrait() {
          try {
            if (!isTouring || currentPortraitIndex >= exhibits.length) return;
            
            focusTarget = exhibits[currentPortraitIndex];
            isLocked = true;
            
            if (portraitCounterEl) portraitCounterEl.style.display = 'block';
            safeSetContent(currentPortraitEl, String(currentPortraitIndex + 1));
            
            controls.enableRotate = false;
            controls.enablePan = false;
            controls.enableZoom = false;
            
            if (infoEl) infoEl.style.display = 'block';
            updateInfoPanel(focusTarget, true);
            
            currentPortraitIndex = (currentPortraitIndex + 1) % exhibits.length;
            
            // Stop at the end
            if (currentPortraitIndex === 0) {
              setTimeout(() => {
                if (isTouring) {
                  isTouring = false;
                  if (tourInterval) {
                    clearInterval(tourInterval);
                    tourInterval = null;
                  }
                  safeSetContent(tourBtn, '▶ Start Tour');
                  safeToggleClass(tourBtn, 'touring', false);
                }
              }, 4000);
            }
          } catch (error) {
            logError('showNextPortrait', error);
          }
        }
        
        showNextPortrait();
        tourInterval = setInterval(showNextPortrait, CONFIG.tour.intervalDuration);
      }
    } catch (error) {
      logError('Tour button click', error);
    }
  });
} else {
  console.warn('Tour button element not found');
}

// ─────────────────────────────────────────────
// CLICK TO FOCUS WITH ERROR HANDLING
// ─────────────────────────────────────────────
window.addEventListener('click', (e) => {
  try {
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

      if (portraitCounterEl) portraitCounterEl.style.display = 'block';
      safeSetContent(currentPortraitEl, String(currentPortraitIndex));

      if (infoEl) infoEl.style.display = 'block';
      updateInfoPanel(focusTarget);
    }
  } catch (error) {
    logError('Click handler', error);
  }
});

// ─────────────────────────────────────────────
// KEYBOARD EVENTS WITH ERROR HANDLING
// ─────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  try {
    if (e.key === 'Escape') {
      // Stop auto tour if running
      if (isTouring) {
        isTouring = false;
        if (tourInterval) {
          clearInterval(tourInterval);
          tourInterval = null;
        }
        safeSetContent(tourBtn, '▶ Start Tour');
        safeToggleClass(tourBtn, 'touring', false);
      }
      
      // Exit portrait focus and go back to room view
      clearFocusAndGoToRoom();
    }
    
    // Arrow key navigation between portraits
    if (isLocked && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      if (exhibits.length === 0) return;
      
      let newIndex = currentPortraitIndex - 1;
      
      if (e.key === 'ArrowRight') {
        newIndex = (newIndex + 1) % exhibits.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (newIndex - 1 + exhibits.length) % exhibits.length;
      }
      
      const newPortrait = exhibits[newIndex];
      if (!newPortrait) return;
      
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
        
        safeSetContent(currentPortraitEl, String(currentPortraitIndex));
        updateInfoPanel(focusTarget);
      }
    }
  } catch (error) {
    logError('Keyboard event', error);
  }
});

// ─────────────────────────────────────────────
// ANIMATION LOOP WITH ERROR HANDLING
// ─────────────────────────────────────────────
let wasNavigating = false;
let animationFrameId = null;

/**
 * Main animation loop
 */
function animate() {
  try {
    animationFrameId = requestAnimationFrame(animate);

    // Rotate the eagle model
    if (eagleModel) {
      eagleModel.rotation.y += CONFIG.eagle.rotationSpeed;
    }

    // Check if room navigation just completed - focus pending portrait
    if (wasNavigating && !isNavigating && pendingPortraitFocus) {
      // Small delay to let the view settle
      setTimeout(() => {
        try {
          if (pendingPortraitFocus) {
            focusTarget = pendingPortraitFocus.portrait;
            currentPortraitIndex = pendingPortraitFocus.index + 1;
            isLocked = true;
            
            controls.enableRotate = false;
            controls.enablePan = false;
            controls.enableZoom = false;
            
            if (portraitCounterEl) portraitCounterEl.style.display = 'block';
            safeSetContent(currentPortraitEl, String(currentPortraitIndex));
            
            if (infoEl) infoEl.style.display = 'block';
            updateInfoPanel(focusTarget);
            
            pendingPortraitFocus = null;
          }
        } catch (error) {
          logError('Pending portrait focus', error);
        }
      }, 300);
    }
    wasNavigating = isNavigating;

    // Smooth camera movement when focusing on portrait
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
  } catch (error) {
    logError('Animation loop', error);
    // Continue animation even if error occurs
  }
}

/**
 * Stops the animation loop
 */
export function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// ─────────────────────────────────────────────
// INITIALIZATION WITH ERROR HANDLING
// ─────────────────────────────────────────────
/**
 * Initializes all interactions and starts the app
 */
export function initInteractions() {
  try {
    // Initialize room navigation with callback to clear focus
    initRoomNavigation(clearFocus);
    
    // Start animation loop
    animate();
    
    // Hide loading screen is now handled by loader.js when assets complete
    console.log('Interactions initialized successfully');
  } catch (error) {
    logError('Initialization', error);
    // Fallback: try to start animation even if other parts failed
    try {
      animate();
    } catch (animError) {
      console.error('Fatal error: Could not start animation', animError);
    }
  }
}

// Handle window resize with error handling
window.addEventListener('resize', () => {
  try {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  } catch (error) {
    logError('Window resize', error);
  }
});
