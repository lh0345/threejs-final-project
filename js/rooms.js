/**
 * ROOMS.JS - Room Builder, Central Hallway, Entrance Hall, Eagle Monument
 */

import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { scene, floorMat, wallMat } from './scene.js';

// Exported eagle model for rotation animation
export let eagleModel = null;

// ─────────────────────────────────────────────
// MUSEUM FURNITURE MATERIALS
// ─────────────────────────────────────────────
const benchWoodMat = new THREE.MeshStandardMaterial({
  color: 0x2a1810,
  roughness: 0.7,
  metalness: 0.1
});

const benchLeatherMat = new THREE.MeshStandardMaterial({
  color: 0x1a0a0a,
  roughness: 0.5,
  metalness: 0.0
});

const ropeMat = new THREE.MeshStandardMaterial({
  color: 0x8b0000,
  roughness: 0.8,
  metalness: 0.1
});

const postMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.3,
  metalness: 0.8
});

// ─────────────────────────────────────────────
// CREATE MUSEUM BENCH
// ─────────────────────────────────────────────
function createBench(x, y, z, rotationY = 0) {
  const bench = new THREE.Group();
  
  // Seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.15, 0.8),
    benchLeatherMat
  );
  seat.position.set(0, 0.5, 0);
  seat.castShadow = true;
  seat.receiveShadow = true;
  bench.add(seat);
  
  // Seat frame
  const seatFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.08, 0.85),
    benchWoodMat
  );
  seatFrame.position.set(0, 0.42, 0);
  seatFrame.castShadow = true;
  bench.add(seatFrame);
  
  // Legs
  const legGeo = new THREE.BoxGeometry(0.12, 0.42, 0.12);
  const legPositions = [
    [-1.1, 0.21, 0.3], [-1.1, 0.21, -0.3],
    [1.1, 0.21, 0.3], [1.1, 0.21, -0.3]
  ];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, benchWoodMat);
    leg.position.set(...pos);
    leg.castShadow = true;
    bench.add(leg);
  });
  
  // Cross support
  const support = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.06, 0.06),
    benchWoodMat
  );
  support.position.set(0, 0.15, 0);
  bench.add(support);
  
  bench.position.set(x, y, z);
  bench.rotation.y = rotationY;
  scene.add(bench);
  
  return bench;
}

// ─────────────────────────────────────────────
// CREATE ROPE BARRIER
// ─────────────────────────────────────────────
function createRopeBarrier(x, y, z, length = 4, rotationY = 0) {
  const barrier = new THREE.Group();
  
  // Posts at each end
  const postGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.9, 12);
  const baseGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.08, 12);
  const topGeo = new THREE.SphereGeometry(0.06, 12, 8);
  
  // Left post
  const leftPost = new THREE.Mesh(postGeo, postMat);
  leftPost.position.set(-length / 2, 0.45, 0);
  leftPost.castShadow = true;
  barrier.add(leftPost);
  
  const leftBase = new THREE.Mesh(baseGeo, postMat);
  leftBase.position.set(-length / 2, 0.04, 0);
  leftBase.castShadow = true;
  barrier.add(leftBase);
  
  const leftTop = new THREE.Mesh(topGeo, postMat);
  leftTop.position.set(-length / 2, 0.95, 0);
  leftTop.castShadow = true;
  barrier.add(leftTop);
  
  // Right post
  const rightPost = new THREE.Mesh(postGeo, postMat);
  rightPost.position.set(length / 2, 0.45, 0);
  rightPost.castShadow = true;
  barrier.add(rightPost);
  
  const rightBase = new THREE.Mesh(baseGeo, postMat);
  rightBase.position.set(length / 2, 0.04, 0);
  rightBase.castShadow = true;
  barrier.add(rightBase);
  
  const rightTop = new THREE.Mesh(topGeo, postMat);
  rightTop.position.set(length / 2, 0.95, 0);
  rightTop.castShadow = true;
  barrier.add(rightTop);
  
  // Rope - curved catenary shape
  const ropePoints = [];
  const segments = 20;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const xPos = -length / 2 + length * t;
    // Catenary curve: lowest in middle
    const sag = 0.15;
    const yPos = 0.75 - sag * Math.sin(Math.PI * t);
    ropePoints.push(new THREE.Vector3(xPos, yPos, 0));
  }
  
  const ropeCurve = new THREE.CatmullRomCurve3(ropePoints);
  const ropeGeo = new THREE.TubeGeometry(ropeCurve, 20, 0.02, 8, false);
  const rope = new THREE.Mesh(ropeGeo, ropeMat);
  rope.castShadow = true;
  barrier.add(rope);
  
  barrier.position.set(x, y, z);
  barrier.rotation.y = rotationY;
  scene.add(barrier);
  
  return barrier;
}

