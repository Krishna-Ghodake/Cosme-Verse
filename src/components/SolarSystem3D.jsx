// SolarSystem3D.jsx - Interactive 3D Solar System Keplerian Orbit Map
import React, { useRef, useEffect, useState } from 'react';
import { planets } from '../data/planets';
import spaceSounds from './SoundManager';

const SolarSystem3D = ({ onSelectPlanet }) => {
  const canvasRef = useRef(null);
  const [rotX, setRotX] = useState(1.1); // Tilted 3D plane angle
  const [rotY, setRotY] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const mouseCoords = useRef({ x: 0, y: 0 });

  // Orbit radius scales (scaled to fit nicely in 600x400 canvas)
  const orbitRadii = {
    mercury: 45,
    venus: 75,
    earth: 105,
    mars: 135,
    jupiter: 175,
    saturn: 215,
    uranus: 250,
    neptune: 285
  };

  // Orbital speeds (inverse of orbital period, Keplerian ratios)
  const orbitSpeeds = {
    mercury: 0.04,
    venus: 0.015,
    earth: 0.01,
    mars: 0.008,
    jupiter: 0.003,
    saturn: 0.0018,
    uranus: 0.0009,
    neptune: 0.0005
  };

  // Drag anywhere to tilt/rotate orbital planes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseCoords.current.x = e.clientX - rect.left;
      mouseCoords.current.y = e.clientY - rect.top;

      if (!isDragging.current) return;
      const dx = e.clientX - lastMouseX.current;
      const dy = e.clientY - lastMouseY.current;

      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;

      setRotY((prev) => prev + dx * 0.005);
      setRotX((prev) => Math.max(0.3, Math.min(Math.PI / 2, prev + dy * 0.005)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      setZoom((prev) => Math.max(0.4, Math.min(2.0, prev - e.deltaY * 0.0015)));
    };

    // Click handler to select planet
    const handleCanvasClick = () => {
      if (hoveredPlanet) {
        spaceSounds.playPlanetSelect();
        onSelectPlanet(hoveredPlanet);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [hoveredPlanet, onSelectPlanet]);

  // 60FPS Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 600;
      canvas.height = parent.clientHeight || 450;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const activeZoom = zoom * (Math.min(canvas.width, canvas.height) / 720);

      time += 0.5;

      // Cosine and sine calculations for 3D projections
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // 1. Draw glowing Sun at center
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * activeZoom);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#ffca28');
      sunGrad.addColorStop(0.8, '#ff8f00');
      sunGrad.addColorStop(1, 'rgba(5, 20, 36, 0)');
      
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 28 * activeZoom, 0, Math.PI * 2);
      ctx.fill();

      // Bounding sun text
      ctx.fillStyle = '#ffca28';
      ctx.font = '9px var(--font-data)';
      ctx.textAlign = 'center';
      ctx.fillText('SOL (SUN)', cx, cy - 35 * activeZoom);

      let currentHover = null;

      // 2. Draw orbits and planets
      planets.forEach((p) => {
        const orbitRadius = orbitRadii[p.id];
        const orbitSpeed = orbitSpeeds[p.id];
        const planetAngle = time * orbitSpeed;

        // Draw 3D Orbit paths by drawing points around circle
        ctx.strokeStyle = (hoveredPlanet && hoveredPlanet.id === p.id) 
          ? 'rgba(0, 240, 255, 0.45)' 
          : 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        const segments = 120;
        for (let i = 0; i <= segments; i++) {
          const theta = (i * 2 * Math.PI) / segments;
          
          // Polar coordinates
          const x0 = Math.cos(theta) * orbitRadius * activeZoom;
          const z0 = Math.sin(theta) * orbitRadius * activeZoom;

          // Rotate Y (spin)
          const x1 = x0 * cosY - z0 * sinY;
          const z1 = x0 * sinY + z0 * cosY;

          // Rotate X (tilt)
          const y2 = -z1 * sinX;

          const px = cx + x1;
          const py = cy + y2;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Calculate planet position
        const pX3d = Math.cos(planetAngle) * orbitRadius * activeZoom;
        const pZ3d = Math.sin(planetAngle) * orbitRadius * activeZoom;

        // Apply matrix rotation
        const pXRot = pX3d * cosY - pZ3d * sinY;
        const pZRot = pX3d * sinY + pZ3d * cosY;
        const pYRot = -pZRot * sinX;

        const screenX = cx + pXRot;
        const screenY = cy + pYRot;

        // Draw planet sphere dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const pRadius = Math.max(3, Math.min(10, p.id === 'jupiter' || p.id === 'saturn' ? 8 : 4.5));
        ctx.arc(screenX, screenY, pRadius * activeZoom, 0, Math.PI * 2);
        ctx.fill();

        // Highlight ring if hovered
        const distToMouse = Math.hypot(screenX - mouseCoords.current.x, screenY - mouseCoords.current.y);
        if (distToMouse < 12) {
          currentHover = p;

          // Draw targeting HUD crosshairs
          ctx.strokeStyle = 'var(--primary-container)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(screenX, screenY, (pRadius + 6) * activeZoom, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(screenX - pRadius - 8, screenY); ctx.lineTo(screenX - pRadius - 2, screenY);
          ctx.moveTo(screenX + pRadius + 2, screenY); ctx.lineTo(screenX + pRadius + 8, screenY);
          ctx.moveTo(screenX, screenY - pRadius - 8); ctx.lineTo(screenX, screenY - pRadius - 2);
          ctx.moveTo(screenX, screenY + pRadius + 2); ctx.lineTo(screenX, screenY + pRadius + 8);
          ctx.stroke();
        }

        // Draw label text
        ctx.fillStyle = (hoveredPlanet && hoveredPlanet.id === p.id) ? '#fff' : 'var(--on-surface-variant)';
        ctx.font = '10px var(--font-data)';
        ctx.textAlign = 'left';
        ctx.fillText(p.name, screenX + 10, screenY - 4);
      });

      // Update hover state and trigger sound sweep once
      if (currentHover !== hoveredPlanet) {
        if (currentHover) spaceSounds.playHover();
        setHoveredPlanet(currentHover);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [rotX, rotY, zoom, hoveredPlanet]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      
      {/* 3D Canvas element */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', cursor: hoveredPlanet ? 'pointer' : 'grab' }} />

      {/* Floating HUD Telemetry overlay for hovered planet */}
      {hoveredPlanet && (
        <div 
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            padding: '16px',
            width: '240px',
            pointerEvents: 'none',
            fontSize: '11px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
            ORBITAL LOCK DETECTED
          </div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{hoveredPlanet.name}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--on-surface-variant)' }}>
            <div>CLASS: {hoveredPlanet.classification}</div>
            <div>CO-ORBIT: {hoveredPlanet.distanceFromSun}</div>
            <div>PERIOD: {hoveredPlanet.orbitPeriod}</div>
            <div>SPEED: {hoveredPlanet.orbitalSpeed}</div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '9px', color: 'var(--primary-container)', fontFamily: 'var(--font-data)', letterSpacing: '0.05em' }}>
            CLICK PLANET TO ZOOM IN
          </div>
        </div>
      )}

      {/* Right controls guide */}
      <div 
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          fontFamily: 'var(--font-data)',
          fontSize: '9px',
          color: 'var(--on-surface-variant)',
          pointerEvents: 'none',
          textAlign: 'right'
        }}
      >
        DRAG CANVAS FROM ANYWHERE TO TILT & ROTATE<br/>
        SCROLL TO ZOOM SYSTEM MAP • CLICK NODES
      </div>

    </div>
  );
};

export default SolarSystem3D;
