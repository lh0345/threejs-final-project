/**
 * MAIN.JS - Entry point and museum content builder
 * 
 * @module main
 * @description Builds all museum rooms, portraits, and initializes the application
 * This is the main entry point that constructs the entire virtual museum
 */

import { stopLoaderAnimation } from './loader.js';
import { buildRoom, buildCentralHallway, buildEagleMonument, buildEntranceHall } from './rooms.js';
import { createPortrait } from './portraits.js';
import { initInteractions } from './interactions.js';

// ═══════════════════════════════════════════
// BUILD THE MUSEUM
// ═══════════════════════════════════════════

// Build central hallway and monuments
buildCentralHallway();
buildEagleMonument();
buildEntranceHall();

// ─────────────────────────────────────────────
// LEFT COLUMN (x = -10) - rooms face RIGHT
// ─────────────────────────────────────────────

// ROOM 1: Historical Figures
buildRoom('Historical Figures', -10, 0, 'right');
createPortrait('Skënderbeu', 'National hero who resisted the Ottoman Empire for 25 years', -10, 0, 0, 0x5c3a21, 'right');
createPortrait('Ismail Qemali', 'Declared Albanian independence in 1912', -10, 0, 1, 0x4a2c17, 'right');
createPortrait('Isa Boletini', 'Albanian nationalist and guerrilla fighter', -10, 0, 2, 0x6b4423, 'right');
createPortrait('Fan Noli', 'Bishop, politician, writer and founder of the Orthodox Church of Albania', -10, 0, 3, 0x5c3a21, 'right');

// ROOM 2: Scientists & Thinkers
buildRoom('Scientists & Thinkers', -10, -14, 'right');
createPortrait('Ismail Kadare', 'Internationally acclaimed novelist and poet', -10, -14, 0, 0x3d2817, 'right');
createPortrait('Ibrahim Rugova', 'Political philosopher and first President of Kosovo', -10, -14, 1, 0x4a3520, 'right');
createPortrait('Sami Frashëri', 'Writer, philosopher, playwright and a leader of the Albanian National Awakening', -10, -14, 2, 0x5c4033, 'right');
createPortrait('Naim Frashëri', 'National poet of Albania, Renaissance figure', -10, -14, 3, 0x4a3520, 'right');

// ROOM 3: Actors
buildRoom('Actors', -10, -28, 'right');
createPortrait('James Belushi', 'Hollywood actor, born to Albanian immigrant father', -10, -28, 0, 0x8b4513, 'right');
createPortrait('Eliza Dushku', 'Actress known for Buffy, Dollhouse', -10, -28, 1, 0x6b3a13, 'right');
createPortrait('Masiela Lusha', 'Actress known for George Lopez show', -10, -28, 2, 0x7b4a23, 'right');
createPortrait('Bekim Fehmiu', 'Yugoslav-Albanian actor, international star', -10, -28, 3, 0x5b3a13, 'right');

// ─────────────────────────────────────────────
// RIGHT COLUMN (x = 10) - rooms face LEFT
// ─────────────────────────────────────────────

// ROOM 4: International Contributors
buildRoom('International Contributors', 10, 0, 'left');
createPortrait('Mother Teresa', 'Nobel Peace Prize laureate and saint', 10, 0, 0, 0x2a4a6a, 'left');
createPortrait('John Belushi', 'American comedian and actor of Albanian descent', 10, 0, 1, 0x3a3a4a, 'left');
createPortrait('Jim Belushi', 'American actor and comedian', 10, 0, 2, 0x3a3a4a, 'left');
createPortrait('Eliza Dushku', 'American actress of Albanian descent', 10, 0, 3, 0x4a3a5a, 'left');

// ROOM 5: Singers
buildRoom('Singers', 10, -14, 'left');
createPortrait('Rita Ora', 'British-Albanian singer and songwriter', 10, -14, 0, 0xc41e3a, 'left');
createPortrait('Dua Lipa', 'British-Albanian pop superstar', 10, -14, 1, 0xd4246a, 'left');
createPortrait('Bebe Rexha', 'American singer of Albanian descent', 10, -14, 2, 0xb41e4a, 'left');
createPortrait('Era Istrefi', 'Kosovar-Albanian singer, "Bonbon" fame', 10, -14, 3, 0xa42e5a, 'left');

// ROOM 6: Historical Events
buildRoom('Historical Events', 10, -28, 'left');
createPortrait('Independence 1912', 'Declaration of Albanian Independence by Ismail Qemali', 10, -28, 0, 0xd4af37, 'left');
createPortrait('League of Prizren', '1878 political organization for Albanian autonomy', 10, -28, 1, 0xc49f27, 'left');
createPortrait('Alphabet Congress', '1908 standardization of Albanian alphabet in Monastir', 10, -28, 2, 0xb48f17, 'left');
createPortrait('Kosovo Independence', '2008 Declaration of Independence of Kosovo', 10, -28, 3, 0x1e4d8c, 'left');

// ─────────────────────────────────────────────
// INITIALIZE INTERACTIONS
// ─────────────────────────────────────────────
initInteractions();