// ─────────────────────────────────────────────
// ROOM BUILDER FUNCTION
// facing: 'right' = entrance faces +X, 'left' = entrance faces -X
// ─────────────────────────────────────────────
export function buildRoom(name, x, z, facing = 'front') {
  const roomSize = 12;
  const wallHeight = 8;
  const wallThickness = 0.2;

  // Ceiling material
  const ceilingMat = new THREE.MeshStandardMaterial({ 
    color: 0x0a0505, 
    roughness: 0.9,
    side: THREE.DoubleSide
  });

  // Floor
  const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(x, 0, z);
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(x, wallHeight, z);
  scene.add(ceiling);

  // Add a single room light for all portraits (performance optimization)
  const roomLight = new THREE.PointLight(0xfff5e6, 1.2, 15);
  roomLight.position.set(x, wallHeight - 1, z);
  scene.add(roomLight);

  if (facing === 'right') {
    // Room faces right (+X direction) - entrance on right side
    // Back wall on LEFT
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomSize),
      wallMat
    );
    backWall.position.set(x - roomSize / 2, wallHeight / 2, z);
    scene.add(backWall);

    // Top wall (at -Z)
    const topWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomSize, wallHeight, wallThickness),
      wallMat
    );
    topWall.position.set(x, wallHeight / 2, z - roomSize / 2);
    scene.add(topWall);

    // Bottom wall (at +Z)
    const bottomWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomSize, wallHeight, wallThickness),
      wallMat
    );
    bottomWall.position.set(x, wallHeight / 2, z + roomSize / 2);
    scene.add(bottomWall);

    // Room label on back wall (left side)
    createRoomLabel(name, x - roomSize / 2 + 0.2, wallHeight - 0.6, z, Math.PI / 2);

  } else if (facing === 'left') {
    // Room faces left (-X direction) - entrance on left side
    // Back wall on RIGHT
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, roomSize),
      wallMat
    );
    backWall.position.set(x + roomSize / 2, wallHeight / 2, z);
    scene.add(backWall);

    // Top wall (at -Z)
    const topWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomSize, wallHeight, wallThickness),
      wallMat
    );
    topWall.position.set(x, wallHeight / 2, z - roomSize / 2);
    scene.add(topWall);

    // Bottom wall (at +Z)
    const bottomWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomSize, wallHeight, wallThickness),
      wallMat
    );
    bottomWall.position.set(x, wallHeight / 2, z + roomSize / 2);
    scene.add(bottomWall);

    // Room label on back wall (right side)
    createRoomLabel(name, x + roomSize / 2 - 0.2, wallHeight - 0.6, z, -Math.PI / 2);

  } else {
    // Default: front facing (original layout)
    const backWallGeo = new THREE.BoxGeometry(roomSize, wallHeight, wallThickness);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(x, wallHeight / 2, z - roomSize / 2);
    scene.add(backWall);

    const leftWallGeo = new THREE.BoxGeometry(wallThickness, wallHeight, roomSize);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(x - roomSize / 2, wallHeight / 2, z);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
    rightWall.position.set(x + roomSize / 2, wallHeight / 2, z);
    scene.add(rightWall);

    // Room label
    createRoomLabel(name, x, wallHeight - 0.6, z - roomSize / 2 + 0.2, 0);
  }
  
  // Add furniture based on room orientation
  if (facing === 'right') {
    // Bench in center of room, facing the portraits
    createBench(x, 0, z, -Math.PI / 2);
    
    // Horizontal rope barrier along the portrait wall
    createRopeBarrier(x - 4, 0, z, 8, Math.PI / 2);
    
  } else if (facing === 'left') {
    // Bench in center of room, facing the portraits
    createBench(x, 0, z, Math.PI / 2);
    
    // Horizontal rope barrier along the portrait wall
    createRopeBarrier(x + 4, 0, z, 8, Math.PI / 2);
  }
}

