/**
 * PORTRAITS.JS - Portrait Creator, Portrait Data, Exhibits Array
 */

import * as THREE from 'three';
import { scene } from './scene.js';

// Array to store all clickable portrait meshes
export const exhibits = [];

// Portrait data with detailed information and Wikipedia images
export const portraitData = {
  // Historical Figures
  'Skënderbeu': { 
    years: '1405-1468', 
    achievement: 'Led resistance against Ottoman Empire for 25 years', 
    quote: '"I have not brought you freedom, I found it here among you."', 
    wiki: 'https://en.wikipedia.org/wiki/Skanderbeg',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Skanderbeg_by_Kol%C3%AB_Idromeno_1890.jpg/250px-Skanderbeg_by_Kol%C3%AB_Idromeno_1890.jpg'
  },
  'Ismail Qemali': { 
    years: '1844-1919', 
    achievement: 'Declared Albanian independence on November 28, 1912', 
    quote: '"Albania is free, independent, and sovereign."', 
    wiki: 'https://en.wikipedia.org/wiki/Ismail_Qemali',
    image: 'https://imgs.search.brave.com/nFQC5dwzqVcfWVmEq1mg3xU3wqRf_z-JrR8aMmcH8OA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmluZGFncmF2/ZS5jb20vcGhvdG9z/LzIwMjAvMTMwLzIw/OTkxMTE1MV8zNzI2/OWViZi00ZDU1LTQx/ZWUtYjkwNC00Y2M2/MzYwZjk3MzQuanBl/Zz9zaXplPXBob3Rv/czI1MA'
  },
  'Isa Boletini': { 
    years: '1864-1916', 
    achievement: 'Led guerrilla resistance and fought for Albanian independence', 
    quote: '"Better to die on your feet than live on your knees."', 
    wiki: 'https://en.wikipedia.org/wiki/Isa_Boletini',
    image: 'https://i0.wp.com/mitrovicaguide.com/wp-content/uploads/2014/03/The_new_Isa_Boletini-2.jpg?fit=357%2C400&ssl=1'
  },
  'Fan Noli': { 
    years: '1882-1965', 
    achievement: 'Founded Albanian Orthodox Church, served as Prime Minister', 
    quote: '"The pen is mightier than the sword."', 
    wiki: 'https://en.wikipedia.org/wiki/Fan_Noli',
    image: 'https://imgs.search.brave.com/HD6FP_EA4Hqume4n6y2ROuq85YPykVaFe3jNoOYiHC4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mYW5u/b2xpbGlicmFyeS5v/cmcvd3AtY29udGVu/dC91cGxvYWRzLzIw/MTgvMTAvRmFuLVMu/LU5vbGkuanBn'
  },
  
  // Scientists & Thinkers
  'Ismail Kadare': { 
    years: '1936-2024', 
    achievement: 'Nominated for Nobel Prize in Literature multiple times', 
    quote: '"Literature is the memory of humanity."', 
    wiki: 'https://en.wikipedia.org/wiki/Ismail_Kadare',
    image: 'https://imgs.search.brave.com/jgX4NxB4rCuSAN-8MF6Y-3FARr17Iu_6Or-IoMbDryA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTgz/NDMwOTI2L3Bob3Rv/L3BvcnRyYWl0LWRp/c21haWwta2FkYXJl/LXBvJUMzJUE4dGUt/ZXQtcm9tYW5jaWVy/LWFsYmFuYWlzLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1R/ZlJhdjR3dGNYeE5a/WFM1LXRDbnNjc1Bk/dENtalV4SWplN0pf/aUZxQ04wPQ'
  },
  'Ibrahim Rugova': { 
    years: '1944-2006', 
    achievement: 'First President of Kosovo, led peaceful resistance', 
    quote: '"Peace is the only way forward."', 
    wiki: 'https://en.wikipedia.org/wiki/Ibrahim_Rugova',
    image: 'https://imgs.search.brave.com/uIrCp77ipZPV7fY7JC1HH8F2XiiM8l43IFSmplXykuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTQx/Nzk3OTQ3L3Bob3Rv/L3J1Z292YS1pYnJh/aGltLWxpdGVyYXR1/cndpc3NlbnNjaGFm/dGxlci1wb2xpdGlr/ZXIta29zb3ZvZ3J1/ZW5kZXItZGVyLWRl/bW9rcmF0aXNjaGVu/LWxpZ2EtZGVzLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz10/N3hVS1RXMkNhQzRK/WklsZmRVQWczMXhy/N19wSkVSN19FU2RN/MjZSUWprPQ'
  },
  'Sami Frashëri': { 
    years: '1850-1904', 
    achievement: 'Key figure in Albanian National Awakening', 
    quote: '"Albania for the Albanians."', 
    wiki: 'https://en.wikipedia.org/wiki/Sami_Frash%C3%ABri',
    image: 'https://imgs.search.brave.com/q3rDYuLMp_o0LQO85a9afI-tAUBSNW-9FjXdh011Et0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXN2Yy5hbmNlc3Ry/eS5jb20vdjIvaW1h/Z2UvbmFtZXNwYWNl/cy8xMDkzL21lZGlh/L2JkMzJkMTM0LTBm/Y2MtNGZhMC1hNWVi/LWJhOWIxMDRlYzE1/Mi5qcGc_Q2xpZW50/PWFzdHJvLXNlb2xv/cHAmTWF4U2lkZT0x/NjA'
  },
  'Naim Frashëri': { 
    years: '1846-1900', 
    achievement: 'National poet, wrote "History of Skanderbeg"', 
    quote: '"O mountains of Albania, and you, O trees so lofty."', 
    wiki: 'https://en.wikipedia.org/wiki/Naim_Frash%C3%ABri',
    image: 'https://imgs.search.brave.com/FgsL0JomQP2FQhbwTz5yZWnQVyht4W7XfKzoBOkKmV8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kdWNr/ZHVja2dvLmNvbS9p/LzFlMzA5MjM1Lmpw/Zw'
  },
  
  // Actors
  'James Belushi': { 
    years: '1954-present', 
    achievement: 'Star of "According to Jim", SNL cast member', 
    quote: '"My Albanian heritage is everything to me."', 
    wiki: 'https://en.wikipedia.org/wiki/Jim_Belushi',
    image: 'https://imgs.search.brave.com/iWzE_t9l2rKqkBVgi0PmjVvcQAe9HWY2JFgl8__3zJ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODk3/NjY2NDcvcGhvdG8v/amFtZXMtYmVsdXNo/aS13aWZlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1YUkxw/dzRPRlNzTEtCNXh2/d0pZenM1VS1JYjNH/a0RFejNGM043Z2I2/TXZZPQ'
  },
  'Eliza Dushku': { 
    years: '1980-present', 
    achievement: 'Starred in Buffy, Angel, Dollhouse', 
    quote: '"I\'m proud of my Albanian roots."', 
    wiki: 'https://en.wikipedia.org/wiki/Eliza_Dushku',
    image: 'https://imgs.search.brave.com/CD2YLK4a9A481P2UDwesw6QTNL5fcSOZ4vA9wsjXj6k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9lbGl6/YS1kdXNoa3UtMjU2/NzQyNzIuanBn'
  },
  'Masiela Lusha': { 
    years: '1985-present', 
    achievement: 'Played Carmen on George Lopez Show', 
    quote: '"Albania is always in my heart."', 
    wiki: 'https://en.wikipedia.org/wiki/Masiela_Lusha',
    image: 'https://imgs.search.brave.com/C_hbu2v2pUwXlJ1T71P_AzT125FGaAq4dtm8vom8PdI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vMTY5NDM0/MS81NzEyL2kvNDUw/L2RlcG9zaXRwaG90/b3NfNTcxMjQwMDMt/c3RvY2stcGhvdG8t/bWFzaWVsYS1sdXNo/YS5qcGc'
  },
  'Bekim Fehmiu': { 
    years: '1936-2010', 
    achievement: 'First Albanian international film star', 
    quote: '"Art has no borders."', 
    wiki: 'https://en.wikipedia.org/wiki/Bekim_Fehmiu',
    image: 'https://imgs.search.brave.com/fYp9h1fIpssj4VnoG5z29Iw0B6lUBkXaoad_JUTzLtE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQ5/OTgyOTAwL3Bob3Rv/L2Jla2ltLWZlaG1p/dS15dWdvc2xhdi1z/dGFyLXdoby1wbGF5/cy10aGUtcm9sZS1v/Zi1kYXgtaW4tdGhl/LWZpbG0tdGhlLWFk/dmVudHVyZXJzLTE5/NzAuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXpZMjhCenk0/TzkyZ2VzU1BVYjFS/VC1NUFBnZjA4SjVk/aXNvTmszNjZnaWs9'
  },
  
  // International Contributors
  'Mother Teresa': { 
    years: '1910-1997', 
    achievement: 'Nobel Peace Prize 1979, canonized as Saint in 2016', 
    quote: '"If you judge people, you have no time to love them."', 
    wiki: 'https://en.wikipedia.org/wiki/Mother_Teresa',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/250px-Mother_Teresa_1.jpg'  },
  'John Belushi': { 
    years: '1949-1982', 
    achievement: 'SNL original cast, starred in Blues Brothers', 
    quote: '"I owe it all to little chocolate donuts."', 
    wiki: 'https://en.wikipedia.org/wiki/John_Belushi',
    image: 'https://imgs.search.brave.com/7tsUO4cNv2RisYRmmbDopsfsj3bWyXLjEgOG9tNyefk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wZW9w/bGUuY29tL3RobWIv/VzBlaV9BcDdldHlE/ZjdBMEpROGJQdVN4/ajkwPS80MDAweDAv/ZmlsdGVyczpub191/cHNjYWxlKCk6bWF4/X2J5dGVzKDE1MDAw/MCk6c3RyaXBfaWNj/KCk6Zm9jYWwoNDMy/eDExOTo0MzR4MTIx/KTpmb3JtYXQod2Vi/cCkvam9obi1iZWx1/c2hpLWRlYXRoLXNu/bC0wMzA0MjUtYWVj/ZmZkMTE2ODAyNDMz/N2E3ZDBlODM2MGIx/MjVlYjMuanBn'
  },
  'Jim Belushi': { 
    years: '1954-present', 
    achievement: 'Actor, comedian, musician', 
    quote: '"Comedy is in my blood."', 
    wiki: 'https://en.wikipedia.org/wiki/Jim_Belushi',
    image: 'https://imgs.search.brave.com/iWzE_t9l2rKqkBVgi0PmjVvcQAe9HWY2JFgl8__3zJ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODk3/NjY2NDcvcGhvdG8v/amFtZXMtYmVsdXNo/aS13aWZlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1YUkxw/dzRPRlNzTEtCNXh2/d0pZenM1VS1JYjNH/a0RFejNGM043Z2I2/TXZZPQ'
  },
  
  // Singers
  'Rita Ora': { 
    years: '1990-present', 
    achievement: 'Multi-platinum artist, 4 UK #1 singles', 
    quote: '"Kosovo is my heart, UK is my home."', 
    wiki: 'https://en.wikipedia.org/wiki/Rita_Ora',
    image: 'https://imgs.search.brave.com/AT18oh2fpQEOT8aBhN4gyqA79AOXn4zvPe1Iid55V1s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dXNtYWdhemluZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDkvUml0YS1P/cmEtSm9pbnMtSnVk/Z2VzLVBhbmVsLW9u/LVRoZS1NYXNrZWQt/U2luZ2VyLTEuanBn/P3c9ODAwJnF1YWxp/dHk9NDAmc3RyaXA9/YWxs'
  },
  'Dua Lipa': { 
    years: '1995-present', 
    achievement: '6 Grammy nominations, 3 wins, global superstar', 
    quote: '"I want to make my parents and Kosovo proud."', 
    wiki: 'https://en.wikipedia.org/wiki/Dua_Lipa',
    image: 'https://imgs.search.brave.com/74V2bkyxbkWoGpAXa_HS3ZVV-PUnyQAmJDvSjhYR0o4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvZHVh/LWxpcGEtMTI4MC14/LTE3MDctcGljdHVy/ZS16NXViMzF4cHlw/bDVjemNyLmpwZw'
  },
  'Bebe Rexha': { 
    years: '1989-present', 
    achievement: 'Grammy-nominated, wrote hits for Eminem, Rihanna', 
    quote: '"My Albanian blood runs deep."', 
    wiki: 'https://en.wikipedia.org/wiki/Bebe_Rexha',
    image: 'https://imgs.search.brave.com/_etLk5Rso7kiTlp2BKfnMzi8v8MmukqLEQ4GqTljWIY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9iZWJl/LXJleGhhLWxvcy1h/bmdlbGVzLXVzYS1m/ZWJydWFyeS13YXJu/ZXItbXVzaWMtZ3Jv/dXAtcHJlLWdyYW1t/eS1wYXJ0eS1jaXRp/emVuLW5ld3MtcGlj/dHVyZS1wYXVsLXNt/aXRoLWZlYXR1cmVm/bGFzaC0zMTM0NTk4/ODMuanBn'
  },
  'Era Istrefi': { 
    years: '1994-present', 
    achievement: '"Bonbon" viral hit, FIFA World Cup 2018 performer', 
    quote: '"Music connects us all."', 
    wiki: 'https://en.wikipedia.org/wiki/Era_Istrefi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Era_Istrefi_Russia_2018.jpg/250px-Era_Istrefi_Russia_2018.jpg'
  },
  
  // Historical Events
  'Independence 1912': { 
    years: 'November 28, 1912', 
    achievement: 'Albania declared independence from Ottoman Empire', 
    quote: '"The Albanian flag was raised in Vlorë."', 
    wiki: 'https://en.wikipedia.org/wiki/Albanian_Declaration_of_Independence',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Deklarata_e_Pavar%C3%ABsis%C3%AB_%28dokumenti_origjinal_1912%29.jpg/250px-Deklarata_e_Pavar%C3%ABsis%C3%AB_%28dokumenti_origjinal_1912%29.jpg'
  },
  'League of Prizren': { 
    years: 'June 10, 1878', 
    achievement: 'First unified Albanian political organization', 
    quote: '"United for Albanian lands."', 
    wiki: 'https://en.wikipedia.org/wiki/League_of_Prizren',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/League_of_Prizren_Map.png/330px-League_of_Prizren_Map.png'
  },
  'Alphabet Congress': { 
    years: 'November 14-22, 1908', 
    achievement: 'Standardized Albanian alphabet in Monastir', 
    quote: '"One nation, one language, one alphabet."', 
    wiki: 'https://en.wikipedia.org/wiki/Congress_of_Monastir',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Delegat%C3%ABt_e_Kongresit_t%C3%AB_Manastirit.jpg/250px-Delegat%C3%ABt_e_Kongresit_t%C3%AB_Manastirit.jpg'
  },
  'Kosovo Independence': { 
    years: 'February 17, 2008', 
    achievement: 'Kosovo declared independence from Serbia', 
    quote: '"Kosovo is free!"', 
    wiki: 'https://en.wikipedia.org/wiki/2008_Kosovo_declaration_of_independence',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Kosova_independence_Vienna_17-02-2008_b.jpg/250px-Kosova_independence_Vienna_17-02-2008_b.jpg'
  }
};

/**
 * Creates a framed portrait on a room's back wall
 */
export function createPortrait(name, description, roomX, roomZ, positionIndex, frameColor = 0x8B4513, facing = 'front') {
  const roomSize = 12;
  const frameWidth = 1.8;
  const frameHeight = 2.4;
  const frameDepth = 0.15;
  const borderSize = 0.12;
  
  // Get detailed info
  const details = portraitData[name] || {};
  
  // Calculate position based on facing direction
  const spacing = roomSize / 5;
  const offset = (positionIndex - 1.5) * spacing;
  
  let x, y, z, rotationY;
  
  if (facing === 'right') {
    x = roomX - (roomSize / 2) + 0.15;
    y = 3.5;
    z = roomZ + offset;
    rotationY = Math.PI / 2;
  } else if (facing === 'left') {
    x = roomX + (roomSize / 2) - 0.15;
    y = 3.5;
    z = roomZ + offset;
    rotationY = -Math.PI / 2;
  } else {
    x = roomX + offset;
    y = 3.5;
    z = roomZ - (roomSize / 2) + 0.15;
    rotationY = 0;
  }
  
  // Frame group
  const frameGroup = new THREE.Group();
  
  // Outer frame (wood-like)
  const frameMat = new THREE.MeshStandardMaterial({ 
    color: frameColor, 
    roughness: 0.7,
    metalness: 0.1
  });
  
  // Frame pieces (4 borders)
  const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth + borderSize * 2, borderSize, frameDepth),
    frameMat
  );
  topFrame.position.set(0, frameHeight / 2 + borderSize / 2, 0);
  frameGroup.add(topFrame);
  
  const bottomFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth + borderSize * 2, borderSize, frameDepth),
    frameMat
  );
  bottomFrame.position.set(0, -frameHeight / 2 - borderSize / 2, 0);
  frameGroup.add(bottomFrame);
  
  const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(borderSize, frameHeight, frameDepth),
    frameMat
  );
  leftFrame.position.set(-frameWidth / 2 - borderSize / 2, 0, 0);
  frameGroup.add(leftFrame);
  
  const rightFrame = new THREE.Mesh(
    new THREE.BoxGeometry(borderSize, frameHeight, frameDepth),
    frameMat
  );
  rightFrame.position.set(frameWidth / 2 + borderSize / 2, 0, 0);
  frameGroup.add(rightFrame);
  
  // Create portrait with image from Wikipedia
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  
  // Background gradient - Albanian dark red theme
  const gradient = ctx.createLinearGradient(0, 0, 0, 340);
  gradient.addColorStop(0, '#2a1515');
  gradient.addColorStop(1, '#1a0a0a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 340);
  
  // Name plate at bottom
  ctx.fillStyle = '#1a0505';
  ctx.fillRect(10, 280, 236, 50);
  ctx.strokeStyle = '#8b0000';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 282, 232, 46);
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, 128, 310);
  
  // Create texture and mesh
  const portraitTexture = new THREE.CanvasTexture(canvas);
  const portraitMat = new THREE.MeshBasicMaterial({ map: portraitTexture });
  const portraitMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(frameWidth, frameHeight),
    portraitMat
  );
  portraitMesh.position.set(0, 0, frameDepth / 2 + 0.01);
  frameGroup.add(portraitMesh);
  
  // Load Wikipedia image asynchronously
  if (details.image) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw image centered in portrait area (above name plate)
      const imgAspect = img.width / img.height;
      const targetWidth = 220;
      const targetHeight = 250;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgAspect > targetWidth / targetHeight) {
        // Image is wider - fit to height
        drawHeight = targetHeight;
        drawWidth = drawHeight * imgAspect;
        drawX = (256 - drawWidth) / 2;
        drawY = 15;
      } else {
        // Image is taller - fit to width
        drawWidth = targetWidth;
        drawHeight = drawWidth / imgAspect;
        drawX = (256 - drawWidth) / 2;
        drawY = 15;
      }
      
      // Clear image area and redraw
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 275);
      
      // Draw image with rounded corners effect
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(18, 15, 220, 250, 8);
      ctx.clip();
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
      
      // Add subtle border around image
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(18, 15, 220, 250, 8);
      ctx.stroke();
      
      // Update texture
      portraitTexture.needsUpdate = true;
    };
    img.onerror = () => {
      // Fallback: draw silhouette if image fails
      ctx.fillStyle = '#3a2020';
      ctx.beginPath();
      ctx.ellipse(128, 100, 50, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(128, 220, 70, 50, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(108, 150, 40, 40);
      portraitTexture.needsUpdate = true;
    };
    img.src = details.image;
  } else {
    // No image - draw silhouette
    ctx.fillStyle = '#3a2020';
    ctx.beginPath();
    ctx.ellipse(128, 100, 50, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(128, 220, 70, 50, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(108, 150, 40, 40);
    portraitTexture.needsUpdate = true;
  }
  
  // Position the whole frame group
  frameGroup.position.set(x, y, z);
  frameGroup.rotation.y = rotationY;
  scene.add(frameGroup);
  
  // Note: Room lighting is handled by shared lights for better performance
  
  // Make clickable - use the portrait mesh for interaction
  portraitMesh.userData.label = name;
  portraitMesh.userData.description = description;
  portraitMesh.userData.isPortrait = true;
  portraitMesh.userData.facing = facing;
  portraitMesh.userData.years = details.years || '';
  portraitMesh.userData.achievement = details.achievement || '';
  portraitMesh.userData.quote = details.quote || '';
  portraitMesh.userData.wiki = details.wiki || '';
  
  // Need to update world matrix for raycasting
  frameGroup.updateMatrixWorld(true);
  exhibits.push(portraitMesh);
  
  return frameGroup;
}
