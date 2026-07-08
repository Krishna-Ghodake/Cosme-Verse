// PlanetCore3D.jsx - 3D Stratigraphic Core Wedge Slice Renderer
import React, { useRef, useEffect, useState } from 'react';
import spaceSounds from './SoundManager';

const PlanetCore3D = ({ planet }) => {
  const canvasRef = useRef(null);
  const [selectedLayerIdx, setSelectedLayerIdx] = useState(0);
  const [rotX, setRotX] = useState(0.8);
  const [rotY, setRotY] = useState(0.5);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const mouseCoords = useRef({ x: 0, y: 0 });

  // Reset controls
  const handleReset = () => {
    spaceSounds.playClick();
    setRotX(0.8);
    setRotY(0.5);
  };

  // Drag anywhere to tilt core slice in 3D
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

      setRotY((prev) => prev + dx * 0.007);
      setRotX((prev) => Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev + dy * 0.007)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  // 60FPS Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 400;
      canvas.height = parent.clientHeight || 400;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.min(canvas.width, canvas.height) * 0.38;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // We render a 3D projected wedge slice of the planet
      // Let's divide the wedge into the layers configured
      const layersCount = planet.interior.length;
      
      let clickDetected = false;

      // Draw from core (index layersCount - 1) outwards to crust (index 0)
      for (let i = layersCount - 1; i >= 0; i--) {
        const layer = planet.interior[i];
        
        // Calculate inner and outer radius boundaries
        // E.g. core is inside 0 to 45% radius, mantle is 45% to 85%, crust is 85% to 100%
        const outRatio = 1 - (i / layersCount);
        const inRatio = 1 - ((i + 1) / layersCount);

        const rOut = r * outRatio;
        const rIn = r * inRatio;

        // Draw 3D Wedge polygons:
        // A wedge spans angle 0 to 1.57 (90 degrees / quarter slice)
        const angleStart = 0;
        const angleEnd = Math.PI / 2;

        ctx.save();
        
        // Setup layer colors
        const isActive = selectedLayerIdx === i;
        ctx.fillStyle = isActive 
          ? planet.glowColor.replace('0.4', '0.22') 
          : 'rgba(255, 255, 255, 0.02)';
        ctx.strokeStyle = isActive 
          ? 'var(--primary-container)' 
          : 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = isActive ? 2.5 : 1.2;

        // Plot 3D projected points of the wedge surface:
        // Points: A(rIn, angleStart), B(rOut, angleStart), C(rOut, angleEnd), D(rIn, angleEnd)
        // Extrude along depth Z for 3D realism
        
        // Plot points along the curved outer boundary arc
        const points = [];
        const segments = 16;
        for (let s = 0; s <= segments; s++) {
          const theta = angleStart + (s * (angleEnd - angleStart)) / segments;
          points.push(project3D(rOut * Math.cos(theta), rOut * Math.sin(theta), 0, cosX, sinX, cosY, sinY, cx, cy));
        }
        // Points along inner boundary arc (going backwards)
        for (let s = segments; s >= 0; s--) {
          const theta = angleStart + (s * (angleEnd - angleStart)) / segments;
          points.push(project3D(rIn * Math.cos(theta), rIn * Math.sin(theta), 0, cosX, sinX, cosY, sinY, cx, cy));
        }

        // Draw polygon face
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let pIdx = 1; pIdx < points.length; pIdx++) {
          ctx.lineTo(points[pIdx].x, points[pIdx].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hover hit detection using isPointInPath
        if (ctx.isPointInPath(mouseCoords.current.x, mouseCoords.current.y) && isDragging.current === false) {
          // If mouse is clicked, we select this layer
          // We check if click occurred by attaching canvas click, but here we can check mouseCoords click flag or do it inside canvas click event!
          // Better: just trigger hover selection or let canvas click handler handle it!
        }

        ctx.restore();
      }

      // Draw overall outline wireframe grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    // 3D coordinate rotation projection math helper
    const project3D = (x, y, z, cosX, sinX, cosY, sinY, cx, cy) => {
      // Rotate Y (spin)
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate X (tilt)
      const y2 = y * cosX - z1 * sinX;
      
      return { x: cx + x1, y: cy + y2 };
    };

    draw();

    // Canvas click handler for layer selection
    const handleCanvasClick = (e) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.min(canvas.width, canvas.height) * 0.38;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const layersCount = planet.interior.length;

      // Loop through layers and check hit detection using drawing path
      for (let i = 0; i < layersCount; i++) {
        const outRatio = 1 - (i / layersCount);
        const inRatio = 1 - ((i + 1) / layersCount);

        const rOut = r * outRatio;
        const rIn = r * inRatio;

        const angleStart = 0;
        const angleEnd = Math.PI / 2;

        ctx.beginPath();
        const points = [];
        const segments = 12;
        for (let s = 0; s <= segments; s++) {
          const theta = angleStart + (s * (angleEnd - angleStart)) / segments;
          // Rotate Y/X
          const px = rOut * Math.cos(theta);
          const py = rOut * Math.sin(theta);
          const x1 = px * cosY;
          const z1 = px * sinY;
          const y2 = py * cosX - z1 * sinX;
          points.push({ x: cx + x1, y: cy + y2 });
        }
        for (let s = segments; s >= 0; s--) {
          const theta = angleStart + (s * (angleEnd - angleStart)) / segments;
          const px = rIn * Math.cos(theta);
          const py = rIn * Math.sin(theta);
          const x1 = px * cosY;
          const z1 = px * sinY;
          const y2 = py * cosX - z1 * sinX;
          points.push({ x: cx + x1, y: cy + y2 });
        }

        ctx.moveTo(points[0].x, points[0].y);
        for (let pIdx = 1; pIdx < points.length; pIdx++) {
          ctx.lineTo(points[pIdx].x, points[pIdx].y);
        }
        ctx.closePath();

        if (ctx.isPointInPath(clickX, clickY)) {
          spaceSounds.playClick();
          setSelectedLayerIdx(i);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (canvas) canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [planet, rotX, rotY, selectedLayerIdx]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '340px' }}>
      
      {/* 3D Core Canvas */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Floating HUD Layer details cards */}
      <div 
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '16px',
          width: '260px',
          fontSize: '12px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--primary-container)', fontWeight: 'bold', marginBottom: '6px' }}>
          STRATIGRAPHIC DISSOLVE ACTIVE
        </div>
        <h4 style={{ fontSize: '15px', color: '#fff', margin: '0 0 8px 0' }}>
          {planet.interior[selectedLayerIdx].name}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--on-surface-variant)' }}>
          <div>THICKNESS: {planet.interior[selectedLayerIdx].thickness}</div>
          <div>COMPOSITION: {planet.interior[selectedLayerIdx].composition}</div>
        </div>
      </div>

      {/* Bottom controls HUD */}
      <div 
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        <button
          onClick={handleReset}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '9px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', pointerEvents: 'auto' }}
        >
          RESET
        </button>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', textAlign: 'right' }}>
          DRAG CORE TO SPIN & INSPECT CORE LAYERS<br/>
          CLICK HOVER LAYER WEDGE SEGMENTS TO QUERY
        </div>
      </div>

    </div>
  );
};

export default PlanetCore3D;