// Helper function to create room labels
function createRoomLabel(name, x, y, z, rotationY) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a0808';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#8b0000';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 504, 120);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(name, 256, 75);
  const texture = new THREE.CanvasTexture(canvas);
  const labelMat = new THREE.MeshBasicMaterial({ map: texture });
  const labelGeo = new THREE.PlaneGeometry(4, 1);
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.rotation.y = rotationY;
  label.position.set(x, y, z);
  scene.add(label);
}

// ─────────────────────────────────────────────
// CENTRAL HALLWAY
// ─────────────────────────────────────────────
export function buildCentralHallway() {
  const hallwayMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a0a0a, 
    roughness: 0.7,
    metalness: 0.1 
  });

  // Main hallway floor
  const hallwayFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 50),
    hallwayMat
  );
  hallwayFloor.rotation.x = -Math.PI / 2;
  hallwayFloor.position.set(0, 0.01, -14);
  hallwayFloor.receiveShadow = true;
  scene.add(hallwayFloor);

  // Decorative red carpet/runner
  const carpetMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b0000, 
    roughness: 0.9 
  });
  const carpet = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 48),
    carpetMat
  );
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.02, -14);
  carpet.receiveShadow = true;
  scene.add(carpet);

  // Carpet border lines (gold)
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xd4af37 });
  const leftBorder = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 48),
    borderMat
  );
  leftBorder.rotation.x = -Math.PI / 2;
  leftBorder.position.set(-1.5, 0.025, -14);
  scene.add(leftBorder);

  const rightBorder = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 48),
    borderMat
  );
  rightBorder.rotation.x = -Math.PI / 2;
  rightBorder.position.set(1.5, 0.025, -14);
  scene.add(rightBorder);
}

