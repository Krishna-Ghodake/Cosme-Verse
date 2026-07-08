// RadarNEO.jsx - Near-Earth Object Radar Canvas Component
import React, { useEffect, useRef, useState } from 'react';
import spaceSounds from './SoundManager';

const RadarNEO = () => {
  const canvasRef = useRef(null);
  const [selectedNEO, setSelectedNEO] = useState(null);
  
  // Static NEO details
  const neoList = useRef([
    { id: '2024-XA', name: 'Asteroid 2024-XA', angle: 0.8, distRatio: 0.45, dist: '0.05 AU', vel: '14.2 KM/S', hazard: 'NONE', size: '45m' },
    { id: 'APOPHIS', name: '99942 Apophis', angle: 2.1, distRatio: 0.65, dist: '0.21 AU', vel: '30.7 KM/S', hazard: 'HIGH', size: '370m' },
    { id: '2026-CV', name: 'Asteroid 2026-CV', angle: 4.3, distRatio: 0.25, dist: '0.08 AU', vel: '18.5 KM/S', hazard: 'LOW', size: '12m' },
    { id: 'Bennu', name: '101955 Bennu', angle: 5.2, distRatio: 0.8, dist: '0.12 AU', vel: '22.8 KM/S', hazard: 'LOW', size: '490m' }
  ]);

  const [hoveredNEO, setHoveredNEO] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let sweepAngle = 0;
    
    // Resize
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 300;
      canvas.height = parent.clientHeight || 250;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse coordinates check
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) * 0.85;

      let found = null;
      neoList.current.forEach(neo => {
        const x = cx + Math.cos(neo.angle) * (neo.distRatio * radius);
        const y = cy + Math.sin(neo.angle) * (neo.distRatio * radius);
        const dist = Math.hypot(mx - x, my - y);
        if (dist < 10) {
          found = neo;
        }
      });
      setHoveredNEO(found);
    };

    const handleMouseClick = () => {
      if (hoveredNEO) {
        spaceSounds.playClick();
        setSelectedNEO(hoveredNEO);
      } else {
        setSelectedNEO(null);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    // Draw Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) * 0.85;

      // Draw Grid Rings
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 0.25; r <= 1.0; r += 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Draw Rotating Sweep Arm
      sweepAngle = (sweepAngle + 0.015) % (Math.PI * 2);
      const sweepX = cx + Math.cos(sweepAngle) * radius;
      const sweepY = cy + Math.sin(sweepAngle) * radius;

      // Draw sweep gradient
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sweepAngle - 0.25, sweepAngle);
      ctx.lineTo(cx, cy);
      
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0.15)');
      sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0.001)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Draw Sweep Line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Draw NEO Blips
      neoList.current.forEach(neo => {
        const x = cx + Math.cos(neo.angle) * (neo.distRatio * radius);
        const y = cy + Math.sin(neo.angle) * (neo.distRatio * radius);

        // Check if radar sweep is crossing the blip
        const angleDiff = Math.abs(sweepAngle - neo.angle) % (Math.PI * 2);
        const isSwept = angleDiff < 0.2 || (Math.PI * 2 - angleDiff) < 0.2;

        // Fade glow effect
        ctx.beginPath();
        ctx.arc(x, y, isSwept ? 8 : 4, 0, Math.PI * 2);
        
        const isSelected = selectedNEO?.id === neo.id;
        const isHovered = hoveredNEO?.id === neo.id;

        if (isSelected) {
          ctx.fillStyle = 'rgba(255, 112, 67, 1.0)'; // Orange/Red selection
          ctx.shadowColor = '#ff7043';
          ctx.shadowBlur = 15;
        } else if (neo.hazard === 'HIGH') {
          ctx.fillStyle = isSwept ? '#ff5252' : 'rgba(255, 82, 82, 0.4)';
          ctx.shadowColor = '#ff5252';
          ctx.shadowBlur = isSwept ? 10 : 0;
        } else {
          ctx.fillStyle = isSwept ? '#00f0ff' : 'rgba(0, 240, 255, 0.4)';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = isSwept ? 10 : 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw dotted selection circle if hovered/selected
        if (isHovered || isSelected) {
          ctx.strokeStyle = '#00f0ff';
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw Center Station Dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleMouseClick);
      }
    };
  }, [hoveredNEO, selectedNEO]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        
        {/* Radar Overlay Tooltip */}
        {hoveredNEO && (
          <div 
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: 'rgba(5, 20, 36, 0.85)',
              border: '1px solid var(--primary-fixed-dim)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-data)',
              fontSize: '10px',
              color: '#fff',
              pointerEvents: 'none'
            }}
          >
            <div>NAME: {hoveredNEO.name}</div>
            <div>DIST: {hoveredNEO.dist}</div>
            <div>HAZARD: <span style={{ color: hoveredNEO.hazard === 'HIGH' ? '#ff5252' : '#2ecc71' }}>{hoveredNEO.hazard}</span></div>
          </div>
        )}
      </div>

      {/* Selected Asteroid Deep Telemetry Block */}
      {selectedNEO && (
        <div 
          style={{ 
            padding: '12px 16px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div style={{ fontFamily: 'var(--font-data)', fontSize: '11px' }}>
            <span style={{ color: 'var(--primary-container)', fontWeight: 'bold' }}>{selectedNEO.name}</span>
            <span style={{ color: 'var(--on-surface-variant)', marginLeft: '12px' }}>V={selectedNEO.vel} • Size={selectedNEO.size}</span>
          </div>
          <button 
            onClick={() => setSelectedNEO(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--on-surface-variant)',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            CLOSE
          </button>
        </div>
      )}
    </div>
  );
};

export default RadarNEO;
