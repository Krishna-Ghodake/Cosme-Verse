// BlackHoleSimulator.jsx - Einsteinian Accretion Disk, Lensing, & Quantum Plunge Laboratory
import React, { useEffect, useRef, useState } from 'react';
import spaceSounds from './SoundManager';

const BlackHoleSimulator = () => {
  // Real scientific black holes database
  const blackHoles = {
    cygnus: {
      name: 'Cygnus X-1',
      classification: 'Stellar-Mass Black Hole',
      mass: '21 M_☉',
      schwarzkopf: '62 km',
      distance: '6,070 Light Years',
      gMass: 350, // Simulation gravity
      diskColor: 'cyan',
      scienceData: 'First black hole widely accepted by astronomers. Actively stripping gas from its companion blue supergiant HDE 226868.'
    },
    sagittarius: {
      name: 'Sagittarius A*',
      classification: 'Supermassive Black Hole (Milky Way)',
      mass: '4.1 Million M_☉',
      schwarzkopf: '12 Million km',
      distance: '26,670 Light Years',
      gMass: 800,
      diskColor: 'cyan',
      scienceData: 'The supermassive gravitational core anchoring our home galaxy. Fuses accretion flows at slow rates, surrounded by orbiting S-stars.'
    },
    m87: {
      name: 'M87*',
      classification: 'Ultra-Massive Black Hole (M87 Core)',
      mass: '6.5 Billion M_☉',
      schwarzkopf: '19 Billion km',
      distance: '55 Million Light Years',
      gMass: 1400,
      diskColor: 'purple',
      scienceData: 'First black hole to be directly imaged by the Event Horizon Telescope. Emits a massive relativistic plasma jet spanning 5,000 light-years.'
    }
  };

  const [selectedBH, setSelectedBH] = useState('sagittarius');
  const [plungeActive, setPlungeActive] = useState(false);
  const [plungeStatus, setPlungeStatus] = useState('');
  const [plungeVal, setPlungeVal] = useState(0);

  // Compare mode states
  const [bhCompareMode, setBhCompareMode] = useState(false);
  const [compBH1, setCompBH1] = useState('cygnus');
  const [compBH2, setCompBH2] = useState('m87');

  const canvasRef = useRef(null);
  const canvasRef1 = useRef(null); // Comparison canvas 1
  const canvasRef2 = useRef(null); // Comparison canvas 2

  const particles = useRef([]);
  const hawkingParticles = useRef([]);
  const backgroundStars = useRef([]);

  // Comp particles
  const compParticles1 = useRef([]);
  const compParticles2 = useRef([]);

  const initStars = (w, h) => {
    backgroundStars.current = [];
    for (let i = 0; i < 150; i++) {
      backgroundStars.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        brightness: Math.random() * 0.8 + 0.2,
        size: Math.random() * 1.5 + 0.5
      });
    }
  };

  // Standard simulation logic
  useEffect(() => {
    if (bhCompareMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let diskAngle = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 600;
      canvas.height = parent.clientHeight || 400;
      initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const dx = clickX - cx;
      const dy = clickY - cy;
      const dist = Math.hypot(dx, dy);

      const bhData = blackHoles[selectedBH];
      const limitR = 24 * (plungeActive ? (1 + plungeVal * 5) : 1);
      if (dist < limitR) return;

      const speed = Math.sqrt(bhData.gMass / dist) * (0.85 + Math.random() * 0.3);
      particles.current.push({
        x: clickX,
        y: clickY,
        vx: -dy / dist * speed,
        vy: dx / dist * speed,
        size: Math.random() * 2 + 1,
        color: bhData.diskColor === 'cyan' ? '#00f0ff' : '#cf5cff',
        trail: []
      });
      spaceSounds.playHover();
    };

    canvas.addEventListener('click', handleCanvasClick);

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 20, 36, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const bhData = blackHoles[selectedBH];
      const activeScale = plungeActive ? (1 + plungeVal * 6) : 1.0;
      const r = 22 * activeScale;

      // 1. Draw lensed stars
      ctx.fillStyle = '#ffffff';
      backgroundStars.current.forEach(star => {
        const dx = star.x - cx;
        const dy = star.y - cy;
        const dist = Math.hypot(dx, dy);

        let drawX = star.x;
        let drawY = star.y;

        if (dist > r) {
          const lenseR = r * 1.5;
          const warp = 1.0 + (lenseR * lenseR * 0.45) / (dist * dist);
          drawX = cx + dx * warp;
          drawY = cy + dy * warp;
        } else {
          return; // Eclipse
        }

        ctx.globalAlpha = star.brightness;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 2. Draw Hawking Radiation vertically
      if (Math.random() < 0.3 && !plungeActive) {
        const isNorth = Math.random() < 0.5;
        hawkingParticles.current.push({
          x: cx + (Math.random() - 0.5) * 8,
          y: cy + (isNorth ? -r * 0.8 : r * 0.8),
          vx: (Math.random() - 0.5) * 1.2,
          vy: isNorth ? -(Math.random() * 2 + 1) : (Math.random() * 2 + 1),
          alpha: 1.0,
          color: bhData.diskColor === 'cyan' ? '#00f0ff' : '#cf5cff',
          size: Math.random() * 2.2 + 0.5
        });
      }

      for (let i = hawkingParticles.current.length - 1; i >= 0; i--) {
        const hp = hawkingParticles.current[i];
        hp.x += hp.vx;
        hp.y += hp.vy;
        hp.alpha -= 0.015;

        if (hp.alpha <= 0 || hp.x < 0 || hp.x > canvas.width || hp.y < 0 || hp.y > canvas.height) {
          hawkingParticles.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = hp.alpha;
        ctx.fillStyle = hp.color;
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, hp.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 3. Accretion Disk (Einstein warped profiles)
      diskAngle += 0.02;
      ctx.save();
      // Back half
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, cy);
      ctx.clip();
      drawAccretionDisk(ctx, cx, cy, r, diskAngle, true, bhData.diskColor);
      ctx.restore();

      // Mid particles
      updateParticles(ctx, cx, cy, r, bhData.gMass, activeScale, particles.current);

      // Front half
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, cy - r * 0.1, canvas.width, cy + r * 4);
      ctx.clip();
      drawAccretionDisk(ctx, cx, cy, r, diskAngle, false, bhData.diskColor);
      ctx.restore();
      ctx.restore();

      // 4. Singularity Event Horizon Shadow
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (canvas) canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedBH, plungeActive, plungeVal, bhCompareMode]);

  // Comparison Dual-Canvas Render loops
  useEffect(() => {
    if (!bhCompareMode) return;

    let animId;
    let diskAngle = 0;

    const canvas1 = canvasRef1.current;
    const canvas2 = canvasRef2.current;
    if (!canvas1 || !canvas2) return;

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    const handleCanvas1Click = (e) => {
      spawnOrbital(e, canvas1, compParticles1, blackHoles[compBH1].gMass);
    };
    const handleCanvas2Click = (e) => {
      spawnOrbital(e, canvas2, compParticles2, blackHoles[compBH2].gMass);
    };

    canvas1.addEventListener('click', handleCanvas1Click);
    canvas2.addEventListener('click', handleCanvas2Click);

    const drawCompare = () => {
      diskAngle += 0.02;

      const drawLoop = (ctx, c, bhKey, pList) => {
        ctx.fillStyle = 'rgba(5, 20, 36, 0.28)';
        ctx.fillRect(0, 0, c.width, c.height);

        const cx = c.width / 2;
        const cy = c.height / 2;
        const bhData = blackHoles[bhKey];
        const r = bhKey === 'cygnus' ? 12 : bhKey === 'sagittarius' ? 24 : 38;

        // Draw accretion back
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, c.width, cy);
        ctx.clip();
        drawAccretionDisk(ctx, cx, cy, r, diskAngle, true, bhData.diskColor);
        ctx.restore();

        // Particles
        updateParticles(ctx, cx, cy, r, bhData.gMass, 1.0, pList.current);

        // Draw accretion front
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, cy - r * 0.1, c.width, cy + r * 4);
        ctx.clip();
        drawAccretionDisk(ctx, cx, cy, r, diskAngle, false, bhData.diskColor);
        ctx.restore();

        // Event Horizon
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };

      drawLoop(ctx1, canvas1, compBH1, compParticles1);
      drawLoop(ctx2, canvas2, compBH2, compParticles2);

      animId = requestAnimationFrame(drawCompare);
    };

    drawCompare();

    return () => {
      cancelAnimationFrame(animId);
      if (canvas1) canvas1.removeEventListener('click', handleCanvas1Click);
      if (canvas2) canvas2.removeEventListener('click', handleCanvas2Click);
    };
  }, [bhCompareMode, compBH1, compBH2]);

  const spawnOrbital = (e, c, pList, gMass) => {
    const rect = c.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const cx = c.width / 2;
    const cy = c.height / 2;
    const dx = clickX - cx;
    const dy = clickY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < 15) return;
    const speed = Math.sqrt(gMass / dist) * 0.95;
    pList.current.push({
      x: clickX,
      y: clickY,
      vx: -dy / dist * speed,
      vy: dx / dist * speed,
      size: 2,
      color: '#00f0ff',
      trail: []
    });
    spaceSounds.playHover();
  };

  const drawAccretionDisk = (ctx, cx, cy, r, angle, isBackHalf, color) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle * (isBackHalf ? -0.25 : 0.75));

    const w = r * (isBackHalf ? 4.2 : 5.2);
    const h = r * (isBackHalf ? 1.6 : 0.75); // Lensed warp raises back profile

    const grad = ctx.createRadialGradient(0, 0, r * 0.85, 0, 0, w);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, color === 'cyan' ? '#00f0ff' : '#cf5cff');
    grad.addColorStop(0.55, 'rgba(235, 104, 76, 0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const updateParticles = (ctx, cx, cy, r, gMass, scale, pList) => {
    for (let i = pList.length - 1; i >= 0; i--) {
      const p = pList[i];
      const dx = cx - p.x;
      const dy = cy - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= r) {
        pList.splice(i, 1);
        continue;
      }

      const force = gMass * scale / (dist * dist);
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
      p.x += p.vx;
      p.y += p.vy;

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 8) p.trail.shift();

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      for (let j = 0; j < p.trail.length; j++) {
        if (j === 0) ctx.moveTo(p.trail[j].x, p.trail[j].y);
        else ctx.lineTo(p.trail[j].x, p.trail[j].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Plunge Into Singularity animation timeline
  const triggerPlunge = () => {
    if (plungeActive) return;
    spaceSounds.playTransition();
    
    // Unlock achievement
    window.dispatchEvent(new CustomEvent('unlock-achievement', {
      detail: {
        id: 'black-hole-voyager',
        title: 'Black Hole Voyager',
        desc: 'Plunged deep inside the event horizon singularity and survived!'
      }
    }));

    setPlungeActive(true);
    setPlungeStatus('APPROACHING EVENT HORIZON...');
    
    // Animate plunge delta values
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      setPlungeVal(progress);

      if (progress >= 0.4 && progress < 0.7) {
        setPlungeStatus('LIGHT BENDING CRITICAL... TIME DILATION 10,000x');
      } else if (progress >= 0.7 && progress < 0.95) {
        setPlungeStatus('SINGULARITY CONTACT IMMINENT... HOLOGRAPH DETACHING');
      }

      if (progress >= 1.0) {
        clearInterval(interval);
        setPlungeStatus('QUANTUM SINGULARITY PENETRATED. SYSTEM REBOOTING...');
        setTimeout(() => {
          setPlungeActive(false);
          setPlungeVal(0);
          setPlungeStatus('');
        }, 1800);
      }
    }, 60);
  };

  const handleBHSelect = (key) => {
    spaceSounds.playPlanetSelect();
    setSelectedBH(key);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '520px' }}>
      
      {/* Sandbox Controller Bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justify: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!bhCompareMode ? (
            ['sagittarius', 'cygnus', 'm87'].map(k => (
              <button
                key={k}
                onClick={() => handleBHSelect(k)}
                className={`btn-ghost ${selectedBH === k ? 'active' : ''}`}
                style={{
                  padding: '6px 12px',
                  fontSize: '9px',
                  borderRadius: '4px',
                  background: selectedBH === k ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0,0,0,0.4)',
                  borderColor: selectedBH === k ? 'var(--primary-container)' : 'rgba(255,255,255,0.08)'
                }}
              >
                {blackHoles[k].name}
              </button>
            ))
          ) : (
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--primary-container)', fontWeight: 'bold' }}>
              SIDE-BY-SIDE GRAVITATIONAL LAB
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!bhCompareMode && (
            <button
              onClick={triggerPlunge}
              disabled={plungeActive}
              className="btn-primary"
              style={{ padding: '6px 14px', borderRadius: '4px', fontSize: '9px', opacity: plungeActive ? 0.5 : 1 }}
            >
              SINGULARITY PLUNGE
            </button>
          )}
          <button
            onClick={() => { spaceSounds.playClick(); setBhCompareMode(prev => !prev); }}
            className="btn-secondary"
            style={{ padding: '6px 14px', borderRadius: '4px', fontSize: '9px' }}
          >
            {bhCompareMode ? 'EXIT COMPARE' : 'COMPARE DECK'}
          </button>
        </div>
      </div>

      {/* RENDER MODE A: Standard Interactive Lab */}
      {!bhCompareMode ? (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '8fr 4fr', position: 'relative' }} className="hud-grid">
          
          {/* Main simulator canvas */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }} />
            
            {/* Plunge Overlay Diagnostic */}
            {plungeActive && (
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(5, 20, 36, ${plungeVal * 0.95})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '16px',
                  fontFamily: 'var(--font-data)',
                  color: 'var(--primary-container)',
                  zIndex: 10
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.15em', textShadow: '0 0 10px rgba(0,240,255,0.8)' }}>
                  {plungeStatus}
                </div>
                <div style={{ width: '280px', height: '4px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--primary-container)', width: `${plungeVal * 100}%` }} />
                </div>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', pointerEvents: 'none' }}>
              TAP CANVAS TO INJECT PLASMA PROBE PARTICLES
            </div>
          </div>

          {/* Side Scientific Specs dossier */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold' }}>SINGULARITY PROFILE</span>
              <h3 style={{ margin: '4px 0 0 0', fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff' }}>
                {blackHoles[selectedBH].name}
              </h3>
              <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>{blackHoles[selectedBH].classification}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <div><span style={{ color: 'var(--on-surface-variant)' }}>MASS:</span> <strong style={{ color: '#fff', fontFamily: 'var(--font-data)' }}>{blackHoles[selectedBH].mass}</strong></div>
              <div><span style={{ color: 'var(--on-surface-variant)' }}>EVENT HORIZON (R_s):</span> <strong style={{ color: '#fff', fontFamily: 'var(--font-data)' }}>{blackHoles[selectedBH].schwarzkopf}</strong></div>
              <div><span style={{ color: 'var(--on-surface-variant)' }}>DISTANCE:</span> <strong style={{ color: '#fff', fontFamily: 'var(--font-data)' }}>{blackHoles[selectedBH].distance}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', fontSize: '12px', lineHeight: '18px', color: 'var(--on-surface-variant)' }}>
              <strong style={{ color: '#fff', fontSize: '11px', display: 'block', marginBottom: '4px' }}>GRAVITATIONAL DYNAMICS:</strong>
              <p>{blackHoles[selectedBH].scienceData}</p>
            </div>
          </div>

        </div>
      ) : (
        /* RENDER MODE B: Compare Side-by-Side Deck */
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gutter)', padding: '16px' }} className="hud-grid">
          
          {/* Compare column 1 */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <select
                value={compBH1}
                onChange={(e) => { spaceSounds.playClick(); setCompBH1(e.target.value); }}
                style={{ background: 'rgba(5,20,36,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px', fontSize: '12px', borderRadius: '4px', outline: 'none' }}
              >
                {Object.keys(blackHoles).map(k => (
                  <option key={k} value={k}>{blackHoles[k].name}</option>
                ))}
              </select>
              <span className="status-chip active" style={{ fontSize: '8px' }}>G*M: {blackHoles[compBH1].mass}</span>
            </div>
            <div style={{ flex: 1, border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden', minHeight: '240px' }}>
              <canvas ref={canvasRef1} style={{ display: 'block', width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Compare column 2 */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <select
                value={compBH2}
                onChange={(e) => { spaceSounds.playClick(); setCompBH2(e.target.value); }}
                style={{ background: 'rgba(5,20,36,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px', fontSize: '12px', borderRadius: '4px', outline: 'none' }}
              >
                {Object.keys(blackHoles).map(k => (
                  <option key={k} value={k}>{blackHoles[k].name}</option>
                ))}
              </select>
              <span className="status-chip active" style={{ fontSize: '8px' }}>G*M: {blackHoles[compBH2].mass}</span>
            </div>
            <div style={{ flex: 1, border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden', minHeight: '240px' }}>
              <canvas ref={canvasRef2} style={{ display: 'block', width: '100%', height: '100%' }} />
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default BlackHoleSimulator;
