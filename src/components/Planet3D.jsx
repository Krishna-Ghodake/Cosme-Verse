// Planet3D.jsx - Procedural 3D Orthographic Canvas Sphere Renderer
import React, { useRef, useEffect, useState } from 'react';
import spaceSounds from './SoundManager';

const Planet3D = ({ planet, mode = 'focus' }) => {
  const canvasRef = useRef(null);
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [rotationX, setRotationX] = useState(0.1); // Axial tilt
  const [rotationY, setRotationY] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isOrbitMode, setIsOrbitMode] = useState(false);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  const toggleOrbitMode = () => {
    spaceSounds.playClick();
    const nextMode = !isOrbitMode;
    setIsOrbitMode(nextMode);
    if (nextMode) {
      window.dispatchEvent(new CustomEvent('unlock-achievement', {
        detail: {
          id: 'orbital-cadet',
          title: 'Orbital Cadet',
          desc: `Placed ${planet.name} into automated orbital tracking lock!`
        }
      }));
    }
  };

  // Reset controls
  const handleReset = () => {
    spaceSounds.playClick();
    setZoomFactor(1.0);
    setRotationX(0.1);
    setRotationY(0);
    setPanX(0);
    setPanY(0);
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    const deltaY = e.clientY - lastMouseY.current;

    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;

    if (e.shiftKey) {
      // Pan camera
      setPanX((prev) => prev + deltaX);
      setPanY((prev) => prev + deltaY);
    } else {
      // Rotate planet
      setRotationY((prev) => prev + deltaX * 0.007);
      setRotationX((prev) => Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev + deltaY * 0.007)));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Zoom handlers via wheel
  const handleWheel = (e) => {
    e.preventDefault();
    setZoomFactor((prev) => Math.max(0.5, Math.min(3.0, prev - e.deltaY * 0.0015)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse handlers on canvas
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        lastMouseX.current = e.touches[0].clientX;
        lastMouseY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - lastMouseX.current;
      const deltaY = e.touches[0].clientY - lastMouseY.current;

      lastMouseX.current = e.touches[0].clientX;
      lastMouseY.current = e.touches[0].clientY;

      setRotationY((prev) => prev + deltaX * 0.01);
      setRotationX((prev) => Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev + deltaY * 0.01)));
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  // 60FPS Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let autoRotation = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 400;
      canvas.height = parent.clientHeight || 400;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2 + panX;
      const cy = canvas.height / 2 + panY;
      const baseR = Math.min(canvas.width, canvas.height) * 0.28;
      const r = baseR * zoomFactor;

      // Spin rotation calculation
      autoRotation = (autoRotation + 0.0015) % (Math.PI * 2);
      const theta = rotationY + autoRotation; // longitude
      const phi = rotationX; // latitude tilt

      // 1. Draw Rings behind the planet (Saturn/Uranus)
      if (planet.id === 'saturn' || planet.id === 'uranus') {
        drawRings(ctx, cx, cy, r, phi, theta, true);
      }

      // 2. Atmospheric scattering glow (Outer Halo)
      const glowGrad = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + r * 0.25);
      glowGrad.addColorStop(0, planet.glowColor || 'rgba(0, 240, 255, 0.3)');
      glowGrad.addColorStop(0.3, planet.glowColor ? planet.glowColor.replace('0.4', '0.15') : 'rgba(0, 240, 255, 0.1)');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r + r * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw base solid sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip(); // Clip all continents/gas bands to this circle

      // Draw base color
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Draw procedural texture layers
      drawProceduralTexture(ctx, cx, cy, r, theta, phi, planet.id);

      // Draw standard 3D Spherical Shading Layer (Lambertian diffuse + Specular highlight)
      // Light source comes from top-left (cx - r*0.5, cy - r*0.5)
      const lightX = cx - r * 0.4;
      const lightY = cy - r * 0.4;
      
      // Shadow Overlay radial gradient
      const shadowGrad = ctx.createRadialGradient(lightX, lightY, r * 0.2, cx + r * 0.2, cy + r * 0.2, r * 1.35);
      shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)'); // specular sheen
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
      shadowGrad.addColorStop(0.9, 'rgba(0, 0, 0, 0.85)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 4. Draw Rings in front of the planet (Saturn/Uranus)
      if (planet.id === 'saturn' || planet.id === 'uranus') {
        drawRings(ctx, cx, cy, r, phi, theta, false);
      }

      // 5. Draw Orbit Mode overlay indicator
      if (isOrbitMode) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.8, r * 0.5, phi, 0, Math.PI * 2);
        ctx.stroke();

        // Moons
        const moonT = autoRotation * 3;
        const mx = cx + Math.cos(moonT) * r * 1.8;
        const my = cy + Math.sin(moonT) * r * 0.5;
        
        ctx.fillStyle = '#b9cacb';
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'var(--primary-container)';
        ctx.shadowBlur = 5;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [planet, zoomFactor, rotationX, rotationY, panX, panY, isOrbitMode]);

  // Procedural Texture Painter based on planet classification/ID
  const drawProceduralTexture = (ctx, cx, cy, r, theta, phi, id) => {
    const shift = (theta * r) % (r * 2);

    if (id === 'earth') {
      // Blue base + green continents
      ctx.fillStyle = 'rgba(46, 204, 113, 0.6)'; // Green lands
      // Draw 3 shifting continent circles / blobs
      for (let offset = -2; offset <= 2; offset++) {
        const xOffset = offset * r * 1.8 + shift;
        ctx.beginPath();
        ctx.arc(cx + xOffset, cy - r * 0.1, r * 0.55, 0, Math.PI * 2);
        ctx.arc(cx + xOffset - r * 0.3, cy + r * 0.3, r * 0.4, 0, Math.PI * 2);
        ctx.arc(cx + xOffset + r * 0.4, cy - r * 0.4, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Clouds layer (white semi-transparent drifting blobs)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      const cloudShift = (theta * 1.25 * r) % (r * 2);
      for (let offset = -2; offset <= 2; offset++) {
        const xOffset = offset * r * 1.8 + cloudShift;
        ctx.beginPath();
        ctx.arc(cx + xOffset - r * 0.1, cy - r * 0.25, r * 0.45, 0, Math.PI * 2);
        ctx.arc(cx + xOffset + r * 0.3, cy + r * 0.2, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (id === 'jupiter' || id === 'saturn' || id === 'neptune' || id === 'uranus') {
      // Gas Giants: Horizontal banding
      const bandColors = {
        jupiter: ['#ffe082', '#ffb74d', '#e0a96d', '#d7ccc8', '#bcaaa4', '#8d6e63'],
        saturn: ['#e0a96d', '#ffe082', '#bcaaa4', '#cfd8dc', '#b0bec5'],
        uranus: ['#80deea', '#b2ebf2', '#e0f7fa', '#4dd0e1'],
        neptune: ['#3f51b5', '#5c6bc0', '#283593', '#1a237e']
      }[id];

      // Draw horizontal bands
      const bandHeight = r * 0.15;
      for (let y = -r; y < r; y += bandHeight) {
        const normY = y / r;
        const colorIdx = Math.abs(Math.floor(normY * bandColors.length)) % bandColors.length;
        
        ctx.fillStyle = bandColors[colorIdx];
        ctx.fillRect(cx - r, cy + y, r * 2, bandHeight + 1);
      }

      // Add storms/vortices for Jupiter (Great Red Spot)
      if (id === 'jupiter') {
        const spotX = cx + ((theta * r) % (r * 2)) - r;
        ctx.fillStyle = '#e53935'; // Red spot
        ctx.beginPath();
        ctx.ellipse(spotX, cy + r * 0.25, r * 0.2, r * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Inner white vortex ring
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (id === 'mars') {
      // Mars: Red rust + iron plains + polar white ice caps
      ctx.fillStyle = '#b71c1c'; // Dark iron deposits
      for (let offset = -2; offset <= 2; offset++) {
        const xOffset = offset * r * 1.8 + shift;
        ctx.beginPath();
        ctx.arc(cx + xOffset - r * 0.3, cy + r * 0.15, r * 0.35, 0, Math.PI * 2);
        ctx.arc(cx + xOffset + r * 0.4, cy - r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // White Polar Cap (Ice caps)
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(cx, cy - r, r * 0.28, 0, Math.PI); // Northern cap
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy + r, r * 0.15, Math.PI, 0); // Southern cap
      ctx.fill();
    } else {
      // Mercury & Venus: Craters or sulfur swirls
      const colorPlains = id === 'mercury' ? 'rgba(0,0,0,0.12)' : 'rgba(230,124,115,0.15)';
      ctx.fillStyle = colorPlains;
      
      for (let offset = -2; offset <= 2; offset++) {
        const xOffset = offset * r * 1.8 + shift;
        ctx.beginPath();
        ctx.arc(cx + xOffset - r * 0.2, cy + r * 0.1, r * 0.25, 0, Math.PI * 2);
        ctx.arc(cx + xOffset + r * 0.3, cy - r * 0.3, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // Depth-Sorted Rings Drawer (Back vs Front half occlusion)
  const drawRings = (ctx, cx, cy, r, phi, theta, drawBack) => {
    ctx.save();
    
    // Rings tilt details
    const rx = r * (planet.id === 'saturn' ? 2.3 : 1.7); // ring width scale
    const ry = r * 0.45; // ring tilt flat thickness
    const tilt = 12 * (Math.PI / 180); // tilt rotation angle

    // Clip half plane for occlusion
    ctx.beginPath();
    if (drawBack) {
      // Draw back half of rings: clip out the bottom half of screen
      ctx.rect(cx - rx * 1.2, cy - ry * 3, rx * 2.4, ry * 3.1);
    } else {
      // Draw front half of rings: clip out the top half of screen
      ctx.rect(cx - rx * 1.2, cy - ry * 0.05, rx * 2.4, ry * 3.1);
    }
    ctx.clip();

    // Render concentric ring bands
    const ringConfig = planet.id === 'saturn' 
      ? [
          { inner: r * 1.25, outer: r * 1.6, color: 'rgba(215, 204, 200, 0.45)' }, // Inner band
          { inner: r * 1.63, outer: r * 2.1, color: 'rgba(224, 169, 109, 0.7)' }, // Main band A
          { inner: r * 2.13, outer: r * 2.3, color: 'rgba(188, 170, 164, 0.35)' }  // Outer thin band
        ]
      : [
          { inner: r * 1.2, outer: r * 1.3, color: 'rgba(128, 222, 234, 0.25)' }, // Faint blue vertical rings
          { inner: r * 1.4, outer: r * 1.5, color: 'rgba(128, 222, 234, 0.35)' }
        ];

    ringConfig.forEach(band => {
      const grad = ctx.createRadialGradient(cx, cy, band.inner, cx, cy, band.outer);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.2, band.color);
      grad.addColorStop(0.8, band.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = band.outer - band.inner;
      ctx.beginPath();
      
      const midRadiusX = (band.inner + band.outer) / 2;
      const midRadiusY = midRadiusX * (ry / rx);

      ctx.ellipse(cx, cy, midRadiusX, midRadiusY, tilt, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px', cursor: 'grab' }}>
      
      {/* 3D Canvas element */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Floating HUD Controller HUD */}
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
            onClick={toggleOrbitMode}
            className={`btn-ghost ${isOrbitMode ? 'active' : ''}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '9px', 
              borderRadius: '4px',
              background: isOrbitMode ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0,0,0,0.4)',
              borderColor: isOrbitMode ? 'var(--primary-container)' : 'rgba(255,255,255,0.1)'
            }}
          >
            {isOrbitMode ? 'EXIT ORBIT' : 'ENTER ORBIT'}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '9px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)' }}
          >
            RESET
          </button>
        </div>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', textAlign: 'right' }}>
          DRAG TO ROTATE • SCROLL TO ZOOM<br/>
          SHIFT+DRAG TO PAN
        </div>
      </div>
    </div>
  );
};

export default Planet3D;
