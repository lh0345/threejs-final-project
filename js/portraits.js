/**
 * PORTRAITS.JS - Portrait Creator, Portrait Data, Exhibits Array
 * 
 * @module portraits
 * @description Portrait and museum management system
 * Contains all portrait data for Albanian historical figures and celebrities
 */

import * as THREE from 'three';
import { scene } from './scene.js';
import { buildRoom } from './rooms.js';
import { CONFIG } from './config.js';

/**
 * Array to store all clickable portrait meshes
 * @type {THREE.Mesh[]}
 * @exports
 */
export const exhibits = [];

// Constants derived from CONFIG
const ROOM_SIZE = CONFIG.room.depth;
const FRAME_WIDTH = CONFIG.portrait.width;
const FRAME_HEIGHT = CONFIG.portrait.height;
const FRAME_DEPTH = CONFIG.portrait.frameDepth;
const BORDER_SIZE = CONFIG.portrait.frameThickness;
const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 340;
const PORTRAIT_Y = CONFIG.portrait.heightFromFloor + CONFIG.portrait.height / 2;

/**
 * Creates shared geometries and materials to prevent recreation
 */
class PortraitFactory {
  constructor() {
    // Create shared geometries once
    this.geometries = {
      topBottom: new THREE.BoxGeometry(FRAME_WIDTH + BORDER_SIZE * 2, BORDER_SIZE, FRAME_DEPTH),
      leftRight: new THREE.BoxGeometry(BORDER_SIZE, FRAME_HEIGHT, FRAME_DEPTH),
      portrait: new THREE.PlaneGeometry(FRAME_WIDTH, FRAME_HEIGHT)
    };
    
    // Material cache
    this.materialCache = new Map();
  }
  
  // Get or create material for a specific color
  getFrameMaterial(color) {
    if (!this.materialCache.has(color)) {
      this.materialCache.set(color, new THREE.MeshStandardMaterial({ 
        color, 
        roughness: 0.7,
        metalness: 0.1
      }));
    }
    return this.materialCache.get(color);
  }
  
  // Draw silhouette placeholder on canvas
  drawSilhouette(ctx) {
    ctx.fillStyle = '#4a3030';
    ctx.beginPath();
    ctx.ellipse(128, 100, 50, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(128, 220, 70, 50, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(108, 150, 40, 40);
  }
  
  // Create base canvas with gradient and nameplate
  createBaseCanvas(name) {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    
    // Background gradient (lighter for better visibility)
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#3a2a2a');
    gradient.addColorStop(1, '#2a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Name plate
    ctx.fillStyle = '#2a1515';
    ctx.fillRect(10, 280, 236, 50);
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 282, 232, 46);
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, 128, 310);
    
    return { canvas, ctx, gradient };
  }
}

/**
 * Represents a single portrait with frame and canvas
 */
class Portrait {
  constructor(name, data, factory) {
    this.name = name;
    this.data = data;
    this.factory = factory;
    this.group = null;
    this.mesh = null;
  }
  
  // Calculate 3D position based on room layout
  calculatePosition() {
    const spacing = ROOM_SIZE / 5;
    const offset = (this.data.position - 1.5) * spacing;
    
    let x, z, rotationY;
    
    if (this.data.facing === 'right') {
      x = this.data.x - ROOM_SIZE / 2 + 0.15;
      z = this.data.z + offset;
      rotationY = Math.PI / 2;
    } else if (this.data.facing === 'left') {
      x = this.data.x + ROOM_SIZE / 2 - 0.15;
      z = this.data.z + offset;
      rotationY = -Math.PI / 2;
    } else {
      x = this.data.x + offset;
      z = this.data.z - ROOM_SIZE / 2 + 0.15;
      rotationY = 0;
    }
    
    return { x, z, rotationY };
  }
  
  // Create the 3D frame structure
  createFrame() {
    this.group = new THREE.Group();
    const frameMat = this.factory.getFrameMaterial(this.data.frameColor);
    
    // Reuse shared geometries
    const topFrame = new THREE.Mesh(this.factory.geometries.topBottom, frameMat);
    topFrame.position.set(0, FRAME_HEIGHT / 2 + BORDER_SIZE / 2, 0);
    this.group.add(topFrame);
    
    const bottomFrame = new THREE.Mesh(this.factory.geometries.topBottom, frameMat);
    bottomFrame.position.set(0, -FRAME_HEIGHT / 2 - BORDER_SIZE / 2, 0);
    this.group.add(bottomFrame);
    
    const leftFrame = new THREE.Mesh(this.factory.geometries.leftRight, frameMat);
    leftFrame.position.set(-FRAME_WIDTH / 2 - BORDER_SIZE / 2, 0, 0);
    this.group.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(this.factory.geometries.leftRight, frameMat);
    rightFrame.position.set(FRAME_WIDTH / 2 + BORDER_SIZE / 2, 0, 0);
    this.group.add(rightFrame);
  }
  