// ─────────────────────────────────────────────
// ALBANIAN EAGLE MONUMENT
// ─────────────────────────────────────────────
export function buildEagleMonument() {
  const pedestalMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a0a0a, 
    roughness: 0.3,
    metalness: 0.2 
  });

  // Pedestal base
  const pedestalBase = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.5, 3),
    pedestalMat
  );
  pedestalBase.position.set(0, 0.25, -14);
  pedestalBase.castShadow = true;
  pedestalBase.receiveShadow = true;
  scene.add(pedestalBase);

  // Pedestal column
  const pedestalColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1, 2.5, 8),
    pedestalMat
  );
  pedestalColumn.position.set(0, 1.75, -14);
  pedestalColumn.castShadow = true;
  pedestalColumn.receiveShadow = true;
  scene.add(pedestalColumn);

  // Pedestal top
  const pedestalTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.3, 2.2),
    pedestalMat
  );
  pedestalTop.position.set(0, 3.15, -14);
  pedestalTop.castShadow = true;
  pedestalTop.receiveShadow = true;
  scene.add(pedestalTop);

  // Load Albanian Double-Headed Eagle 3D Model
  const loader = new STLLoader();
  loader.load(
    '3d/Albanian_Eagle.stl',
    (geometry) => {
      // Center the geometry
      geometry.center();
      
      // Create material for the eagle
      const eagleMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.3,
        metalness: 0.8,
        side: THREE.DoubleSide
      });
      
      eagleModel = new THREE.Mesh(geometry, eagleMaterial);
      
      // Calculate scale to fit nicely (adjust based on actual model size)
      const box = new THREE.Box3().setFromObject(eagleModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim; // Scale to ~3 units
      eagleModel.scale.setScalar(scale);
      
      // Position above pedestal
      eagleModel.position.set(0, 5.5, -14);
      eagleModel.castShadow = true;
      eagleModel.receiveShadow = true;
      
      scene.add(eagleModel);
    },
    (progress) => {
      console.log('Loading eagle:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
      console.error('Error loading eagle model:', error);
      // Fallback to simple placeholder if model fails to load
      const fallbackGeom = new THREE.BoxGeometry(2, 2, 0.2);
      const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      eagleModel = new THREE.Mesh(fallbackGeom, fallbackMat);
      eagleModel.position.set(0, 5.5, -14);
      scene.add(eagleModel);
    }
  );

  // Eagle spotlight
  const eagleSpotlight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI / 4, 0.3, 1);
  eagleSpotlight.position.set(0, 9, -14);
  eagleSpotlight.target.position.set(0, 4, -14);
  scene.add(eagleSpotlight);
  scene.add(eagleSpotlight.target);

  // Red accent lights around pedestal
  const pedastalLight1 = new THREE.PointLight(0xff0000, 0.5, 5);
  pedastalLight1.position.set(2, 0.5, -14);
  scene.add(pedastalLight1);

  const pedastalLight2 = new THREE.PointLight(0xff0000, 0.5, 5);
  pedastalLight2.position.set(-2, 0.5, -14);
  scene.add(pedastalLight2);
  
  // Rope barrier around the eagle monument
  createRopeBarrier(-2, 0, -12, 4, 0);      // Front
  createRopeBarrier(-2, 0, -16, 4, 0);      // Back
  createRopeBarrier(-2.5, 0, -14, 3.5, Math.PI / 2); // Left
  createRopeBarrier(2.5, 0, -14, 3.5, Math.PI / 2);  // Right
}

