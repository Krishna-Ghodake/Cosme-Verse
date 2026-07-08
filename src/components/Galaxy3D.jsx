// Galaxy3D.jsx - Interactive 3D Galaxy Explorer & Cosmic Web Simulator
import React, { useRef, useEffect, useState } from 'react';
import spaceSounds from './SoundManager';

const Galaxy3D = ({ galaxyName = 'Milky Way', arms = 2, colorAccent = 'cyan' }) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1.0);
  const [rotX, setRotX] = useState(0.8); 
  const [rotY, setRotY] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [cinematicMode, setCinematicMode] = useState(false);

  // Layer toggles
  const [layers, setLayers] = useState({
    stars: true,
    dustLanes: true,
    darkMatter: false
  });

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  const particles = useRef([]);
  const clusters = useRef([]); // for Galaxy Cluster mode
  const webNodes = useRef([]); // for Supercluster mode

  // Initialize Galaxy particles based on morphology
  const initGalaxy = () => {
    particles.current = [];
    clusters.current = [];
    webNodes.current = [];

    const lowerName = galaxyName.toLowerCase();

    if (lowerName.includes('supercluster')) {
      // 1. SUPERCLUSTER COSMIC FILAMENT WEB
      const nodeCount = 30;
      for (let i = 0; i < nodeCount; i++) {
        webNodes.current.push({
          x: (Math.random() - 0.5) * 320,
          y: (Math.random() - 0.5) * 320,
          z: (Math.random() - 0.5) * 150,
          size: Math.random() * 6 + 3,
          color: i % 2 === 0 ? '#7df4ff' : '#cf5cff'
        });
      }
      return;
    }

    if (lowerName.includes('cluster')) {
      // 2. GALAXY CLUSTER (15 orbiting galactic cores)
      const clusterCount = 15;
      for (let i = 0; i < clusterCount; i++) {
        clusters.current.push({
          x: (Math.random() - 0.5) * 280,
          y: (Math.random() - 0.5) * 280,
          z: (Math.random() - 0.5) * 120,
          size: Math.random() * 12 + 6,
          color: i % 3 === 0 ? '#ffca28' : i % 3 === 1 ? '#00e676' : '#29b6f6',
          speed: 0.002 + Math.random() * 0.005,
          angle: Math.random() * Math.PI * 2,
          radius: 50 + Math.random() * 120
        });
      }
      return;
    }

    // 3. CARTWHEEL GALAXY (Ring Galaxy: Core + Spokes + Outer Ring)
    if (lowerName.includes('cartwheel')) {
      // Core
      for (let i = 0; i < 400; i++) {
        const radius = Math.random() * 25;
        const angle = Math.random() * Math.PI * 2;
        particles.current.push({
          r: radius,
          theta: angle,
          z: (Math.random() - 0.5) * 6,
          color: '#ffffff',
          size: Math.random() * 1.5 + 0.8,
          isDust: false
        });
      }
      // Outer Ring (radius 130)
      for (let i = 0; i < 1100; i++) {
        const radius = 120 + (Math.random() - 0.5) * 16;
        const angle = Math.random() * Math.PI * 2;
        particles.current.push({
          r: radius,
          theta: angle,
          z: (Math.random() - 0.5) * 5,
          color: '#cf5cff',
          size: Math.random() * 1.2 + 0.5,
          isDust: false
        });
      }
      // Radial Spokes (8 spokes connecting core to ring)
      for (let i = 0; i < 300; i++) {
        const spokeIdx = i % 8;
        const spokeAngle = (spokeIdx * 2 * Math.PI) / 8;
        const radius = 25 + Math.random() * 95;
        particles.current.push({
          r: radius,
          theta: spokeAngle + (Math.random() - 0.5) * 0.08,
          z: (Math.random() - 0.5) * 3,
          color: '#7df4ff',
          size: Math.random() * 1.0 + 0.4,
          isDust: false
        });
      }
      return;
    }

    // 4. STANDARD SPIRALS & INTERACTIVES (Milky Way, Andromeda, Whirlpool, Sombrero, Black Eye)
    const count = 1800;
    
    // Core bulb
    for (let i = 0; i < 400; i++) {
      const radius = Math.random() * 28;
      const angle = Math.random() * Math.PI * 2;
      particles.current.push({
        r: radius,
        theta: angle,
        z: (Math.random() - 0.5) * 8,
        color: '#ffffff',
        size: Math.random() * 1.5 + 0.8,
        isDust: false
      });
    }

    // Spiral arms
    const b = 0.28;
    const a = 12;
    for (let i = 0; i < count - 400; i++) {
      const r = a + Math.pow(Math.random(), 1.5) * 160;
      const armIdx = i % arms;
      const armAngle = (armIdx * 2 * Math.PI) / arms;
      const spiralAngle = (1 / b) * Math.log(r / a) + armAngle;

      const spreadX = (Math.random() - 0.5) * (r * 0.22);
      const spreadY = (Math.random() - 0.5) * (r * 0.22);
      const spreadZ = (Math.random() - 0.5) * (12 - r * 0.03);

      const px = Math.cos(spiralAngle) * r + spreadX;
      const py = Math.sin(spiralAngle) * r + spreadY;

      const finalR = Math.sqrt(px * px + py * py);
      const finalAngle = Math.atan2(py, px);

      const isDustParticle = i % 5 === 0;

      // Color scheme
      let col = '#dbfcff';
      if (isDustParticle) {
        // Red/Orange dust lane absorbs light
        col = 'rgba(255, 110, 64, 0.45)';
      } else {
        const rand = Math.random();
        if (colorAccent === 'cyan') {
          if (rand < 0.25) col = '#00f0ff';
          else if (rand < 0.45) col = '#cf5cff';
          else if (rand < 0.7) col = '#7df4ff';
        } else {
          if (rand < 0.25) col = '#ff9800';
          else if (rand < 0.45) col = '#ff5722';
          else if (rand < 0.7) col = '#ffe082';
        }
      }

      particles.current.push({
        r: finalR,
        theta: finalAngle,
        z: spreadZ,
        color: col,
        size: isDustParticle ? Math.random() * 4.5 + 2.0 : Math.random() * 1.2 + 0.4,
        isDust: isDustParticle
      });
    }
  };

  useEffect(() => {
    initGalaxy();
  }, [galaxyName, arms, colorAccent]);

  // Drag and zoom handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      setCinematicMode(false);
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouseX.current;
      const dy = e.clientY - lastMouseY.current;

      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;

      setRotY(prev => prev + dx * 0.006);
      setRotX(prev => Math.max(0.1, Math.min(Math.PI / 1.8, prev + dy * 0.006)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      setZoom(prev => Math.max(0.2, Math.min(5.0, prev - e.deltaY * 0.0015)));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // 60FPS Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let autoTime = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 600;
      canvas.height = parent.clientHeight || 450;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2 + panX;
      const cy = canvas.height / 2 + panY;

      // Cinematic fly-through slow swooping zoom and rotation
      if (cinematicMode) {
        autoTime += 0.006;
        setZoom(1.2 + Math.sin(autoTime * 0.5) * 0.6);
        setRotX(0.7 + Math.cos(autoTime * 0.3) * 0.15);
        setRotY(autoTime * 0.1);
      }

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Check if cluster or cosmic web filaments modes are active
      const lowerName = galaxyName.toLowerCase();

      if (lowerName.includes('supercluster')) {
        // DRAW WEB FILAMENTS AND NODES
        drawCosmicWeb(ctx, cx, cy, cosX, sinX, cosY, sinY);
        animId = requestAnimationFrame(draw);
        return;
      }

      if (lowerName.includes('cluster')) {
        // DRAW GALAXY CLUSTERS
        drawGalaxyClusters(ctx, cx, cy, cosX, sinX, cosY, sinY, time => time + 0.1);
        animId = requestAnimationFrame(draw);
        return;
      }

      // DRAW PARTICLES (Spirals/Rings)
      const projected = [];

      // 1. Plot Dark Matter Halo (large diffuse outer sphere)
      if (layers.darkMatter) {
        ctx.save();
        const haloR = 190 * zoom * (Math.min(canvas.width, canvas.height) / 380);
        const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
        haloGrad.addColorStop(0, 'rgba(156, 39, 176, 0.08)');
        haloGrad.addColorStop(0.5, 'rgba(156, 39, 176, 0.02)');
        haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Project stars and dust particles
      particles.current.forEach((p, idx) => {
        // Orbit speed calculations
        const speedMultiplier = 0.001 + (20 / (p.r + 10)) * 0.005;
        const currentAngle = p.theta + (cinematicMode ? autoTime * (speedMultiplier * 6) : 0);

        const x3d = Math.cos(currentAngle) * p.r * zoom;
        const y3d = Math.sin(currentAngle) * p.r * zoom;
        const z3d = p.z * zoom;

        // Matrix rotate
        const xRot1 = x3d * cosY - z3d * sinY;
        const zRot1 = x3d * sinY + z3d * cosY;
        const yRot2 = y3d * cosX - zRot1 * sinX;
        const zRot2 = y3d * sinX + zRot1 * cosX;

        // Skip drawing based on active layer toggles
        if (p.isDust && !layers.dustLanes) return;
        if (!p.isDust && !layers.stars) return;

        projected.push({
          x: cx + xRot1,
          y: cy + yRot2,
          zDepth: zRot2,
          color: p.color,
          size: p.size * (zRot2 > 0 ? 1.25 : 0.8) * (zoom > 1.2 ? 1.2 : 0.95),
          isDust: p.isDust
        });
      });

      // Painter's algorithm sort
      projected.sort((a, b) => a.zDepth - b.zDepth);

      // Render
      projected.forEach(p => {
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) return;

        ctx.fillStyle = p.color;
        // Set transparent blend for dust clouds
        ctx.globalAlpha = p.isDust ? 0.35 : Math.max(0.15, Math.min(1.0, 0.7 + p.zDepth * 0.003));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0; // reset

      // 3. Central Accretion Bulge
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * zoom);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.35, colorAccent === 'cyan' ? 'rgba(0, 240, 255, 0.65)' : 'rgba(255, 152, 0, 0.65)');
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 28 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw interactive holographic labels
      if (zoom > 0.8) {
        drawHolographicLabel(ctx, cx, cy, 'SINGULARITY CORE (Sgr A*)', 0, 0, 0, cosX, sinX, cosY, sinY);
        drawHolographicLabel(ctx, cx, cy, 'ORION-CYGNUS SPUR', 75 * zoom, 45 * zoom, 5, cosX, sinX, cosY, sinY);
        drawHolographicLabel(ctx, cx, cy, 'OUTER STELLAR HALO', -120 * zoom, -90 * zoom, -2, cosX, sinX, cosY, sinY);
      }

      animId = requestAnimationFrame(draw);
    };

    // Helper: Draw filaments network (Cosmic filaments web)
    const drawCosmicWeb = (ctx, cx, cy, cosX, sinX, cosY, sinY) => {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;

      // Draw filament lines between near nodes
      const projected = webNodes.current.map(n => {
        const xRot1 = n.x * zoom * cosY - n.z * zoom * sinY;
        const zRot1 = n.x * zoom * sinY + n.z * zoom * cosY;
        const yRot2 = n.y * zoom * cosX - zRot1 * sinX;
        return { x: cx + xRot1, y: cy + yRot2, size: n.size * zoom, color: n.color };
      });

      // Render lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dist = Math.hypot(projected[i].x - projected[j].x, projected[i].y - projected[j].y);
          if (dist < 110 * zoom) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 - (dist / 110 * 0.15)})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projected.forEach(node => {
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Helper: Draw Cluster Galaxies
    const drawGalaxyClusters = (ctx, cx, cy, cosX, sinX, cosY, sinY) => {
      clusters.current.forEach(c => {
        c.angle += c.speed;
        // Orbit motion
        const x3d = Math.cos(c.angle) * c.radius * zoom;
        const z3d = Math.sin(c.angle) * c.radius * zoom;
        const y3d = (c.y + Math.sin(c.angle) * 15) * zoom;

        const xRot = x3d * cosY - z3d * sinY;
        const zRot = x3d * sinY + z3d * cosY;
        const yRot = y3d * cosX - zRot * sinX;

        const px = cx + xRot;
        const py = cy + yRot;

        // Draw mini rotating galaxy bulb
        const grad = ctx.createRadialGradient(px, py, 0, px, py, c.size * zoom);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, c.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, c.size * zoom, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Helper: Draw floating vector text labels
    const drawHolographicLabel = (ctx, cx, cy, text, x, y, z, cosX, sinX, cosY, sinY) => {
      const xRot1 = x * cosY - z * sinY;
      const zRot1 = x * sinY + z * cosY;
      const yRot2 = y * cosX - zRot1 * sinX;

      const px = cx + xRot1;
      const py = cy + yRot2;

      ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.font = '8px var(--font-data)';
      ctx.textAlign = 'left';

      // Draw vector connector line
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 15, py - 12);
      ctx.lineTo(px + 65, py - 12);
      ctx.stroke();

      ctx.fillText(text, px + 18, py - 16);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [zoom, rotX, rotY, panX, panY, cinematicMode, layers, galaxyName, colorAccent]);

  // Handle Layer checks
  const toggleLayer = (layerKey) => {
    spaceSounds.playClick();
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      
      {/* 3D Canvas */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Floating Layer Toggle HUD (Top Right Overlay) */}
      {!lowerNameContains(galaxyName, 'cluster') && !lowerNameContains(galaxyName, 'supercluster') && (
        <div 
          className="glass-panel animate-float"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '12px',
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '9px',
            fontFamily: 'var(--font-data)',
            zIndex: 20
          }}
        >
          <div style={{ color: 'var(--primary-container)', fontWeight: 'bold', marginBottom: '4px' }}>STRUCTURE LAYERS</div>
          {Object.keys(layers).map(k => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: layers[k] ? '#fff' : 'var(--on-surface-variant)' }}>
              <input 
                type="checkbox" 
                checked={layers[k]} 
                onChange={() => toggleLayer(k)} 
                style={{ cursor: 'pointer' }}
              />
              {k.replace('Lanes', '').toUpperCase()} VISUAL
            </label>
          ))}
        </div>
      )}

      {/* Floating HUD Controller */}
      <div 
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          <button
            onClick={() => { spaceSounds.playClick(); setCinematicMode(prev => !prev); }}
            className="btn-ghost"
            style={{ 
              padding: '6px 12px', 
              fontSize: '9px', 
              borderRadius: 'var(--radius-sm)',
              background: cinematicMode ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0,0,0,0.4)',
              borderColor: cinematicMode ? 'var(--primary-container)' : 'rgba(255,255,255,0.1)'
            }}
          >
            {cinematicMode ? 'LOCK FLIGHT' : 'CINEMATIC FLY-BY'}
          </button>
          <button
            onClick={() => { spaceSounds.playClick(); setZoom(1.0); setRotX(0.8); setRotY(0); setPanX(0); setPanY(0); setCinematicMode(false); }}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '9px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.4)' }}
          >
            RESET
          </button>
        </div>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', textAlign: 'right', lineHeight: '12px' }}>
          DRAG TO TILT/SPIN • SCROLL FOR ZOOM<br/>
          DOUBLE-CLICK TARGET SPURS TO LOCK VIEW
        </div>
      </div>

    </div>
  );
};

// Helper name checks
const lowerNameContains = (name, checkStr) => {
  return name.toLowerCase().includes(checkStr);
};

export default Galaxy3D;
