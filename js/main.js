/**
 * MAIN.JS - Entry point and museum builder
 * 
 * @module main
 * @description Builds all museum rooms, portraits, and initializes the app
 */

import { stopLoaderAnimation } from './loader.js';
import { buildCentralHallway, buildEagleMonument, buildEntranceHall } from './rooms.js';
import { buildAllPortraits } from './portraits.js';
import { initInteractions } from './interactions.js';

// ═══════════════════════════════════════════
// BUILD THE MUSEUM
// ═══════════════════════════════════════════

// Build central hallway and monuments
buildCentralHallway();
buildEagleMonument();
buildEntranceHall();

// ─────────────────────────────────────────────
// BUILD ALL PORTRAIT ROOMS
// ─────────────────────────────────────────────
buildAllPortraits();

// ─────────────────────────────────────────────
// INITIALIZE INTERACTIONS
// ─────────────────────────────────────────────
initInteractions();
