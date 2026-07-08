// HomeView.jsx - CosmosVerse Landing Page with interactive counters and 3D globe
import React, { useEffect, useState, useRef } from 'react';
import spaceSounds from '../components/SoundManager';

const HomeView = ({ setActiveTab }) => {
  const planetCanvasRef = useRef(null);
  const waveCanvasRef = useRef(null);
  const [activeMissions, setActiveMissions] = useState(0);
  const [exoplanetsScanned, setExoplanetsScanned] = useState(0);
  
  // Mouse hover coordination for canvas tilt
  const mouseOffset = useRef({ x: 0, y: 0 });

  // Stats counter animation
  useEffect(() => {
    let startMissions = 0;
    const endMissions = 1024;
    const speedM = Math.ceil(endMissions / 60);

    let startPlanets = 0;
    const endPlanets = 5492;
    const speedP = Math.ceil(endPlanets / 60);

    const interval = setInterval(() => {
      startMissions += speedM;
      startPlanets += speedP;

      if (startMissions >= endMissions) {
        setActiveMissions(endMissions);
      } else {
        setActiveMissions(startMissions);
      }

      if (startPlanets >= endPlanets) {
        setExoplanetsScanned(endPlanets);
        clearInterval(interval);
      } else {
        setExoplanetsScanned(startPlanets);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // 3D planet canvas with orbit rings & solar flares
  useEffect(() => {
    const canvas = planetCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let rotation = 0;
    
    // Flare particles
    const flares = [];
    for (let i = 0; i < 8; i++) {
      flares.push({
        angle: Math.random() * Math.PI * 2,
        r: 140 + Math.random() * 40,
        size: Math.random() * 3 + 1,
        speed: 0.005 + Math.random() * 0.01,
        opacity: Math.random()
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseOffset.current = {
        x: (e.clientX - cx) * 0.05,
        y: (e.clientY - cy) * 0.05
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 130;

      // Mouse interactive tilt offsets
      const tx = mouseOffset.current.x;
      const ty = mouseOffset.current.y;

      // 1. Draw glowing atmosphere halo
      const glowGrad = ctx.createRadialGradient(cx + tx, cy + ty, r - 10, cx + tx, cy + ty, r + 60);
      glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      glowGrad.addColorStop(0.5, 'rgba(0, 219, 233, 0.08)');
      glowGrad.addColorStop(1, 'rgba(5, 20, 36, 0)');
      
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx + tx, cy + ty, r + 60, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw solar flares escaping
      flares.forEach(f => {
        f.angle += f.speed;
        const fx = cx + tx + Math.cos(f.angle) * f.r;
        const fy = cy + ty + Math.sin(f.angle) * f.r * 0.8;
        
        ctx.fillStyle = `rgba(0, 240, 255, ${f.opacity})`;
        ctx.beginPath();
        ctx.arc(fx, fy, f.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulse opacity
        f.opacity -= 0.005;
        if (f.opacity <= 0) {
          f.opacity = 1;
          f.r = 130 + Math.random() * 30;
        }
      });

      // 3. Draw base sphere
      const sphereGrad = ctx.createRadialGradient(cx + tx - 25, cy + ty - 25, 10, cx + tx, cy + ty, r);
      sphereGrad.addColorStop(0, '#dbfcff');
      sphereGrad.addColorStop(0.2, '#00f0ff');
      sphereGrad.addColorStop(0.7, '#002f33');
      sphereGrad.addColorStop(1, '#020b14');
      
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx + tx, cy + ty, r, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw rotating continent vectors
      rotation = (rotation + 0.002) % (Math.PI * 2);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx + tx, cy + ty, r, 0, Math.PI * 2);
      ctx.clip(); // clip to planet

      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      for (let offset = -2; offset <= 2; offset++) {
        const xOffset = offset * r * 2.0 + (rotation * r);
        ctx.beginPath();
        ctx.arc(cx + tx + xOffset, cy + ty - 15, r * 0.35, 0, Math.PI * 2);
        ctx.arc(cx + tx + xOffset - 35, cy + ty + 25, r * 0.28, 0, Math.PI * 2);
        ctx.arc(cx + tx + xOffset + 45, cy + ty + 10, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. Draw 3D Orbit Dust Ring wrapping around center
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx + tx, cy + ty, r * 1.35, r * 0.35, -Math.PI / 10, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Draw spherical shadow overlay
      const shadowGrad = ctx.createRadialGradient(cx + tx - 45, cy + ty - 45, r * 0.5, cx + tx + 45, cy + ty + 45, r * 1.25);
      shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shadowGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(cx + tx, cy + ty, r, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Telemetry wave oscillator canvas loop
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let offset = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      offset += 0.05;
      const midY = canvas.height / 2;

      for (let x = 0; x < canvas.width; x++) {
        // Compose multiple sine harmonics for interesting sci-fi wave
        const y = midY + 
                  Math.sin(x * 0.03 + offset) * 15 + 
                  Math.cos(x * 0.015 - offset * 0.5) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleLaunchCTA = () => {
    spaceSounds.playClick();
    setActiveTab('dashboard');
  };

  return (
    <section style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Hero Header */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '48px',
          minHeight: '500px',
          marginBottom: '64px'
        }}
        className="hero-container"
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h1 
            style={{ color: 'var(--primary-container)', margin: 0, textShadow: '0 0 20px rgba(0, 240, 255, 0.25)' }}
            className="font-display-xl hero-title"
          >
            Explore the Infinite
          </h1>
          <p 
            style={{ 
              color: 'var(--on-surface-variant)', 
              fontSize: '17px', 
              lineHeight: '28px',
              maxWidth: '520px'
            }}
          >
            Embark on an immersive journey through the cosmos. Monitor real-time orbital paths, run gravitational black hole simulations, and communicate with the Cosmos AI Node.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button 
              onClick={handleLaunchCTA} 
              onMouseEnter={() => spaceSounds.playHover()}
              className="btn-primary"
              style={{ padding: '16px 32px', borderRadius: 'var(--radius-full)' }}
            >
              Initiate Launch
            </button>
            <button 
              onClick={() => { spaceSounds.playClick(); setActiveTab('explorer'); }}
              onMouseEnter={() => spaceSounds.playHover()}
              className="btn-ghost"
              style={{ padding: '16px 32px', borderRadius: 'var(--radius-full)' }}
            >
              View Telemetry
            </button>
          </div>
        </div>

        {/* Glowing Interactive Parallax Planet */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hero-planet-wrapper">
          <canvas 
            ref={planetCanvasRef} 
            width="400" 
            height="400" 
            style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }} 
            className="animate-float" 
          />
        </div>
      </div>

      {/* Bento Stats Deck */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 'var(--gutter)',
          marginBottom: '64px' 
        }}
        className="stats-grid"
      >
        <div 
          className="glass-panel" 
          style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '8px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--primary-fixed-dim)' }}>
            rocket_launch
          </span>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Missions
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, color: 'var(--primary-container)' }}>
            {activeMissions.toLocaleString()}
          </span>
        </div>

        <div 
          className="glass-panel" 
          style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '8px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--primary-fixed-dim)' }}>
            radar
          </span>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Exoplanets Scanned
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, color: 'var(--primary-container)' }}>
            {exoplanetsScanned.toLocaleString()}
          </span>
        </div>

        <div 
          className="glass-panel" 
          style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '8px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--primary-fixed-dim)' }}>
            speed
          </span>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Fleet Velocity
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, color: 'var(--primary-container)' }}>
            0.14c
          </span>
        </div>
      </div>

      {/* Scroll Storytelling: Sci-Fi Telemetry Panel */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--primary-container)', fontWeight: 'bold' }}>
            COSMICAL SUB-SYSTEM OPERATIONS
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff', marginTop: '6px' }}>
            Sector 001 Real-Time Telemetry
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="stats-grid">
          
          {/* Card A: Oscillator wave */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--on-surface-variant)' }}>WAVE OSCILLATOR SIGNAL</span>
            <div style={{ height: '80px', border: '1px solid rgba(0,240,255,0.1)', borderRadius: '6px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
              <canvas ref={waveCanvasRef} width="240" height="80" style={{ display: 'block', width: '100%', height: '100%' }} />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Locking radio carrier sweep frequency...</span>
          </div>

          {/* Card B: Quantums Flux logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--on-surface-variant)' }}>QUANTUM FLUX SPECS</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                <span>RADIATION RATIO</span>
                <span style={{ color: 'var(--primary-container)', fontFamily: 'var(--font-data)' }}>84.2 mSv/h</span>
              </div>
              <div style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                <span>MAGNETIC FLUX</span>
                <span style={{ color: 'var(--primary-container)', fontFamily: 'var(--font-data)' }}>14,208 nT</span>
              </div>
            </div>
          </div>

          {/* Card C: Singularity target */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--on-surface-variant)' }}>SINGULARITY SECTOR TARGET</span>
            <div style={{ padding: '10px', borderRadius: '6px', border: '1px dashed rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)', display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Sagittarius A*</div>
                <div style={{ fontSize: '9px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-data)', marginTop: '2px' }}>RA: 17h 45m 40s</div>
              </div>
              <span className="status-chip active" style={{ fontSize: '8px' }}>TARGET LOCKED</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column !important;
            text-align: center;
            gap: 24px !important;
          }
          .hero-title {
            font-size: 38px !important;
            line-height: 44px !important;
          }
          .hero-planet-wrapper {
            max-width: 250px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeView;
