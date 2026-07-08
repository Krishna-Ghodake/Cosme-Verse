// DashboardView.jsx - Mission Operations Center, live indicators, and Astro Academy Gamification Hub
import React, { useState, useEffect, useRef } from 'react';
import SideNavBar from '../components/SideNavBar';
import RadarNEO from '../components/RadarNEO';
import RocketSimulator from '../components/RocketSimulator';
import spaceSounds from '../components/SoundManager';
import { planets } from '../data/planets';

// 1. Dynamic Mini 3D Rotating Planet Canvas component
const PlanetMini3D = ({ planetId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let rot = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 24;
      rot += 0.015;

      // Draw back ring of Saturn
      if (planetId === 'saturn') {
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 169, 109, 0.28)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 38, 6, -Math.PI / 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Base shading colors
      let stop0 = '#fff';
      let stop1 = '#00f0ff';
      let stop2 = '#020b14';

      if (planetId === 'mercury') { stop1 = '#9e9e9e'; }
      else if (planetId === 'venus') { stop1 = '#ffb74d'; }
      else if (planetId === 'earth') { stop1 = '#00f0ff'; }
      else if (planetId === 'mars') { stop1 = '#ff7043'; }
      else if (planetId === 'jupiter') { stop1 = '#ffe082'; }
      else if (planetId === 'saturn') { stop1 = '#e0a96d'; }
      else if (planetId === 'uranus') { stop1 = '#80deea'; }
      else if (planetId === 'neptune') { stop1 = '#3f51b5'; }

      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 1, cx, cy, r);
      grad.addColorStop(0, stop0);
      grad.addColorStop(0.35, stop1);
      grad.addColorStop(1, stop2);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Clip for surface rotation markings
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      if (planetId === 'mercury') {
        // Draw crater spots
        for (let i = 0; i < 5; i++) {
          const px = ((cx - r + i * 14 + rot * 6) % (r * 2)) + cx - r;
          ctx.beginPath();
          ctx.arc(px, cy - 6 + i * 2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (planetId === 'venus') {
        // Swirling pale clouds
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 3; i++) {
          const py = cy - r + 8 + i * 11;
          ctx.beginPath();
          ctx.moveTo(cx - r, py + Math.sin(rot + i) * 2);
          ctx.lineTo(cx + r, py + Math.sin(rot + i) * 2);
          ctx.stroke();
        }
      } else if (planetId === 'earth') {
        // Continents (green blobs)
        ctx.fillStyle = 'rgba(46, 204, 113, 0.22)';
        for (let i = 0; i < 3; i++) {
          const px = ((cx - r + i * 18 + rot * 7) % (r * 2)) + cx - r;
          ctx.beginPath();
          ctx.arc(px, cy - 8 + i * 5, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        // Clouds (white wisps)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        for (let i = 0; i < 2; i++) {
          const px = ((cx - r + i * 24 + rot * 10) % (r * 2)) + cx - r;
          ctx.beginPath();
          ctx.arc(px, cy + 3, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (planetId === 'mars') {
        // Dusty patches + polar cap
        ctx.fillStyle = 'rgba(120, 30, 10, 0.18)';
        for (let i = 0; i < 3; i++) {
          const px = ((cx - r + i * 16 + rot * 8) % (r * 2)) + cx - r;
          ctx.beginPath();
          ctx.arc(px, cy - 3 + i * 3, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy - r + 2.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (planetId === 'jupiter') {
        // Horizontal brown bands + Great Red Spot
        ctx.fillStyle = 'rgba(110, 50, 15, 0.25)';
        ctx.fillRect(cx - r, cy - 7, r * 2, 3);
        ctx.fillRect(cx - r, cy + 3, r * 2, 4);
        // Red Spot
        const rx = ((cx - r + rot * 5) % (r * 2)) + cx - r;
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(rx, cy + 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (planetId === 'saturn') {
        // Golden bands
        ctx.fillStyle = 'rgba(140, 100, 45, 0.18)';
        ctx.fillRect(cx - r, cy - 3, r * 2, 2.5);
        ctx.fillRect(cx - r, cy + 5, r * 2, 3.5);
      } else if (planetId === 'uranus') {
        // Tilted pale blue bands
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(cx - r, cy - 8, r * 2, 2);
        ctx.fillRect(cx - r, cy + 1, r * 2, 3);
      } else if (planetId === 'neptune') {
        // Supersonic storm spots
        ctx.fillStyle = 'rgba(15, 25, 90, 0.35)';
        const rx = ((cx - r + rot * 6.5) % (r * 2)) + cx - r;
        ctx.beginPath();
        ctx.arc(rx, cy + 2, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw front ring of Saturn
      if (planetId === 'saturn') {
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 169, 109, 0.7)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 38, 6, -Math.PI / 12, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [planetId]);

  return <canvas ref={canvasRef} width="64" height="64" style={{ display: 'block', margin: 'auto' }} />;
};

// 2. Dynamic Moons Orbit Simulator component
const PlanetMoonsSim = ({ planet }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      time += 0.015;

      // Draw central planet body
      ctx.fillStyle = planet.color || '#00f0ff';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric shading
      const shadow = ctx.createRadialGradient(cx - 4, cy - 4, 1, cx, cy, 18);
      shadow.addColorStop(0, 'rgba(255,255,255,0.2)');
      shadow.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      const moonCount = Math.min(5, planet.moons || 0);

      if (moonCount === 0) {
        // Draw radar carrier scans for moonless worlds
        ctx.strokeStyle = 'rgba(0,240,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(0,240,255,0.18)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(time * 1.2) * 45, cy + Math.sin(time * 1.2) * 45);
        ctx.stroke();
      } else {
        // Draw moon paths
        for (let i = 0; i < moonCount; i++) {
          const dist = 36 + i * 16;
          ctx.strokeStyle = 'rgba(255,255,255,0.04)';
          ctx.beginPath();
          ctx.arc(cx, cy, dist, 0, Math.PI * 2);
          ctx.stroke();

          const angle = time * (1.6 - i * 0.25);
          const mx = cx + Math.cos(angle) * dist;
          const my = cy + Math.sin(angle) * dist;

          ctx.fillStyle = '#b9cacb';
          ctx.beginPath();
          ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [planet]);

  return <canvas ref={canvasRef} width="220" height="150" style={{ display: 'block', width: '100%', height: '100%' }} />;
};

const DashboardView = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [scanning, setScanning] = useState(false);
  const [solarRadiation, setSolarRadiation] = useState(60);
  const [solarFlare, setSolarFlare] = useState(85);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  
  // ISS orbit coordinates states
  const [issCoords, setIssCoords] = useState({ lat: '51.5074 N', lng: '0.1278 W', alt: '418.5 km' });

  // Gamification States (Sync with localStorage)
  const [xp, setXp] = useState(() => Number(localStorage.getItem('astro_xp') || '2850'));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('astro_streak') || '5'));
  const [scannedPlanets, setScannedPlanets] = useState(() => {
    return JSON.parse(localStorage.getItem('scanned_planets') || '["earth", "mars"]');
  });
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    return JSON.parse(localStorage.getItem('unlocked_badges') || '["flight-commander"]');
  });

  // Selected planet for details dossier view
  const [selectedPlanet, setSelectedPlanet] = useState(planets[2]); // Default Earth
  const [telemetryTab, setTelemetryTab] = useState('dossier');

  const telemetryCanvasRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('astro_xp', xp.toString());
    localStorage.setItem('astro_streak', streak.toString());
    localStorage.setItem('scanned_planets', JSON.stringify(scannedPlanets));
    localStorage.setItem('unlocked_badges', JSON.stringify(unlockedBadges));
  }, [xp, streak, scannedPlanets, unlockedBadges]);

  // Listen to achievements from other pages
  useEffect(() => {
    const handleGlobalUnlock = (e) => {
      const { id } = e.detail;
      setUnlockedBadges(prev => {
        if (prev.includes(id)) return prev;
        setXp(x => x + 250);
        return [...prev, id];
      });
    };
    window.addEventListener('unlock-achievement', handleGlobalUnlock);
    return () => window.removeEventListener('unlock-achievement', handleGlobalUnlock);
  }, []);

  // Shifting ISS coordinates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const latVal = (45 + Math.random() * 15).toFixed(4);
      const lngVal = (20 + Math.random() * 45).toFixed(4);
      const altVal = (418 + Math.random() * 3).toFixed(1);
      setIssCoords({
        lat: `${latVal}° N`,
        lng: `${lngVal}° E`,
        alt: `${altVal} km`
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuations for solar weather
  useEffect(() => {
    const interval = setInterval(() => {
      setSolarRadiation(prev => Math.min(100, Math.max(10, prev + (Math.random() - 0.5) * 8)));
      setSolarFlare(prev => Math.min(100, Math.max(10, prev + (Math.random() - 0.5) * 5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry logger feeds
  useEffect(() => {
    const logPool = [
      'ISS-ZARYA telemetry feed synchronized.',
      'Slight orbit correction applied to Sector 04.',
      'Near-Earth Asteroid APOPHIS trajectory locked.',
      'Solar wind radiation level exceeds G3 threshold.',
      'Atmospheric density at Station Alpha-1 nominal.',
      'Transmitting Webb Telescope telemetry packet to L2.',
      'Attitude control gyro adjustment complete.'
    ];

    const interval = setInterval(() => {
      const timestamp = new Date().toISOString().slice(11, 19);
      const randomMsg = logPool[Math.floor(Math.random() * logPool.length)];
      setTelemetryLogs(prev => [`[${timestamp}] INFO: ${randomMsg}`, ...prev].slice(0, 15));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Real-time Telemetry Line Chart Canvas loop
  useEffect(() => {
    if (activeSubTab !== 'telemetry') return;
    const canvas = telemetryCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    const dataPoints = [];
    const maxPoints = 50;

    for (let i = 0; i < maxPoints; i++) {
      dataPoints.push(50 + Math.sin(i * 0.2) * 15 + (Math.random() - 0.5) * 10);
    }

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      dataPoints.push(50 + Math.sin(Date.now() * 0.001) * 20 + (Math.random() - 0.5) * 12);
      if (dataPoints.length > maxPoints) dataPoints.shift();

      ctx.strokeStyle = 'var(--primary-container)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const step = canvas.width / (maxPoints - 1);
      dataPoints.forEach((p, idx) => {
        const x = idx * step;
        const y = canvas.height - (p / 100) * canvas.height;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.fillRect(canvas.width - 4, 0, 4, canvas.height);

      animId = requestAnimationFrame(drawChart);
    };

    drawChart();
    return () => cancelAnimationFrame(animId);
  }, [activeSubTab]);

  // Live countdown to next rocket launch
  const [countdown, setCountdown] = useState({ days: 142, hours: 8, minutes: 22, seconds: 12 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let sec = prev.seconds - 1;
        let min = prev.minutes;
        let hr = prev.hours;
        let d = prev.days;

        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        if (min < 0) {
          min = 59;
          hr -= 1;
        }
        if (hr < 0) {
          hr = 23;
          d -= 1;
        }
        return { days: d, hours: hr, minutes: min, seconds: sec };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerRadarScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      spaceSounds.playAchievement();
    }, 2000);
  };

  const handleIssLockClick = () => {
    spaceSounds.playAchievement();
    window.dispatchEvent(new CustomEvent('unlock-achievement', {
      detail: {
        id: 'iss-tracker',
        title: 'ISS Tracker',
        desc: 'Acquired orbital radio signal telemetry lock on the ISS!'
      }
    }));
  };

  // Planet selection callback
  const handlePlanetSelect = (p) => {
    spaceSounds.playPlanetSelect();
    setSelectedPlanet(p);
  };

  // Planet scan triggers
  const scanPlanet = (pId) => {
    if (scannedPlanets.includes(pId)) return;
    spaceSounds.playAchievement();
    setScannedPlanets(prev => [...prev, pId]);
    setXp(prev => prev + 150);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', width: '100%' }}>
      {/* Side Control Nav */}
      <SideNavBar activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} onScanTrigger={triggerRadarScan} />

      {/* Main Operations Canvas */}
      <main style={{ flex: 1, padding: '32px 0 32px var(--margin-desktop)', marginLeft: '260px' }} className="ops-canvas">
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="font-headline-lg glow-text" style={{ margin: '0 0 8px 0', color: 'var(--primary-fixed)' }}>
              Mission Control Operations
            </h1>
            <p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>
              Real-time telemetry feeds, Near-Earth Object scans, and vehicle flight manifests.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '10px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="pulse-glow-node" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff7043' }}></span>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: '9px' }}>
              <div>ARTEMIS II COUNTDOWN</div>
              <div style={{ color: '#ff7043', fontWeight: 'bold', fontSize: '11px', marginTop: '2px' }}>
                {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
              </div>
            </div>
          </div>
        </header>

        {/* 1. Overview Bento Deck Tab */}
        {activeSubTab === 'overview' && (
          <div className="hud-grid">
            
            {/* Live Orbital Satellite Map */}
            <div className="glass-panel" style={{ gridColumn: 'span 8', height: '400px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} id="orbital-map">
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--primary-container)', fontWeight: 'bold' }}>LIVE ORBITAL SATELLITE PLOTTING</span>
                <span className="pulse-glow-node" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-container)' }}></span>
              </div>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <svg width="100%" height="100%" style={{ background: '#051424' }}>
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <circle cx="50%" cy="50%" r="90" fill="rgba(0, 240, 255, 0.02)" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.5" />
                  <circle cx="50%" cy="50%" r="45" fill="none" stroke="rgba(207, 92, 255, 0.05)" strokeWidth="1" strokeDasharray="3,3" />
                  <ellipse cx="50%" cy="50%" rx="180" ry="70" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.5" strokeDasharray="4,4" />
                  <ellipse cx="50%" cy="50%" rx="210" ry="100" fill="none" stroke="rgba(207, 92, 255, 0.15)" strokeWidth="1" />
                  <g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                    <circle cx="28%" cy="30%" r="5" fill="var(--primary-container)">
                      <animateMotion dur="15s" repeatCount="indefinite" path="M 170,-30 A 180,70 0 1,0 171,-30 Z" />
                    </circle>
                    <circle cx="28%" cy="30%" r="10" fill="none" stroke="var(--primary-container)" strokeWidth="1" opacity="0.5">
                      <animateMotion dur="15s" repeatCount="indefinite" path="M 170,-30 A 180,70 0 1,0 171,-30 Z" />
                      <animate attributeName="r" values="5;15;5" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </g>
                </svg>

                <button 
                  onClick={handleIssLockClick}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(5,20,36,0.85)',
                    padding: '12px',
                    border: '1px solid var(--primary-container)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-data)',
                    fontSize: '10px',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                  className="glow-hover"
                >
                  <div style={{ color: 'var(--primary-container)', fontWeight: 'bold' }}>📡 ISS SIGNAL LOCK</div>
                  <div>LAT: {issCoords.lat}</div>
                  <div>LNG: {issCoords.lng}</div>
                  <div>ALT: {issCoords.alt}</div>
                </button>
              </div>
            </div>

            {/* Space Weather Indicators */}
            <div className="glass-panel" style={{ gridColumn: 'span 4', height: '400px', display: 'flex', flexDirection: 'column', padding: '24px', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary-fixed)' }}>
                  wb_sunny
                </span>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', fontWeight: 'bold' }}>SPACE WEATHER MONITOR</span>
              </div>

              {/* Gauges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-data)', marginBottom: '8px' }}>
                    <span>SOLAR RADIATION</span>
                    <span style={{ color: solarRadiation > 70 ? 'var(--error-color)' : 'var(--primary-container)' }}>
                      {solarRadiation.toFixed(1)} mSv/h
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${solarRadiation}%`, background: 'var(--accent-gradient)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-data)', marginBottom: '8px' }}>
                    <span>MAGNETIC INTERFERENCE</span>
                    <span style={{ color: solarFlare > 80 ? 'var(--error-color)' : 'var(--secondary-color)' }}>
                      {solarFlare.toFixed(1)} nT
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${solarFlare}%`, background: 'linear-gradient(to right, #cf5cff, #9c27b0)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              </div>

              <div style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--primary-container)', fontWeight: 'bold' }}>PLANETARY REVOLUTION SPECS</span>
                <svg width="100%" height="80" style={{ background: 'rgba(0,0,0,0.1)' }}>
                  <circle cx="50%" cy="50%" r="5" fill="#ffca28" />
                  <circle cx="50%" cy="50%" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <circle cx="50%" cy="50%" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <circle cx="50%" cy="50%" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  
                  <g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                    <circle cx="50%" cy="14" r="2.2" fill="#90a4ae">
                      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50%" cy="8" r="3" fill="#00f0ff">
                      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50%" cy="2" r="2.6" fill="#ff7043">
                      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="11s" repeatCount="indefinite" />
                    </circle>
                  </g>
                </svg>
              </div>
            </div>

            {/* Launch manifest simulator */}
            <div className="glass-panel" style={{ gridColumn: 'span 6', minHeight: '340px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <RocketSimulator />
            </div>

            {/* NEO Asteroid Radar */}
            <div className="glass-panel" style={{ gridColumn: 'span 6', minHeight: '340px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 16px 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)' }}>
                  radar
                </span>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', fontWeight: 'bold' }}>NEAR-EARTH OBJECT DETECTOR</span>
              </div>
              <div style={{ flex: 1 }}>
                <RadarNEO />
              </div>
            </div>

          </div>
        )}

        {/* 2. Telemetry Log and Scrolling Line Graph tab */}
        {activeSubTab === 'telemetry' && (
          <div style={{ display: 'grid', gridTemplateColumns: '6fr 6fr', gap: 'var(--gutter)' }} className="hud-grid animate-fade-in">
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--primary-container)', fontWeight: 'bold' }}>REAL-TIME SCROLLING OSCILLOSCOPE</span>
              <div style={{ flex: 1, border: '1px dashed rgba(0, 240, 255, 0.15)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', overflow: 'hidden', minHeight: '260px' }}>
                <canvas ref={telemetryCanvasRef} width="320" height="260" style={{ display: 'block', width: '100%', height: '100%' }} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff' }}>Live Telemetry Logs</h3>
              <div 
                style={{ 
                  flex: 1, 
                  backgroundColor: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px', 
                  padding: '16px', 
                  fontFamily: 'var(--font-data)', 
                  fontSize: '11px', 
                  lineHeight: '20px',
                  color: '#2ecc71',
                  overflowY: 'auto',
                  height: '260px'
                }}
              >
                {telemetryLogs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: '6px' }}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Astronomy Picture of the Day (APOD) Panel Tab */}
        {activeSubTab === 'map' && (
          <div className="glass-panel" style={{ padding: '24px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--primary-fixed)' }}>Astronomy Picture of the Day</h3>
              <span className="status-chip active" style={{ fontSize: '9px' }}>NASA APOD ARCHIVE</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px' }} className="hud-grid">
              <div style={{ height: '340px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgfq4ZaqoKbSqz9Esbe_yURmp6ycNVyPrfSQmh_IEhtgrUAqj6WOe5CsngZS6keRD-Wc1NSdXCB-QMnafnkliSR4aEuQjVAoDvQkacyDhx272mFzMTbdaVJbyB0XxjlHhkDxfo5Czi9nSgU_isvYlQXAdHdZVPQdRJUDVBCol6GaV0JhrOmsB4nf-EoHxIYiH8u-qQT0NJbYFBfaQyQcyn7GplIFzV-rexQcnD96a3RTfuOwYgQkUD" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Pillars of Creation" />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-data)' }}>
                  CREDIT: NASA, ESA, CSA, STScI
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Pillars of Creation (M16)</h4>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '22px', color: 'var(--on-surface-variant)' }}>
                  A striking infrared view of the Eagle Nebula captured by the Webb Telescope. These column-like structures of cool interstellar hydrogen gas and dust are star-forming nurseries, located roughly 6,500 light-years from Earth.
                </p>
                <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '11px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-data)' }}>
                  DEEP SKY OBSERVATION DATA FEED:<br/>
                  • RA: 18h 18m 48s | DEC: -13° 49′ 00″<br/>
                  • INSTRUMENT: NIRCam Near-Infrared Camera
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Gamified Astro Academy & Planet Telemetry Cockpit */}
        {activeSubTab === 'crew' && (
          <div style={{ display: 'grid', gridTemplateColumns: '4.8fr 7.2fr', gap: 'var(--gutter)' }} className="hud-grid animate-fade-in">
            
            {/* Left Column: Academy Levels & Planet Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Level & XP progression */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)' }}>ACADEMY LEVEL</span>
                    <h3 style={{ margin: '2px 0 0 0', fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff' }}>
                      Level {Math.floor(xp / 1000) + 1} Astro-Cadet
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--on-surface-variant)' }}>STREAK</span>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff7043' }}>🔥 {streak} Days</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-data)', marginBottom: '4px' }}>
                    <span>XP PROGRESS</span>
                    <span>{xp} / {(Math.floor(xp / 1000) + 1) * 1000} XP</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${(xp % 1000) / 10}%`, 
                        background: 'var(--accent-gradient)', 
                        borderRadius: '3px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Scanned Planet Holographic Grid */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--primary-container)', fontWeight: 'bold', display: 'block', marginBottom: '14px' }}>
                  PLANETARY TELEMETRY STATIONS (SELECT TARGET)
                </span>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {planets.map(p => {
                    const isScanned = scannedPlanets.includes(p.id);
                    const isSelected = selectedPlanet.id === p.id;
                    
                    return (
                      <div 
                        key={p.id}
                        onClick={() => handlePlanetSelect(p)}
                        className="glow-hover"
                        style={{
                          padding: '16px 12px',
                          background: isSelected 
                            ? 'rgba(0, 240, 255, 0.08)' 
                            : 'rgba(255, 255, 255, 0.01)',
                          border: isSelected 
                            ? '2px solid var(--primary-container)' 
                            : '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.3s ease',
                          boxShadow: isSelected ? '0 0 20px var(--accent-glow-soft)' : 'none'
                        }}
                      >
                        {/* Mini-3D model canvas */}
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <PlanetMini3D planetId={p.id} />
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>
                            {p.name}
                          </div>
                          
                          {/* Scan button / status */}
                          <div style={{ marginTop: '8px' }}>
                            {isScanned ? (
                              <span className="status-chip active" style={{ fontSize: '8px', padding: '2px 6px' }}>SCANNED</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  scanPlanet(p.id);
                                }}
                                style={{
                                  background: 'var(--accent-gradient)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  color: '#fff',
                                  fontSize: '8px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  fontFamily: 'var(--font-data)'
                                }}
                              >
                                SCAN (+150 XP)
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Holographic Cockpit Details Dossier */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '600px' }}>
              
              {/* Dossier Header */}
              <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff', textTransform: 'uppercase' }}>
                    {selectedPlanet.name} Dossier
                  </h3>
                  <span style={{ fontSize: '9px', color: 'var(--primary-container)', fontFamily: 'var(--font-data)', letterSpacing: '0.1em' }}>
                    TARGET SELECTED • {selectedPlanet.classification} CLASS
                  </span>
                </div>
                
                {/* Telemetry subtabs */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['dossier', 'structure', 'missions'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => { spaceSounds.playClick(); setTelemetryTab(tab); }}
                      style={{
                        padding: '6px 12px',
                        background: telemetryTab === tab ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                        border: '1px solid',
                        borderColor: telemetryTab === tab ? 'var(--primary-container)' : 'rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        fontSize: '9px',
                        color: telemetryTab === tab ? '#fff' : 'var(--on-surface-variant)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-data)',
                        textTransform: 'uppercase'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </header>

              {/* Tab Content A: Core Dossier & Moon orbits */}
              {telemetryTab === 'dossier' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Top split: description & moons canvas */}
                  <div style={{ display: 'grid', gridTemplateColumns: '6.5fr 5.5fr', gap: '20px' }} className="hud-grid">
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: '22px', color: 'var(--on-surface-variant)' }}>
                        {selectedPlanet.desc}
                      </p>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderLeft: `3px solid ${selectedPlanet.color}`, borderRadius: '0 8px 8px 0', marginTop: '14px', fontSize: '11px', color: '#fff' }}>
                        <strong>Atmosphere:</strong> {selectedPlanet.details.atmosphere}
                      </div>
                    </div>

                    {/* Orbit Moons Sim */}
                    <div style={{ border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px', background: 'rgba(0,0,0,0.15)', padding: '10px', display: 'flex', flexDirection: 'column', height: '180px' }}>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--primary-container)', fontWeight: 'bold' }}>
                        MOONS ORBITAL TRACKING ({selectedPlanet.moons} Moons)
                      </span>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlanetMoonsSim planet={selectedPlanet} />
                      </div>
                    </div>
                  </div>

                  {/* Core Telemetry metrics deck */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                      PHYSICAL CONSTANTS LOGS
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {[
                        { label: 'DIAMETER', val: selectedPlanet.diameter },
                        { label: 'MASS (10²⁴kg)', val: selectedPlanet.mass },
                        { label: 'GRAVITY', val: selectedPlanet.gravity },
                        { label: 'TEMPERATURE', val: selectedPlanet.details.tempRange },
                        { label: 'DISTANCE FROM SUN', val: selectedPlanet.distanceFromSun },
                        { label: 'ESCAPE VELOCITY', val: selectedPlanet.escapeVelocity },
                        { label: 'ORBITAL SPEED', val: selectedPlanet.orbitalSpeed },
                        { label: 'ROTATION SPEED', val: selectedPlanet.rotationSpeed }
                      ].map((stat, idx) => (
                        <div key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)' }}>{stat.label}</div>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff', marginTop: '4px', fontFamily: 'var(--font-data)' }}>{stat.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab Content B: Geological Cutaways & Atmosphere */}
              {telemetryTab === 'structure' && (
                <div style={{ display: 'grid', gridTemplateColumns: '6fr 6fr', gap: '20px' }} className="hud-grid">
                  
                  {/* Geological layers list */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>INTERNAL GEOLOGICAL LAYERS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedPlanet.interior.map((layer, idx) => (
                        <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: selectedPlanet.color }}>
                            <span>{layer.name.toUpperCase()}</span>
                            <span>{layer.thickness}</span>
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                            Composition: {layer.composition}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Atmospheric boundary layers */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>ATMOSPHERIC ENVELOPE</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedPlanet.atmosphereLayers.map((layer, idx) => (
                        <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '11px' }}>
                          <strong style={{ color: '#fff', fontSize: '12px', display: 'block', marginBottom: '2px' }}>{layer.name.toUpperCase()}</strong>
                          <span style={{ color: 'var(--on-surface-variant)' }}>{layer.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab Content C: Campaigns, Missions & Discoveries */}
              {telemetryTab === 'missions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Flight Campaigns list */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>HISTORICAL SPACE CAMPAIGNS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedPlanet.explorationMissions.map((miss, idx) => (
                        <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ fontSize: '16px' }}>🛰️</span>
                          <span style={{ color: '#fff' }}>{miss}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fun Facts list */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>CELESTIAL ANOMALIES & INTERESTING FACTS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedPlanet.funFacts.map((fact, idx) => (
                        <div key={idx} style={{ padding: '10px 12px', background: 'rgba(0, 240, 255, 0.02)', border: '1px solid rgba(0, 240, 255, 0.08)', borderRadius: '8px', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                          • {fact}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* 5. System Logs Tab */}
        {activeSubTab === 'logs' && (
          <div className="glass-panel" style={{ padding: '24px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--primary-fixed)' }}>Mission Control Systems Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-data)', fontSize: '12px' }}>
              <div style={{ color: 'var(--on-surface-variant)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>[07/07 14:00] -- BOOT SEQUENCE COMPLETED -- INDEX STABLE</div>
              <div style={{ color: 'var(--primary-container)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>[07/07 14:05] -- RADIO TELESCOPE CORRELATOR CALIBRATED</div>
              <div style={{ color: 'var(--error-color)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>[07/07 14:08] -- WARNING: ELEVATED FLUX READINGS DETECTED IN SECTOR 001</div>
            </div>
          </div>
        )}

      </main>

      {/* Full screen scanning overlay */}
      {scanning && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 20, 36, 0.85)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '24px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '2px solid var(--primary-container)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px var(--accent-glow-soft)',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to right, transparent, var(--accent-glow-soft))',
                transformOrigin: 'center',
                animation: 'rotate-self 2s linear infinite'
              }}
            ></div>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary-container)', animation: 'pulse-glow 1.5s infinite ease-in-out' }}>
              radar
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: '13px', color: '#fff', letterSpacing: '0.25em' }}>SWEEPING COGNITIVE NETWORK GRIDS...</div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .ops-canvas {
            margin-left: 0 !important;
            padding: 20px var(--margin-mobile) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardView;
