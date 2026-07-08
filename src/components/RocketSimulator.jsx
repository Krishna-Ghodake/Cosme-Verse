// RocketSimulator.jsx - Interactive Rocket Launch Simulator
import React, { useEffect, useRef, useState } from 'react';
import spaceSounds from './SoundManager';

const RocketSimulator = () => {
  const canvasRef = useRef(null);
  const [launching, setLaunching] = useState(false);
  const [stage, setStage] = useState('READY'); // READY, COUNTDOWN, IGNITION, ASCENT, ORBIT
  const [telemetry, setTelemetry] = useState({ speed: 0, alt: 0 });
  const [countdown, setCountdown] = useState(5);

  const particles = useRef([]);
  const rocketY = useRef(0); // offset from base
  const shakeOffset = useRef({ x: 0, y: 0 });
  const launchTimer = useRef(null);

  const initiateLaunch = () => {
    if (stage !== 'READY') return;
    spaceSounds.playClick();
    setStage('COUNTDOWN');
    setCountdown(5);
    
    // Begin countdown interval
    let cnt = 5;
    launchTimer.current = setInterval(() => {
      cnt -= 1;
      if (cnt > 0) {
        setCountdown(cnt);
        spaceSounds.playClick();
      } else {
        clearInterval(launchTimer.current);
        triggerIgnition();
      }
    }, 1000);
  };

  const triggerIgnition = () => {
    setStage('IGNITION');
    setLaunching(true);
    spaceSounds.playLaunch();

    // After 1s ignition, begin ascent
    setTimeout(() => {
      setStage('ASCENT');
    }, 1000);
  };

  const resetSimulator = () => {
    clearInterval(launchTimer.current);
    spaceSounds.playClick();
    setLaunching(false);
    setStage('READY');
    setTelemetry({ speed: 0, alt: 0 });
    rocketY.current = 0;
    particles.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 300;
      canvas.height = parent.clientHeight || 300;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Main animation draw loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const baseLine = canvas.height - 40;

      // Handle camera shake during ignition and early ascent
      if (stage === 'IGNITION') {
        shakeOffset.current = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        };
      } else if (stage === 'ASCENT' && rocketY.current < 200) {
        // Less shake as rocket moves higher
        const scale = Math.max(0, 1 - rocketY.current / 200);
        shakeOffset.current = {
          x: (Math.random() - 0.5) * 5 * scale,
          y: (Math.random() - 0.5) * 5 * scale
        };
      } else {
        shakeOffset.current = { x: 0, y: 0 };
      }

      ctx.save();
      ctx.translate(shakeOffset.current.x, shakeOffset.current.y);

      // 1. Draw Launch Pad Structure
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, baseLine);
      ctx.lineTo(canvas.width, baseLine);
      ctx.stroke();

      // Launch Tower (standing left of center)
      if (rocketY.current < canvas.height) {
        ctx.fillStyle = '#1c2b3c';
        ctx.strokeStyle = '#3b494b';
        ctx.lineWidth = 1.5;
        ctx.fillRect(cx - 50, baseLine - 120, 20, 120);
        ctx.strokeRect(cx - 50, baseLine - 120, 20, 120);
        
        // Tower trusses crosslines
        ctx.beginPath();
        for (let y = baseLine - 120; y < baseLine; y += 20) {
          ctx.moveTo(cx - 50, y);
          ctx.lineTo(cx - 30, y + 20);
          ctx.moveTo(cx - 30, y);
          ctx.lineTo(cx - 50, y + 20);
        }
        ctx.stroke();
      }

      // 2. Physics & Particle updates (Exhaust smoke and flame)
      if (stage === 'IGNITION' || stage === 'ASCENT') {
        const fireOriginY = baseLine - 30 - rocketY.current;
        
        // Spawn exhaust particles
        const count = stage === 'IGNITION' ? 6 : 4;
        for (let i = 0; i < count; i++) {
          particles.current.push({
            x: cx + (Math.random() - 0.5) * 12,
            y: fireOriginY,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            size: Math.random() * 8 + 4,
            color: Math.random() > 0.4 
              ? (Math.random() > 0.5 ? '#ff9800' : '#ff5722') // Orange / red flames
              : 'rgba(185, 202, 203, 0.5)', // grey smoke
            life: 1.0,
            decay: 0.02 + Math.random() * 0.02
          });
        }
      }

      // Update and draw particles
      const pArr = particles.current;
      for (let i = pArr.length - 1; i >= 0; i--) {
        const p = pArr[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          pArr.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + (1 - p.life)), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 3. Update Rocket Position & Telemetry
      if (stage === 'ASCENT') {
        // Accelerating upward movement
        rocketY.current += 1.8;
        
        setTelemetry(prev => {
          const nextSpeed = prev.speed + 0.08;
          const nextAlt = prev.alt + (nextSpeed * 0.05);
          return {
            speed: parseFloat(nextSpeed.toFixed(2)),
            alt: parseFloat(nextAlt.toFixed(1))
          };
        });

        // Orbit reach transition
        if (rocketY.current > canvas.height + 40) {
          setStage('ORBIT');
          setTelemetry({ speed: 7.66, alt: 408 }); // Typical LEO orbital numbers
        }
      }

      // 4. Draw Rocket Vector Graphic
      if (stage !== 'ORBIT') {
        const ry = baseLine - 30 - rocketY.current;

        ctx.save();
        ctx.translate(cx, ry);

        // Flame glow under rocket body
        if (stage === 'IGNITION' || stage === 'ASCENT') {
          const flameGrad = ctx.createLinearGradient(0, 0, 0, 30);
          flameGrad.addColorStop(0, '#ffffff');
          flameGrad.addColorStop(0.3, '#ffeb3b');
          flameGrad.addColorStop(1, 'rgba(244, 67, 54, 0)');
          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(6, 0);
          ctx.lineTo(0, 30);
          ctx.closePath();
          ctx.fill();
        }

        // Rocket Body
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3b494b';
        ctx.lineWidth = 1.5;
        
        // Cylinder main tank
        ctx.fillRect(-8, -60, 16, 60);
        ctx.strokeRect(-8, -60, 16, 60);

        // Nose cone
        ctx.fillStyle = 'var(--primary-fixed-dim)';
        ctx.beginPath();
        ctx.moveTo(-8, -60);
        ctx.quadraticCurveTo(0, -85, 0, -85);
        ctx.quadraticCurveTo(8, -60, 8, -60);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Left Fin
        ctx.fillStyle = 'var(--outline-color)';
        ctx.beginPath();
        ctx.moveTo(-8, -15);
        ctx.lineTo(-18, 0);
        ctx.lineTo(-8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Fin
        ctx.beginPath();
        ctx.moveTo(8, -15);
        ctx.lineTo(18, 0);
        ctx.lineTo(8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Window circular decal
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(0, -40, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Draw Satellites orbiting in space (Orbit stage)
        ctx.fillStyle = 'var(--primary-container)';
        ctx.shadowColor = 'var(--primary-container)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, canvas.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Satellite antennas
        ctx.strokeStyle = 'var(--primary-fixed)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 20, canvas.height / 2);
        ctx.lineTo(cx + 20, canvas.height / 2);
        ctx.stroke();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [stage]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Simulation Screen Header */}
      <div 
        style={{ 
          padding: '12px 16px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--primary-fixed)' }}>
          LAUNCH SIMULATOR: <span style={{ color: '#fff' }}>{stage}</span>
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {stage === 'READY' ? (
            <button 
              onClick={initiateLaunch}
              style={{
                background: 'var(--accent-gradient)',
                border: 'none',
                color: '#fff',
                padding: '4px 12px',
                fontFamily: 'var(--font-data)',
                fontSize: '9px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              LAUNCH
            </button>
          ) : (
            <button 
              onClick={resetSimulator}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '4px 12px',
                fontFamily: 'var(--font-data)',
                fontSize: '9px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              RESET
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* Countdown overlay banner */}
        {stage === 'COUNTDOWN' && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(5, 20, 36, 0.45)',
              backdropFilter: 'blur(2px)',
              pointerEvents: 'none'
            }}
          >
            <div style={{ fontFamily: 'var(--font-data)', fontSize: '12px', color: 'var(--primary-fixed-dim)', letterSpacing: '0.2em' }}>LAUNCH SEQUENCING</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 800, color: '#fff', textShadow: '0 0 20px var(--accent-glow-primary)' }}>{countdown}</div>
          </div>
        )}

        {/* Orbit State banner */}
        {stage === 'ORBIT' && (
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              animation: 'pulse-glow 2s infinite ease-in-out'
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-container)' }}>ORBIT ESTABLISHED</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>VEHICLE COMM CHANNELS LOCK</div>
          </div>
        )}

        {/* Live Telemetry readout */}
        {(stage === 'ASCENT' || stage === 'ORBIT') && (
          <div 
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: 'rgba(5, 20, 36, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-data)',
              fontSize: '10px',
              color: '#fff',
              pointerEvents: 'none'
            }}
          >
            <div>VELOCITY: {telemetry.speed} KM/S</div>
            <div>ALTITUDE: {telemetry.alt} KM</div>
            <div>STATUS: {stage === 'ORBIT' ? 'STABLE ORBIT' : 'ASCENT PHASING'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RocketSimulator;