// ─────────────────────────────────────────────
// ENTRANCE HALL / LOBBY
// ─────────────────────────────────────────────
export function buildEntranceHall() {
  const hallwayMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a0a0a, 
    roughness: 0.7,
    metalness: 0.1 
  });
  const carpetMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b0000, 
    roughness: 0.9 
  });
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xd4af37 });

  // Entrance hall floor
  const entranceFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 15),
    hallwayMat
  );
  entranceFloor.rotation.x = -Math.PI / 2;
  entranceFloor.position.set(0, 0.01, 18);
  scene.add(entranceFloor);

  // Entrance carpet
  const entranceCarpet = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 12),
    carpetMat
  );
  entranceCarpet.rotation.x = -Math.PI / 2;
  entranceCarpet.position.set(0, 0.02, 17);
  scene.add(entranceCarpet);

  // Entrance carpet borders
  const entranceBorderLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 12),
    borderMat
  );
  entranceBorderLeft.rotation.x = -Math.PI / 2;
  entranceBorderLeft.position.set(-3, 0.025, 17);
  scene.add(entranceBorderLeft);

  const entranceBorderRight = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 12),
    borderMat
  );
  entranceBorderRight.rotation.x = -Math.PI / 2;
  entranceBorderRight.position.set(3, 0.025, 17);
  scene.add(entranceBorderRight);

  // Entrance walls
  const entranceWallMat = new THREE.MeshStandardMaterial({ color: 0x1a0a0a });

  const entranceLeftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 8, 10),
    entranceWallMat
  );
  entranceLeftWall.position.set(-10, 4, 21);
  scene.add(entranceLeftWall);

  const entranceRightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 8, 10),
    entranceWallMat
  );
  entranceRightWall.position.set(10, 4, 21);
  scene.add(entranceRightWall);

  // Entrance ceiling
  const entranceCeiling = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 15),
    new THREE.MeshStandardMaterial({ color: 0x0a0505, side: THREE.DoubleSide })
  );
  entranceCeiling.rotation.x = Math.PI / 2;
  entranceCeiling.position.set(0, 7.5, 18);
  scene.add(entranceCeiling);

  // Grand entrance sign
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024;
  signCanvas.height = 256;
  const signCtx = signCanvas.getContext('2d');

  signCtx.fillStyle = '#0a0505';
  signCtx.fillRect(0, 0, 1024, 256);
  signCtx.strokeStyle = '#8b0000';
  signCtx.lineWidth = 8;
  signCtx.strokeRect(10, 10, 1004, 236);
  signCtx.strokeStyle = '#d4af37';
  signCtx.lineWidth = 3;
  signCtx.strokeRect(20, 20, 984, 216);

  signCtx.fillStyle = '#d4af37';
  signCtx.font = 'bold 64px Georgia, serif';
  signCtx.textAlign = 'center';
  signCtx.textBaseline = 'middle';
  signCtx.fillText('ALBANIAN HALL OF LEGACY', 512, 100);

  signCtx.fillStyle = '#cc2020';
  signCtx.font = '32px Georgia, serif';
  signCtx.fillText('Celebrating Albanian Heritage & Achievement', 512, 180);

  const signTexture = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshBasicMaterial({ map: signTexture });
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 3),
    signMat
  );
  signMesh.position.set(0, 5.5, 24.7);
  scene.add(signMesh);

  // Decorative pillars
  const pillarMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a0a0a, 
    roughness: 0.3,
    metalness: 0.3 
  });

  const leftPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 7.5, 16),
    pillarMat
  );
  leftPillar.position.set(-6, 3.75, 12);
  scene.add(leftPillar);

  const leftCapital = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.4, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.5 })
  );
  leftCapital.position.set(-6, 7.5, 12);
  scene.add(leftCapital);

  const rightPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 7.5, 16),
    pillarMat
  );
  rightPillar.position.set(6, 3.75, 12);
  scene.add(rightPillar);

  const rightCapital = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.4, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.5 })
  );
  rightCapital.position.set(6, 7.5, 12);
  scene.add(rightCapital);

  // Chandelier
  const chandelierMat = new THREE.MeshStandardMaterial({ 
    color: 0xd4af37, 
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0xd4af37,
    emissiveIntensity: 0.3
  });

  const chandelier = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.1, 8, 24),
    chandelierMat
  );
  chandelier.rotation.x = Math.PI / 2;
  chandelier.position.set(0, 7, 18);
  scene.add(chandelier);

  const chandelierLight = new THREE.PointLight(0xfff5e6, 1.5, 15);
  chandelierLight.position.set(0, 6.5, 18);
  scene.add(chandelierLight);

  // Welcome mat
  const welcomeMatCanvas = document.createElement('canvas');
  welcomeMatCanvas.width = 256;
  welcomeMatCanvas.height = 128;
  const welcomeCtx = welcomeMatCanvas.getContext('2d');

  welcomeCtx.fillStyle = '#2a0505';
  welcomeCtx.fillRect(0, 0, 256, 128);
  welcomeCtx.strokeStyle = '#d4af37';
  welcomeCtx.lineWidth = 4;
  welcomeCtx.strokeRect(8, 8, 240, 112);
  welcomeCtx.fillStyle = '#d4af37';
  welcomeCtx.font = 'bold 28px Georgia, serif';
  welcomeCtx.textAlign = 'center';
  welcomeCtx.textBaseline = 'middle';
  welcomeCtx.fillText('MIRË SE VINI', 128, 64);

  const welcomeTexture = new THREE.CanvasTexture(welcomeMatCanvas);
  const welcomeMat = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 2),
    new THREE.MeshBasicMaterial({ map: welcomeTexture })
  );
  welcomeMat.rotation.x = -Math.PI / 2;
  welcomeMat.position.set(0, 0.03, 23);
  scene.add(welcomeMat);
}
