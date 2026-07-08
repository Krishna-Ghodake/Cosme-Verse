// Star3D.jsx - Interactive 3D Star & Fusion Simulator
import React, { useRef, useEffect, useState } from 'react';
import spaceSounds from './SoundManager';

const Star3D = ({ star, viewMode = 'surface' }) => {
  const canvasRef = useRef(null);
  const [rotX, setRotX] = useState(0.8);
  const [rotY, setRotY] = useState(0.5);
  const [zoom, setZoom] = useState(1.0);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // Drag anywhere to rotate star
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouseX.current;
      const dy = e.clientY - lastMouseY.current;

      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;

      setRotY((prev) => prev + dx * 0.007);
      setRotX((prev) => Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev + dy * 0.007)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      setZoom((prev) => Math.max(0.4, Math.min(2.0, prev - e.deltaY * 0.001)));
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
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 320;
      canvas.height = parent.clientHeight || 320;
    };
    resize();
    window.addEventListener('resize', resize);

    // Setup convective flares & spots once
    const surfaceSpots = [];
    for (let i = 0; i < 12; i++) {
      surfaceSpots.push({
        lat: -Math.PI / 2 + Math.random() * Math.PI,
        lon: Math.random() * Math.PI * 2,
        size: Math.random() * 8 + 3,
        pulseOffset: Math.random() * Math.PI
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      // Star radius scaling: White dwarf is tiny, hypergiant is massive!
      let baseR = 75;
      if (star.id === 'white-dwarf') baseR = 30;
      if (star.id === 'neutron-star' || star.id === 'pulsar' || star.id === 'magnetar') baseR = 15;
      if (star.id === 'red-giant') baseR = 95;
      if (star.id === 'hypergiant') baseR = 120;

      const r = baseR * zoom * (Math.min(canvas.width, canvas.height) / 300);

      time += 0.05;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      if (viewMode === 'core') {
        // DRAW THERMONUCLEAR FUSION SHELLS (Core cutaway)
        drawFusionCore(ctx, cx, cy, r, star.fusionShells);
      } else {
        // DRAW ENERGETIC SURFACE & DYNAMIC PHENOMENA
        
        // 1. Draw glowing corona halo
        const coronaGrad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.6);
        coronaGrad.addColorStop(0, star.color);
        coronaGrad.addColorStop(0.3, star.glowColor);
        coronaGrad.addColorStop(1, 'rgba(5, 20, 36, 0)');
        
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // 2. Pulsar Polar Jets (rapidly spinning cones of light)
        if (star.id === 'pulsar') {
          drawPulsarJets(ctx, cx, cy, r, time, cosX, sinX, cosY, sinY);
        }

        // 3. Magnetar magnetic field loops
        if (star.id === 'magnetar') {
          drawMagnetarFields(ctx, cx, cy, r, time, cosX, sinX, cosY, sinY);
        }

        // 4. Draw convective star sphere body
        const sphereGrad = ctx.createRadialGradient(cx - r*0.25, cy - r*0.25, r*0.05, cx, cy, r);
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.2, star.color);
        sphereGrad.addColorStop(0.8, star.glowColor.replace('0.4', '0.8'));
        sphereGrad.addColorStop(1, '#020b14');

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // 5. Draw active convective flares / loops on surface
        surfaceSpots.forEach(s => {
          // Calculate 3D position
          const latCos = Math.cos(s.lat);
          const x3d = r * latCos * Math.cos(s.lon + time * 0.1);
          const z3d = r * latCos * Math.sin(s.lon + time * 0.1);
          const y3d = r * Math.sin(s.lat);

          // Apply rotation matrix
          const xRot = x3d * cosY - z3d * sinY;
          const zRot = x3d * sinY + z3d * cosY;
          const yRot = y3d * cosX - zRot * sinX;

          // Project
          const screenX = cx + xRot;
          const screenY = cy + yRot;

          // If spot is in front (zRot > 0)
          if (zRot > 0) {
            const spotSize = s.size * (1 + Math.sin(time + s.pulseOffset) * 0.2);
            const spotGrad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, spotSize);
            spotGrad.addColorStop(0, '#ffffff');
            spotGrad.addColorStop(0.5, star.color);
            spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = spotGrad;
            ctx.beginPath();
            ctx.arc(screenX, screenY, spotSize, 0, Math.PI * 2);
            ctx.fill();

            // Draw micro solar prominence loop (bezier curve)
            if (s.pulseOffset > Math.PI / 2) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.bezierCurveTo(
                screenX - 10, screenY - 15,
                screenX + 10, screenY - 15,
                screenX + 15, screenY
              );
              ctx.stroke();
            }
          }
        });
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [star, viewMode, rotX, rotY, zoom]);

  // Helper: Draw fusion shell cutaway core concentric rings
  const drawFusionCore = (ctx, cx, cy, r, shells) => {
    if (!shells || shells.length === 0) return;
    const shellsCount = shells.length;
    
    // Draw outer boundary
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    shells.forEach((shell, idx) => {
      const radiusRatio = (shellsCount - idx) / shellsCount;
      const shellR = r * radiusRatio;

      // Color scheme based on element: Core is white/hot yellow, outer elements are darker
      let shellColor = 'rgba(255, 235, 59, 0.08)';
      let borderColor = 'rgba(255, 235, 59, 0.4)';
      if (idx === 0) {
        shellColor = 'rgba(255, 255, 255, 0.2)';
        borderColor = '#ffffff';
      } else if (idx === 1) {
        shellColor = 'rgba(0, 240, 255, 0.08)';
        borderColor = 'rgba(0, 240, 255, 0.4)';
      }

      ctx.fillStyle = shellColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.arc(cx, cy, shellR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw text label in concentric circles
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px var(--font-data)';
      ctx.textAlign = 'center';
      ctx.fillText(shell.element, cx, cy - shellR + 10);
    });
  };

  // Helper: Draw fast rotating polar cones (Pulsar)
  const drawPulsarJets = (ctx, cx, cy, r, time, cosX, sinX, cosY, sinY) => {
    ctx.save();
    
    // Pulsar jets spin at extremely high speed
    const jetSpin = time * 8;
    const jetLength = r * 8;
    const jetWidth = r * 1.5;

    // Vector direction of magnetic axis (tilted slightly relative to rotation axis)
    const axisAngle = Math.PI / 10;
    
    const drawJetCone = (dir) => {
      // dir = 1 (North), -1 (South)
      const baseAngle = dir * (Math.PI / 2) + Math.sin(jetSpin) * 0.08;
      
      const xTip = cx;
      const yTip = cy;
      
      const xCenter = cx + Math.cos(baseAngle) * jetLength * cosY;
      const yCenter = cy + Math.sin(baseAngle) * jetLength * cosX;

      const grad = ctx.createLinearGradient(xTip, yTip, xCenter, yCenter);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.6)');
      grad.addColorStop(0.6, 'rgba(0, 240, 255, 0.15)');
      grad.addColorStop(1, 'rgba(5, 20, 36, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(xTip, yTip);
      // Draw cone base
      ctx.lineTo(xCenter - Math.sin(baseAngle) * jetWidth, yCenter + Math.cos(baseAngle) * jetWidth);
      ctx.lineTo(xCenter + Math.sin(baseAngle) * jetWidth, yCenter - Math.cos(baseAngle) * jetWidth);
      ctx.closePath();
      ctx.fill();
    };

    drawJetCone(1);
    drawJetCone(-1);

    ctx.restore();
  };

  // Helper: Draw magnetic force loops (Magnetar)
  const drawMagnetarFields = (ctx, cx, cy, r, time, cosX, sinX, cosY, sinY) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.lineWidth = 1;

    const pulse = Math.sin(time * 3) * 12;

    // Draw 3 nested magnetic field shells
    for (let ring = 1; ring <= 3; ring++) {
      const scale = r * (1.2 + ring * 0.6) + pulse;

      ctx.beginPath();
      // Draw vertical polar magnetic loops
      for (let i = 0; i <= 32; i++) {
        const theta = (i * Math.PI) / 32;
        
        // Loop coordinates
        const x0 = scale * Math.sin(theta) * Math.cos(rotY + ring);
        const z0 = scale * Math.sin(theta) * Math.sin(rotY + ring);
        const y0 = scale * Math.cos(theta) * 0.55; // squeezed ellipse

        const xRot = x0 * cosY - z0 * sinY;
        const zRot = x0 * sinY + z0 * cosY;
        const yRot = y0 * cosX - zRot * sinX;

        if (i === 0) ctx.moveTo(cx + xRot, cy + yRot);
        else ctx.lineTo(cx + xRot, cy + yRot);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', pointerEvents: 'none' }}>
        DRAG MOUSE TO ROTATE STAR AXIS • SCROLL TO ZOOM
      </div>
    </div>
  );
};

export default Star3D;
