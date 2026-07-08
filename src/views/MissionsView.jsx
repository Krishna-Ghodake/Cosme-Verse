// MissionsView.jsx - Space Mission Control Center & Landing Physics Simulator
import React, { useState, useEffect, useRef } from 'react';
import spaceSounds from '../components/SoundManager';

const MissionsView = () => {
  // Mission database
  const missions = {
    apollo11: {
      name: 'Apollo 11',
      classification: 'CREWED LUNAR LANDING',
      rocket: 'Saturn V (Heavy-Lift)',
      spacecraft: 'Command Module Columbia & Lunar Module Eagle',
      crew: ['Neil Armstrong (Commander)', 'Buzz Aldrin (Lunar Module Pilot)', 'Michael Collins (Command Module Pilot)'],
      launchDate: 'July 16, 1969',
      duration: '8 Days, 3 Hours',
      objectives: 'Perform crewed lunar landing, collect lunar surface soil samples, deploy scientific seismometers, and return safely to Earth.',
      discoveries: 'Analyzed basaltic rocks confirming ancient lunar volcanic flows. Placed solar wind composition foils.',
      stats: { altitude: '384,400 km', speed: '39,000 km/h (Escape)', mass: '2,900,000 kg (Gross)' },
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA9_7A3Tn1dAZ5Jb6S3OgfJ2sK7keKFpruRKeiW6sOey-Lofzni2OSkV77NU9Nnw6WRCf-NfGjKP9SQcficXSIO9vYYBi0q3sY_WF1oXjcPIPafdlXTU8f1nZC1WJi-ADmhn-tt5dbGv4Ds7BcljVK-iBhq0HKCrmjcXzHH9x3U1dee8gWcS6u2c5zV1cnFIZ2lDcpmlnINY72PSsXZWvwwKZqEasB6k4NCgpE5LjyX7n6LsNKPWU84'
      ]
    },
    voyager1: {
      name: 'Voyager 1',
      classification: 'INTERSTELLAR SCIENTIFIC PROBE',
      rocket: 'Titan IIIE (Centaur)',
      spacecraft: 'Voyager Planetary Probe',
      crew: ['Unmanned Probe (AI Autonomy)'],
      launchDate: 'Sept 5, 1977',
      duration: '48 Years (Active Operations)',
      objectives: 'Execute close-up flybys of Jupiter and Saturn system, and traverse outer solar system boundaries into interstellar space.',
      discoveries: 'Discovered volcanic eruptions on Io, complex rings on Saturn, and traversed the heliopause in 2012.',
      stats: { altitude: '24.4 Billion km', speed: '61,200 km/h', mass: '773 kg' },
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDn5hOZg6iA_Vz5GNt1D8HjpnB_PpCAStZMtSPLz0YrnS11ubf89jV5wMtdNg76BPgB14Hi9cRMO7xzSXjj9oOne2-k2MlyeCc-l_mw6uxELqFHunx44aZRMHP767_npEAgsIS1I8GzY3ZqwR9daYPLBptHYOsnJu_vS-Ad73wUjtzPm0yO1Ra6JDKLMoX9vvLhdr5uwLkcxrcWNGx_-ChdP0XipG5--zaKKu37CPE83Tx3ry_255VP'
      ]
    },
    jwst: {
      name: 'James Webb Space Telescope',
      classification: 'INFRARED DEEP SPACE OBSERVATORY',
      rocket: 'Ariane 5 (ECA)',
      spacecraft: 'JWST Deployable Array',
      crew: ['Unmanned Observatory'],
      launchDate: 'Dec 25, 2021',
      duration: '4 Years (Operational)',
      objectives: 'Observe early stars and galaxies formed after the Big Bang, study planetary atmospheres, and analyze exoplanet biosignatures.',
      discoveries: 'Detected carbon dioxide on WASP-39b exoplanet. Photographed earliest galaxies formed 300 million years post Big Bang.',
      stats: { altitude: '1.5 Million km (L2)', speed: 'Stabilized Orbit', mass: '6,500 kg' },
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAesAwcdzipvi8jS62YMMlGhGZkbqesWWFnNb3o7ZCjGof2P0HYf_WKcAQ8UlzfDZK7YPc_i9Q2ykZy3r-NzSAYNMaA78cQ5jfNfr9AqAkLoy-vDxEni-Z7bmz5accMGu9HdeBvheWcyUm81AWuwLxxTF10pmfREkA9vgheoGTVoIa9ZuOgvpb2KXjTGLfLeBWnbKQ5SsPQ0eqDaemhhbo0cM3kX-msPE4Qi1vyzx1g7F1qP_V2ezoX'
      ]
    },
    curiosity: {
      name: 'Curiosity Rover',
      classification: 'MARS GEOLOGICAL EXPLORER',
      rocket: 'Atlas V (541)',
      spacecraft: 'Mars Science Laboratory Rover',
      crew: ['Unmanned Rover (Gale Crater Operations)'],
      launchDate: 'Nov 26, 2011',
      duration: '14 Years (Active Operations)',
      objectives: 'Determine if Mars ever supported habitable conditions for microbial life by drilling rocks and checking clay minerals.',
      discoveries: 'Confirmed ancient flowing streams inside Gale Crater. Detected fluctuations of atmospheric methane.',
      stats: { altitude: 'Surface of Mars', speed: '0.14 km/h (Drive)', mass: '899 kg' },
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDn5hOZg6iA_Vz5GNt1D8HjpnB_PpCAStZMtSPLz0YrnS11ubf89jV5wMtdNg76BPgB14Hi9cRMO7xzSXjj9oOne2-k2MlyeCc-l_mw6uxELqFHunx44aZRMHP767_npEAgsIS1I8GzY3ZqwR9daYPLBptHYOsnJu_vS-Ad73wUjtzPm0yO1Ra6JDKLMoX9vvLhdr5uwLkcxrcWNGx_-ChdP0XipG5--zaKKu37CPE83Tx3ry_255VP'
      ]
    }
  };

  const [selectedMission, setSelectedMission] = useState('apollo11');
  const [activeSubTab, setActiveSubTab] = useState('telemetry');

  // Interactive Launch Simulator States
  const [launchActive, setLaunchActive] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launchAlt, setLaunchAlt] = useState(0);
  const [launchSpeed, setLaunchSpeed] = useState(0);

  // Interactive Landing Game States
  const [landerY, setLanderY] = useState(40);
  const [landerVY, setLanderVY] = useState(0);
  const [landerFuel, setLanderFuel] = useState(100);
  const [landerStatus, setLanderStatus] = useState('HOVERING'); // HOVERING, LANDED, CRASHED
  const [isThrusting, setIsThrusting] = useState(false);

  const launchCanvasRef = useRef(null);
  const landingCanvasRef = useRef(null);

  // 1. Launch Simulator Render Loop
  useEffect(() => {
    if (activeSubTab !== 'launch-simulator') return;
    const canvas = launchCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];

    const drawLaunch = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rx = canvas.width / 2;
      const ry = canvas.height - 40 - launchProgress * 180;

      // Draw exhaust flame particles
      if (launchActive && launchProgress < 0.95) {
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: rx + (Math.random() - 0.5) * 8,
            y: ry + 12,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 2,
            alpha: 1.0,
            size: Math.random() * 5 + 2
          });
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, ${Math.floor(p.alpha * 180) + 70}, 0, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw pad base
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(rx - 50, canvas.height - 40, 100, 8);

      // Draw simple vector rocket
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rx - 4, ry - 15, 8, 30);
      ctx.fillStyle = 'var(--primary-container)';
      ctx.beginPath();
      ctx.moveTo(rx - 4, ry - 15);
      ctx.lineTo(rx, ry - 25);
      ctx.lineTo(rx + 4, ry - 15);
      ctx.fill();

      // Launch details text overlay on canvas
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '8px var(--font-data)';
      ctx.fillText(`ALTITUDE: ${Math.floor(launchAlt)} km`, 16, 24);
      ctx.fillText(`VELOCITY: ${Math.floor(launchSpeed)} km/h`, 16, 36);

      animId = requestAnimationFrame(drawLaunch);
    };

    drawLaunch();
    return () => cancelAnimationFrame(animId);
  }, [activeSubTab, launchActive, launchProgress, launchAlt, launchSpeed]);

  // 2. Launch Action Handler
  const startLaunchSequence = () => {
    if (launchActive) return;
    spaceSounds.playTransition();
    setLaunchActive(true);
    setLaunchProgress(0);
    setLaunchAlt(0);
    setLaunchSpeed(0);

    let prog = 0;
    const interval = setInterval(() => {
      prog += 0.006;
      setLaunchProgress(Math.min(1.0, prog));
      setLaunchAlt(prog * 360);
      setLaunchSpeed(prog * 28000);

      if (prog >= 1.0) {
        clearInterval(interval);
        setLaunchActive(false);
        // Unlock achievement
        window.dispatchEvent(new CustomEvent('unlock-achievement', {
          detail: {
            id: 'flight-commander',
            title: 'Flight Commander',
            desc: 'Initiated a clean heavy-lift orbital launch path to LEO!'
          }
        }));
      }
    }, 45);
  };

  // 3. Landing Game Physics Loop
  useEffect(() => {
    if (activeSubTab !== 'landing-simulator') return;
    const canvas = landingCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const padY = canvas.height - 30;

      // Physics updates
      if (landerStatus === 'HOVERING') {
        const gravity = 0.045;
        const thrust = isThrusting && landerFuel > 0 ? -0.11 : 0;

        setLanderVY(prev => prev + gravity + thrust);
        setLanderY(prev => {
          const nextY = prev + landerVY;
          
          // Collision check with landing pad
          if (nextY >= padY - 15) {
            if (Math.abs(landerVY) < 1.6) {
              setLanderStatus('LANDED');
              spaceSounds.playAchievement();
            } else {
              setLanderStatus('CRASHED');
              spaceSounds.playHover();
            }
            return padY - 15;
          }
          return nextY;
        });

        if (isThrusting && landerFuel > 0) {
          setLanderFuel(prev => Math.max(0, prev - 0.7));
        }
      }

      // Draw Landing Pad
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(cx - 30, padY, 60, 4);

      // Draw Lander module
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 8, landerY, 16, 12);
      // Legs
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 8, landerY + 12);
      ctx.lineTo(cx - 12, landerY + 18);
      ctx.moveTo(cx + 8, landerY + 12);
      ctx.lineTo(cx + 12, landerY + 18);
      ctx.stroke();

      // Thruster flame
      if (isThrusting && landerFuel > 0 && landerStatus === 'HOVERING') {
        ctx.fillStyle = '#ff7043';
        ctx.beginPath();
        ctx.moveTo(cx - 4, landerY + 12);
        ctx.lineTo(cx, landerY + 22);
        ctx.lineTo(cx + 4, landerY + 12);
        ctx.fill();
      }

      // HUD overlays
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '8px var(--font-data)';
      ctx.fillText(`DESCENT SPEED: ${landerVY.toFixed(2)} M/S`, 16, 24);
      ctx.fillText(`FUEL PROFILE: ${Math.floor(landerFuel)}%`, 16, 36);

      if (landerStatus !== 'HOVERING') {
        ctx.fillStyle = landerStatus === 'LANDED' ? '#2ecc71' : '#e74c3c';
        ctx.font = '12px var(--font-display)';
        ctx.fillText(landerStatus, cx - 28, 80);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animId);
  }, [activeSubTab, landerY, landerVY, landerFuel, landerStatus, isThrusting]);

  const resetLandingGame = () => {
    spaceSounds.playClick();
    setLanderY(30);
    setLanderVY(0);
    setLanderFuel(100);
    setLanderStatus('HOVERING');
    setIsThrusting(false);
  };

  const handleMissionSelect = (id) => {
    spaceSounds.playTransition();
    setSelectedMission(id);
    setActiveSubTab('telemetry');
    resetLandingGame();
  };

  return (
    <section style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p className="font-data-label" style={{ color: 'var(--primary-container)', marginBottom: '8px' }}>MISSION CONTROL COMMAND</p>
          <h1 className="font-display-xl" style={{ fontSize: '46px', margin: 0 }}>Mission Operations</h1>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 8.5fr', gap: 'var(--gutter)' }} className="hud-grid">
        
        {/* Left sidebar: Missions lists */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold', marginBottom: '10px' }}>MISSION DIRECTORY</span>
          {Object.keys(missions).map(id => (
            <button
              key={id}
              onClick={() => handleMissionSelect(id)}
              className="comms-history-btn"
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                border: selectedMission === id ? '1px solid var(--primary-container)' : '1px solid transparent',
                background: selectedMission === id ? 'rgba(0,240,255,0.06)' : 'transparent',
                color: selectedMission === id ? 'var(--primary-container)' : '#fff',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {missions[id].name}
            </button>
          ))}
        </div>

        {/* Main Viewport: Mission details */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '520px' }}>
          
          <div>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '28px', color: '#fff' }}>
                {missions[selectedMission].name}
              </h2>
              <span className="status-chip active" style={{ fontSize: '9px' }}>
                {missions[selectedMission].classification}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
              LAUNCH DATE: {missions[selectedMission].launchDate} • DURATION: {missions[selectedMission].duration}
            </div>
          </div>

          {/* Sub tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['telemetry', 'launch-simulator', 'landing-simulator'].map(t => (
              <button
                key={t}
                onClick={() => { spaceSounds.playClick(); setActiveSubTab(t); }}
                style={{
                  padding: '6px 12px',
                  background: activeSubTab === t ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.01)',
                  border: activeSubTab === t ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.05)',
                  color: activeSubTab === t ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-data)',
                  fontSize: '9px',
                  textTransform: 'uppercase'
                }}
              >
                {t.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Sub tab panels */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {activeSubTab === 'telemetry' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
                
                {/* Specs grids */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="glass-panel" style={{ padding: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)' }}>MAX ALTITUDE</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: '#fff' }}>{missions[selectedMission].stats.altitude}</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)' }}>VELOCITY</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: '#fff' }}>{missions[selectedMission].stats.speed}</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)' }}>DRY MASS</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '4px', color: '#fff' }}>{missions[selectedMission].stats.mass}</div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: 'var(--on-surface-variant)', lineHeight: '20px' }}>
                  <strong>OBJECTIVES:</strong> {missions[selectedMission].objectives}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                  <strong>SCIENTIFIC DISCOVERIES:</strong>
                  <p style={{ margin: '4px 0 0 0' }}>{missions[selectedMission].discoveries}</p>
                </div>

                <div>
                  <strong>ROCKET BOOSTER:</strong> <span style={{ color: 'var(--primary-container)' }}>{missions[selectedMission].rocket}</span>
                </div>

                <div>
                  <strong>ACTIVE CREW/HABITANTS:</strong>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '12px' }}>
                    {missions[selectedMission].crew.map((member, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>{member}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeSubTab === 'launch-simulator' && (
              <div style={{ display: 'grid', gridTemplateColumns: '6fr 6fr', gap: '16px', flex: 1 }} className="hud-grid">
                <div style={{ border: '1px dashed rgba(0,240,255,0.15)', borderRadius: '8px', background: 'rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden', height: '260px' }}>
                  <canvas ref={launchCanvasRef} width="280" height="260" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-data)', fontSize: '11px', lineHeight: '18px' }}>
                    🚀 <strong>LAUNCH ENGINE CHECKLIST:</strong>
                    <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px', color: 'var(--on-surface-variant)' }}>
                      <li>Telemetry link: STABLE</li>
                      <li>LOX tank pressure: NOMINAL</li>
                      <li>Ignition system: ARMED</li>
                    </ul>
                  </div>
                  <button 
                    onClick={startLaunchSequence}
                    disabled={launchActive}
                    className="btn-primary"
                    style={{ padding: '12px', borderRadius: '4px', opacity: launchActive ? 0.5 : 1 }}
                  >
                    {launchActive ? 'ASCENT ACTIVE...' : 'INITIATE LAUNCH'}
                  </button>
                </div>
              </div>
            )}

            {activeSubTab === 'landing-simulator' && (
              <div style={{ display: 'grid', gridTemplateColumns: '6fr 6fr', gap: '16px', flex: 1 }} className="hud-grid">
                <div style={{ border: '1px dashed rgba(0,240,255,0.15)', borderRadius: '8px', background: 'rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden', height: '260px' }}>
                  <canvas ref={landingCanvasRef} width="280" height="260" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-data)', fontSize: '10px', lineHeight: '15px' }}>
                    🎮 <strong>LANDER PHYSICS CONTROL:</strong>
                    <p style={{ color: 'var(--on-surface-variant)', margin: '4px 0 0 0' }}>
                      Fire the thruster to slow your descent. Touchdown speed must be <strong>less than 1.60 m/s</strong>.
                    </p>
                  </div>
                  <button 
                    onMouseDown={() => setIsThrusting(true)}
                    onMouseUp={() => setIsThrusting(false)}
                    onTouchStart={() => setIsThrusting(true)}
                    onTouchEnd={() => setIsThrusting(false)}
                    disabled={landerStatus !== 'HOVERING'}
                    className="btn-primary"
                    style={{ padding: '10px', borderRadius: '4px', cursor: 'pointer', background: 'rgba(0,240,255,0.18)' }}
                  >
                    HOLD TO FIRE THRUSTERS
                  </button>
                  <button 
                    onClick={resetLandingGame}
                    className="btn-secondary"
                    style={{ padding: '8px', borderRadius: '4px' }}
                  >
                    RESET SIMULATION
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </section>
  );
};

export default MissionsView;