  // Create the portrait canvas and texture
  createPortraitMesh() {
    const { canvas, ctx, gradient } = this.factory.createBaseCanvas(this.name);
    
    const portraitTexture = new THREE.CanvasTexture(canvas);
    const portraitMat = new THREE.MeshBasicMaterial({ map: portraitTexture });
    this.mesh = new THREE.Mesh(this.factory.geometries.portrait, portraitMat);
    this.mesh.position.set(0, 0, FRAME_DEPTH / 2 + 0.01);
    this.group.add(this.mesh);
    
    // Load image asynchronously
    this.loadImage(ctx, gradient, portraitTexture);
    
    // Attach metadata
    this.mesh.userData = {
      label: this.name,
      description: this.data.achievement,
      isPortrait: true,
      facing: this.data.facing,
      years: this.data.years,
      achievement: this.data.achievement,
      quote: this.data.quote,
      wiki: this.data.wiki
    };
  }
  
  // Load portrait image
  loadImage(ctx, gradient, texture) {
    if (!this.data.image) {
      this.factory.drawSilhouette(ctx);
      texture.needsUpdate = true;
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const imgAspect = img.width / img.height;
      const targetWidth = 220;
      const targetHeight = 250;
      
      let drawWidth, drawHeight;
      if (imgAspect > targetWidth / targetHeight) {
        drawHeight = targetHeight;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = targetWidth;
        drawHeight = drawWidth / imgAspect;
      }
      
      const drawX = (CANVAS_WIDTH - drawWidth) / 2;
      
      // Redraw background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, 275);
      
      // Draw image with rounded corners
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(18, 15, 220, 250, 8);
      ctx.clip();
      ctx.drawImage(img, drawX, 15, drawWidth, drawHeight);
      ctx.restore();
      
      // Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(18, 15, 220, 250, 8);
      ctx.stroke();
      
      texture.needsUpdate = true;
    };
    img.onerror = () => {
      this.factory.drawSilhouette(ctx);
      texture.needsUpdate = true;
    };
    img.src = this.data.image;
  }
  
  // Build and add to scene
  build() {
    this.createFrame();
    this.createPortraitMesh();
    
    const { x, z, rotationY } = this.calculatePosition();
    this.group.position.set(x, PORTRAIT_Y, z);
    this.group.rotation.y = rotationY;
    
    scene.add(this.group);
    this.group.updateMatrixWorld(true);
    exhibits.push(this.mesh);
    
    return this.group;
  }
}

/**
 * Manages a room and its portraits
 */
class MuseumRoom {
  constructor(name, x, z, facing, factory) {
    this.name = name;
    this.x = x;
    this.z = z;
    this.facing = facing;
    this.factory = factory;
    this.portraits = [];
  }
  
  // Add portrait to room
  addPortrait(name, data) {
    const portrait = new Portrait(name, data, this.factory);
    this.portraits.push(portrait);
  }
  
  // Build room structure and all portraits
  build() {
    buildRoom(this.name, this.x, this.z, this.facing);
    this.portraits.forEach(portrait => portrait.build());
  }
}

/**
 * Orchestrates entire museum construction
 */
class Museum {
  constructor(portraitData) {
    this.factory = new PortraitFactory();
    this.rooms = new Map();
    this.loadPortraitData(portraitData);
  }
  
  // Load and organize portrait data into rooms
  loadPortraitData(portraitData) {
    Object.entries(portraitData).forEach(([name, data]) => {
      const roomKey = `${data.room}_${data.x}_${data.z}_${data.facing}`;
      
      if (!this.rooms.has(roomKey)) {
        this.rooms.set(roomKey, new MuseumRoom(
          data.room,
          data.x,
          data.z,
          data.facing,
          this.factory
        ));
      }
      
      this.rooms.get(roomKey).addPortrait(name, data);
    });
  }
  
