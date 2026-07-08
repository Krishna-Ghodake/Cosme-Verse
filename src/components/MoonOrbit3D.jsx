// MoonOrbit3D.jsx - Interactive 3D Planet Moon System Simulator
import React, { useRef, useEffect, useState } from 'react';
import spaceSounds from './SoundManager';

const MoonOrbit3D = ({ planet }) => {
  const canvasRef = useRef(null);
  const [rotX, setRotX] = useState(1.1); // tilted plane
  const [rotY, setRotY] = useState(0.2);
  const [zoom, setZoom] = useState(1.0);
  const [hoveredMoon, setHoveredMoon] = useState(null);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const mouseCoords = useRef({ x: 0, y: 0 });

  // Map of real primary moons for each planet
  const moonsData = {
    earth: [
      { name: 'Luna', radius: 70, speed: 0.015, color: '#e0e0e0', size: 3.2 }
    ],
    mars: [
      { name: 'Phobos', radius: 50, speed: 0.038, color: '#b0bec5', size: 2.2 },
      { name: 'Deimos', radius: 95, speed: 0.018, color: '#90a4ae', size: 1.8 }
    ],
    jupiter: [
      { name: 'Io', radius: 45, speed: 0.042, color: '#fff176', size: 2.5 },
      { name: 'Europa', radius: 70, speed: 0.028, color: '#b2dfdb', size: 2.3 },
      { name: 'Ganymede', radius: 100, speed: 0.016, color: '#cfd8dc', size: 3.5 },
      { name: 'Callisto', radius: 135, speed: 0.009, color: '#90a4ae', size: 3.0 }
    ],
    saturn: [
      { name: 'Mimas', radius: 40, speed: 0.035, color: '#b0bec5', size: 2.0 },
      { name: 'Enceladus', radius: 65, speed: 0.026, color: '#ffffff', size: 2.2 },
      { name: 'Tethys', radius: 90, speed: 0.018, color: '#e0e0e0', size: 2.4 },
      { name: 'Titan', radius: 125, speed: 0.008, color: '#ffcc80', size: 4.5 }
    ],
    uranus: [
      { name: 'Miranda', radius: 45, speed: 0.032, color: '#eceff1', size: 2.0 },
      { name: 'Ariel', radius: 75, speed: 0.02, color: '#cfd8dc', size: 2.5 },
      { name: 'Titania', radius: 110, speed: 0.01, color: '#b0bec5', size: 3.2 }
    ],
    neptune: [
      { name: 'Triton', radius: 85, speed: -0.016, color: '#b2dfdb', size: 3.8 } // Retrograde orbit!
    ]
  };

  // Drag listeners
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

      setRotY((prev) => prev + dx * 0.006);
      setRotX((prev) => Math.max(0.2, Math.min(Math.PI / 2, prev + dy * 0.006)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      setZoom((prev) => Math.max(0.5, Math.min(1.8, prev - e.deltaY * 0.001)));
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

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 300;
      canvas.height = parent.clientHeight || 250;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const activeZoom = zoom * (Math.min(canvas.width, canvas.height) / 320);

      time += 0.5;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Draw central planet body
      const pGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18 * activeZoom);
      pGrad.addColorStop(0, '#ffffff');
      pGrad.addColorStop(0.4, planet.color);
      pGrad.addColorStop(1, 'rgba(5, 20, 36, 0.4)');
      
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 18 * activeZoom, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric scatter halo
      ctx.strokeStyle = planet.glowColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 22 * activeZoom, 0, Math.PI * 2);
      ctx.stroke();

      const planetMoons = moonsData[planet.id];

      if (!planetMoons || planetMoons.length === 0) {
        // No moons (Mercury/Venus): render scanning radar lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const radarR = 80 * activeZoom;
        ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
        ctx.stroke();

        // Sweeping radar arm
        const sweepAngle = (time * 0.02) % (Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * radarR, cy + Math.sin(sweepAngle) * radarR);
        ctx.stroke();

        ctx.fillStyle = 'var(--on-surface-variant)';
        ctx.font = '8px var(--font-data)';
        ctx.textAlign = 'center';
        ctx.fillText('NO NATURAL SATELLITES DETECTED', cx, cy + radarR + 15);
      } else {
        let currentHover = null;

        planetMoons.forEach((m) => {
          const orbitR = m.radius * activeZoom;
          const moonAngle = time * m.speed;

          // Draw 3D orbit line
          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          
          const segments = 64;
          for (let i = 0; i <= segments; i++) {
            const theta = (i * 2 * Math.PI) / segments;
            const x0 = Math.cos(theta) * orbitR;
            const z0 = Math.sin(theta) * orbitR;
            const x1 = x0 * cosY - z0 * sinY;
            const z1 = x0 * sinY + z0 * cosY;
            const y2 = -z1 * sinX;
            if (i === 0) ctx.moveTo(cx + x1, cy + y2);
            else ctx.lineTo(cx + x1, cy + y2);
          }
          ctx.stroke();
          ctx.setLineDash([]); // reset

          // Project Moon coordinates
          const mX3d = Math.cos(moonAngle) * orbitR;
          const mZ3d = Math.sin(moonAngle) * orbitR;
          const mXRot = mX3d * cosY - mZ3d * sinY;
          const mZRot = mX3d * sinY + mZ3d * cosY;
          const mYRot = -mZRot * sinX;

          const screenX = cx + mXRot;
          const screenY = cy + mYRot;

          // Draw moon dot
          ctx.fillStyle = m.color;
          ctx.beginPath();
          ctx.arc(screenX, screenY, m.size * activeZoom, 0, Math.PI * 2);
          ctx.fill();

          // Check hover
          const distToMouse = Math.hypot(screenX - mouseCoords.current.x, screenY - mouseCoords.current.y);
          if (distToMouse < 8) {
            currentHover = m;
            
            ctx.strokeStyle = 'var(--primary-container)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(screenX, screenY, (m.size + 4) * activeZoom, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Draw moon label
          ctx.fillStyle = 'var(--on-surface-variant)';
          ctx.font = '8px var(--font-data)';
          ctx.textAlign = 'left';
          ctx.fillText(m.name, screenX + 6, screenY - 2);
        });

        if (currentHover !== hoveredMoon) {
          if (currentHover) spaceSounds.playHover();
          setHoveredMoon(currentHover);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [planet, rotX, rotY, zoom, hoveredMoon]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '180px' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', cursor: 'grab' }} />
      
      {hoveredMoon && (
        <div 
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'rgba(5,20,36,0.9)',
            border: '1px solid var(--primary-container)',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '8px',
            fontFamily: 'var(--font-data)',
            color: '#fff',
            pointerEvents: 'none'
          }}
        >
          NAME: {hoveredMoon.name} | SPEED: {Math.abs(hoveredMoon.speed)} RAD/S
        </div>
      )}
    </div>
  );
};

export default MoonOrbit3D;