  // Build entire museum
  build() {
    this.rooms.forEach(room => room.build());
  }
}

// Portrait data with room assignments - single source of truth
export const portraitData = {
  // Room 1: Historical Figures (-10, 0, right)
  'Skënderbeu': { 
    years: '1405-1468', 
    achievement: 'Led resistance against Ottoman Empire for 25 years', 
    quote: '"I have not brought you freedom, I found it here among you."', 
    wiki: 'https://en.wikipedia.org/wiki/Skanderbeg',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Skanderbeg_by_Kol%C3%AB_Idromeno_1890.jpg/250px-Skanderbeg_by_Kol%C3%AB_Idromeno_1890.jpg',
    room: 'Historical Figures', x: -10, z: 0, facing: 'right', position: 0, frameColor: 0x5c3a21
  },
  'Ismail Qemali': { 
    years: '1844-1919', 
    achievement: 'Declared Albanian independence on November 28, 1912', 
    quote: '"Albania is free, independent, and sovereign."', 
    wiki: 'https://en.wikipedia.org/wiki/Ismail_Qemali',
    image: 'https://imgs.search.brave.com/nFQC5dwzqVcfWVmEq1mg3xU3wqRf_z-JrR8aMmcH8OA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmluZGFncmF2/ZS5jb20vcGhvdG9z/LzIwMjAvMTMwLzIw/OTkxMTE1MV8zNzI2/OWViZi00ZDU1LTQx/ZWUtYjkwNC00Y2M2/MzYwZjk3MzQuanBl/Zz9zaXplPXBob3Rv/czI1MA',
    room: 'Historical Figures', x: -10, z: 0, facing: 'right', position: 1, frameColor: 0x4a2c17
  },
  'Isa Boletini': { 
    years: '1864-1916', 
    achievement: 'Led guerrilla resistance and fought for Albanian independence', 
    quote: '"Better to die on your feet than live on your knees."', 
    wiki: 'https://en.wikipedia.org/wiki/Isa_Boletini',
    image: 'https://i0.wp.com/mitrovicaguide.com/wp-content/uploads/2014/03/The_new_Isa_Boletini-2.jpg?fit=357%2C400&ssl=1',
    room: 'Historical Figures', x: -10, z: 0, facing: 'right', position: 2, frameColor: 0x6b4423
  },
  'Adem Jashari': { 
    years: '1964-1998', 
    achievement: 'Founder of the Kosovo Liberation Army and symbol of Kosovo independence', 
    quote: '"Freedom is not free."', 
    wiki: 'https://en.wikipedia.org/wiki/Adem_Jashari',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Adem_Jashari_Memorial_in_Prekaz_January_2013_09_%28cropped%29.jpg/500px-Adem_Jashari_Memorial_in_Prekaz_January_2013_09_%28cropped%29.jpg',
    room: 'Historical Figures', x: -10, z: 0, facing: 'right', position: 3, frameColor: 0x5c3a21
  },
  
  // Room 2: Scientists & Thinkers (-10, -14, right)
  'Ismail Kadare': { 
    years: '1936-2024', 
    achievement: 'Nominated for Nobel Prize in Literature multiple times', 
    quote: '"Literature is the memory of humanity."', 
    wiki: 'https://en.wikipedia.org/wiki/Ismail_Kadare',
    image: 'https://imgs.search.brave.com/jgX4NxB4rCuSAN-8MF6Y-3FARr17Iu_6Or-IoMbDryA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTgz/NDMwOTI2L3Bob3Rv/L3BvcnRyYWl0LWRp/c21haWwta2FkYXJl/LXBvJUMzJUE4dGUt/ZXQtcm9tYW5jaWVy/LWFsYmFuYWlzLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1R/ZlJhdjR3dGNYeE5a/WFM1LXRDbnNjc1Bk/dENtalV4SWplN0pf/aUZxQ04wPQ',
    room: 'Scientists & Thinkers', x: -10, z: -14, facing: 'right', position: 0, frameColor: 0x3d2817
  },
  'Ibrahim Rugova': { 
    years: '1944-2006', 
    achievement: 'First President of Kosovo, led peaceful resistance', 
    quote: '"Peace is the only way forward."', 
    wiki: 'https://en.wikipedia.org/wiki/Ibrahim_Rugova',
    image: 'https://imgs.search.brave.com/uIrCp77ipZPV7fY7JC1HH8F2XiiM8l43IFSmplXykuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTQx/Nzk3OTQ3L3Bob3Rv/L3J1Z292YS1pYnJh/aGltLWxpdGVyYXR1/cndpc3NlbnNjaGFm/dGxlci1wb2xpdGlr/ZXIta29zb3ZvZ3J1/ZW5kZXItZGVyLWRl/bW9rcmF0aXNjaGVu/LWxpZ2EtZGVzLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz10/N3hVS1RXMkNhQzRK/WklsZmRVQWczMXhy/N19wSkVSN19FU2RN/MjZSUWprPQ',
    room: 'Scientists & Thinkers', x: -10, z: -14, facing: 'right', position: 1, frameColor: 0x4a3520
  },
  'Sami Frashëri': { 
    years: '1850-1904', 
    achievement: 'Key figure in Albanian National Awakening', 
    quote: '"Albania for the Albanians."', 
    wiki: 'https://en.wikipedia.org/wiki/Sami_Frash%C3%ABri',
    image: 'https://imgs.search.brave.com/q3rDYuLMp_o0LQO85a9afI-tAUBSNW-9FjXdh011Et0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXN2Yy5hbmNlc3Ry/eS5jb20vdjIvaW1h/Z2UvbmFtZXNwYWNl/cy8xMDkzL21lZGlh/L2JkMzJkMTM0LTBm/Y2MtNGZhMC1hNWVi/LWJhOWIxMDRlYzE1/Mi5qcGc_Q2xpZW50/PWFzdHJvLXNlb2xv/cHAmTWF4U2lkZT0x/NjA',
    room: 'Scientists & Thinkers', x: -10, z: -14, facing: 'right', position: 2, frameColor: 0x5c4033
  },
  'Naim Frashëri': { 
    years: '1846-1900', 
    achievement: 'National poet, wrote "History of Skanderbeg"', 
    quote: '"O mountains of Albania, and you, O trees so lofty."', 
    wiki: 'https://en.wikipedia.org/wiki/Naim_Frash%C3%ABri',
    image: 'https://imgs.search.brave.com/FgsL0JomQP2FQhbwTz5yZWnQVyht4W7XfKzoBOkKmV8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kdWNr/ZHVja2dvLmNvbS9p/LzFlMzA5MjM1Lmpw/Zw',
    room: 'Scientists & Thinkers', x: -10, z: -14, facing: 'right', position: 3, frameColor: 0x4a3520
  },
  
  // Room 3: Actors (-10, -28, right)
  'John Belushi': { 
    years: '1949-1982', 
    achievement: 'SNL original cast, starred in Blues Brothers', 
    quote: '"I owe it all to little chocolate donuts."', 
    wiki: 'https://en.wikipedia.org/wiki/John_Belushi',
    image: 'https://imgs.search.brave.com/7tsUO4cNv2RisYRmmbDopsfsj3bWyXLjEgOG9tNyefk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wZW9w/bGUuY29tL3RobWIv/VzBlaV9BcDdldHlE/ZjdBMEpROGJQdVN4/ajkwPS80MDAweDAv/ZmlsdGVyczpub191/cHNjYWxlKCk6bWF4/X2J5dGVzKDE1MDAw/MCk6c3RyaXBfaWNj/KCk6Zm9jYWwoNDMy/eDExOTo0MzR4MTIx/KTpmb3JtYXQod2Vi/cCkvam9obi1iZWx1/c2hpLWRlYXRoLXNu/bC0wMzA0MjUtYWVj/ZmZkMTE2ODAyNDMz/N2E3ZDBlODM2MGIx/MjVlYjMuanBn',
    room: 'Actors', x: -10, z: -28, facing: 'right', position: 0, frameColor: 0x8b4513
  },
  'Faruk Begolli': { 
    years: '1944-2007', 
    achievement: 'Renowned Yugoslav-Albanian actor and director', 
    quote: '"Acting is the bridge between cultures."', 
    wiki: 'https://en.wikipedia.org/wiki/Faruk_Begolli',
    image: 'https://upload.wikimedia.org/wikipedia/en/6/64/Faruk-Begolli-pic.jpg',
    room: 'Actors', x: -10, z: -28, facing: 'right', position: 1, frameColor: 0x7b4a23
  },
  'Bekim Fehmiu': { 
    years: '1936-2010', 
    achievement: 'First Albanian international film star', 
    quote: '"Art has no borders."', 
    wiki: 'https://en.wikipedia.org/wiki/Bekim_Fehmiu',
    image: 'https://imgs.search.brave.com/fYp9h1fIpssj4VnoG5z29Iw0B6lUBkXaoad_JUTzLtE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQ5/OTgyOTAwL3Bob3Rv/L2Jla2ltLWZlaG1p/dS15dWdvc2xhdi1z/dGFyLXdoby1wbGF5/cy10aGUtcm9sZS1v/Zi1kYXgtaW4tdGhl/LWZpbG0tdGhlLWFk/dmVudHVyZXJzLTE5/NzAuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXpZMjhCenk0/TzkyZ2VzU1BVYjFS/VC1NUFBnZjA4SjVk/aXNvTmszNjZnaWs9',
    room: 'Actors', x: -10, z: -28, facing: 'right', position: 2, frameColor: 0x5b3a13
  },
  'Jim Belushi': { 
    years: '1954-present', 
    achievement: 'SNL cast member, starred in According to Jim', 
    quote: '"I\'m proud of my Albanian heritage."', 
    wiki: 'https://en.wikipedia.org/wiki/Jim_Belushi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Jim_Belushi_Unveils_Belushi_Performance_Hall_at_MAC_Motown_2015_31.jpg/500px-Jim_Belushi_Unveils_Belushi_Performance_Hall_at_MAC_Motown_2015_31.jpg',
    room: 'Actors', x: -10, z: -28, facing: 'right', position: 3, frameColor: 0x7b4a23
  },
  
  // Room 4: International Contributors (10, 0, left)
  'Mother Teresa': { 
    years: '1910-1997', 
    achievement: 'Nobel Peace Prize 1979, canonized as Saint in 2016', 
    quote: '"If you judge people, you have no time to love them."', 
    wiki: 'https://en.wikipedia.org/wiki/Mother_Teresa',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/250px-Mother_Teresa_1.jpg',
    room: 'International Contributors', x: 10, z: 0, facing: 'left', position: 0, frameColor: 0x2a4a6a
  },
  'Ferid Murad': { 
    years: '1936-2023', 
    achievement: 'Nobel Prize in Physiology/Medicine 1998 for nitric oxide discoveries', 
    quote: '"Science knows no boundaries."', 
    wiki: 'https://en.wikipedia.org/wiki/Ferid_Murad',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Ferid_Murad.jpg/500px-Ferid_Murad.jpg',
    room: 'International Contributors', x: 10, z: 0, facing: 'left', position: 1, frameColor: 0x3a3a4a
  },
  'Behgjet Pacolli': { 
    years: '1951-present', 
    achievement: 'Businessman, founder of Mabetex Group, served as President of Kosovo in 2011', 
    quote: '"Success comes from hard work and dedication to your homeland."', 
    wiki: 'https://en.wikipedia.org/wiki/Behgjet_Pacolli',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Bp2015.jpg/500px-Bp2015.jpg',
    room: 'International Contributors', x: 10, z: 0, facing: 'left', position: 2, frameColor: 0x3a3a4a
  },
  'Ermonela Jaho': { 
    years: '1974-present', 
    achievement: 'World-renowned Albanian soprano opera singer', 
    quote: '"Opera is the language of the soul."', 
    wiki: 'https://en.wikipedia.org/wiki/Ermonela_Jaho',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/ErmonelaJaho-InternationalOperaAwards.jpg/330px-ErmonelaJaho-InternationalOperaAwards.jpg',
    room: 'International Contributors', x: 10, z: 0, facing: 'left', position: 3, frameColor: 0x3a3a4a
  },
  
  // Room 5: Singers (10, -14, left)
  'Rita Ora': { 
    years: '1990-present', 
    achievement: 'Multi-platinum artist, 4 UK #1 singles', 
    quote: '"Kosovo is my heart, UK is my home."', 
    wiki: 'https://en.wikipedia.org/wiki/Rita_Ora',
    image: 'https://imgs.search.brave.com/AT18oh2fpQEOT8aBhN4gyqA79AOXn4zvPe1Iid55V1s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dXNtYWdhemluZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDkvUml0YS1P/cmEtSm9pbnMtSnVk/Z2VzLVBhbmVsLW9u/LVRoZS1NYXNrZWQt/U2luZ2VyLTEuanBn/P3c9ODAwJnF1YWxp/dHk9NDAmc3RyaXA9/YWxs',
    room: 'Singers', x: 10, z: -14, facing: 'left', position: 0, frameColor: 0xc41e3a
  },
  'Dua Lipa': { 
    years: '1995-present', 
    achievement: '6 Grammy nominations, 3 wins, global superstar', 
    quote: '"I want to make my parents and Kosovo proud."', 
    wiki: 'https://en.wikipedia.org/wiki/Dua_Lipa',
    image: 'https://imgs.search.brave.com/74V2bkyxbkWoGpAXa_HS3ZVV-PUnyQAmJDvSjhYR0o4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvZHVh/LWxpcGEtMTI4MC14/LTE3MDctcGljdHVy/ZS16NXViMzF4cHlw/bDVjemNyLmpwZw',
    room: 'Singers', x: 10, z: -14, facing: 'left', position: 1, frameColor: 0xd4246a
  },
  'Inva Mula': { 
    years: '1963-present', 
    achievement: 'Albanian opera soprano, sang Diva Dance in The Fifth Element', 
    quote: '"Music transcends all boundaries."', 
    wiki: 'https://en.wikipedia.org/wiki/Inva_Mula',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Inva_Mula_%28cropped%29.jpg/393px-Inva_Mula_%28cropped%29.jpg',
    room: 'Singers', x: 10, z: -14, facing: 'left', position: 2, frameColor: 0xb41e4a
  },
  'Nexhmije Pagarusha': { 
    years: '1933-2020', 
    achievement: 'Legendary Albanian singer, "Queen of Albanian Music"', 
    quote: '"My voice belongs to Albania."', 
    wiki: 'https://en.wikipedia.org/wiki/Nexhmije_Pagarusha',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Artistic_Director_of_the_high_fashion_show_%E2%80%9CGogh%E2%80%9D_%28cropped%29.jpg',
    room: 'Singers', x: 10, z: -14, facing: 'left', position: 3, frameColor: 0xa42e5a
  },
  
  // Room 6: Historical Events (10, -28, left)
  'Independence 1912': { 
    years: 'November 28, 1912', 
    achievement: 'Albania declared independence from Ottoman Empire', 
    quote: '"The Albanian flag was raised in Vlorë."', 
    wiki: 'https://en.wikipedia.org/wiki/Albanian_Declaration_of_Independence',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Deklarata_e_Pavar%C3%ABsis%C3%AB_%28dokumenti_origjinal_1912%29.jpg/250px-Deklarata_e_Pavar%C3%ABsis%C3%AB_%28dokumenti_origjinal_1912%29.jpg',
    room: 'Historical Events', x: 10, z: -28, facing: 'left', position: 0, frameColor: 0xd4af37
  },
  'League of Prizren': { 
    years: 'June 10, 1878', 
    achievement: 'First unified Albanian political organization', 
    quote: '"United for Albanian lands."', 
    wiki: 'https://en.wikipedia.org/wiki/League_of_Prizren',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/The_delegation_of_Sanjak_of_Shkodra_in_the_League_of_Prizren.jpg',
    room: 'Historical Events', x: 10, z: -28, facing: 'left', position: 1, frameColor: 0xc49f27
  },
  'Alphabet Congress': { 
    years: 'November 14-22, 1908', 
    achievement: 'Standardized Albanian alphabet in Monastir', 
    quote: '"One nation, one language, one alphabet."', 
    wiki: 'https://en.wikipedia.org/wiki/Congress_of_Monastir',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Delegat%C3%ABt_e_Kongresit_t%C3%AB_Manastirit.jpg/250px-Delegat%C3%ABt_e_Kongresit_t%C3%AB_Manastirit.jpg',
    room: 'Historical Events', x: 10, z: -28, facing: 'left', position: 2, frameColor: 0xb48f17
  },
  'Kosovo Independence': { 
    years: 'February 17, 2008', 
    achievement: 'Kosovo declared independence from Serbia', 
    quote: '"Kosovo is free!"', 
    wiki: 'https://en.wikipedia.org/wiki/2008_Kosovo_declaration_of_independence',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Kosova_independence_Vienna_17-02-2008_b.jpg/250px-Kosova_independence_Vienna_17-02-2008_b.jpg',
    room: 'Historical Events', x: 10, z: -28, facing: 'left', position: 3, frameColor: 0x1e4d8c
  }
};

/**
 * Builds all museum rooms with portraits
 */
export function buildAllPortraits() {
  const museum = new Museum(portraitData);
  museum.build();
}

// Backwards compatibility - not used anymore but kept for reference
export function createPortrait() {
  console.warn('createPortrait() is deprecated. Use buildAllPortraits() instead.');
}