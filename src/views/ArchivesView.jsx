// ArchivesView.jsx - Space Encyclopedia & Deep Space Archives
import React, { useState, useEffect, useRef } from 'react';
import BlackHoleSimulator from '../components/BlackHoleSimulator';
import Galaxy3D from '../components/Galaxy3D';
import Star3D from '../components/Star3D';
import spaceSounds from '../components/SoundManager';

const ArchivesView = () => {
  const [activeTab, setActiveTab] = useState('encyclopedia');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Encyclopedia Articles Database
  const articles = [
    {
      id: 'universe',
      name: 'The Universe',
      category: 'cosmology',
      classification: 'COSMIC SYSTEM',
      desc: 'The totality of space, time, matter, and energy. It originated roughly 13.8 billion years old in a hot, dense singularity (Big Bang) and has been expanding ever since.',
      fact: 'The observable universe spans roughly 93 billion light-years in diameter, containing trillions of galaxies.',
      science: 'Governed by the Friedmann-Lemaître-Robertson-Walker metric. Expanding at accelerated rates driven by Dark Energy.',
      visual: 'cosmic-web'
    },
    {
      id: 'solar-system',
      name: 'Solar System',
      category: 'planetary',
      classification: 'STELLAR SYSTEM',
      desc: 'Our local stellar system centered around the G-type main sequence star (the Sun), hosting 8 primary planets, dwarf worlds, and cometary reservoirs.',
      fact: 'Over 99.86% of the solar system\'s total mass is concentrated inside the Sun.',
      science: 'Bound by Keplerian mechanics. Planetary orbits are near-circular ellipses aligned with the ecliptic plane.',
      visual: 'solar-orbits'
    },
    {
      id: 'planets',
      name: 'Planetary Bodies',
      category: 'planetary',
      classification: 'PLANETARY SCIENCE',
      desc: 'Large spherical bodies orbiting stars that have cleared their orbital neighborhoods of debris (terrestrial rocks or gaseous giants).',
      fact: 'Jupiter is so massive that it does not orbit the exact center of the Sun, but rather their common barycenter just outside the Sun\'s surface.',
      science: 'Categorized into Terrestrial (silicate crusts, iron cores) and Gas/Ice Giants (hydrogen, helium, and methane Slush).',
      visual: 'planet-globe'
    },
    {
      id: 'moons',
      name: 'Natural Satellites (Moons)',
      category: 'planetary',
      classification: 'PLANETARY SCIENCE',
      desc: 'Celestial bodies orbiting planets or minor worlds. Ranging from volcanic bodies like Io to subsurface ocean worlds like Europa and Titan.',
      fact: 'Saturn\'s moon Titan has a thick atmosphere and liquid methane lakes on its surface.',
      science: 'Held in tidally locked orbits by gravitational friction. Subject to tidal heating dynamics.',
      visual: 'moon-loop'
    },
    {
      id: 'stars',
      name: 'Stellar Bodies (Stars)',
      category: 'stellar',
      classification: 'STELLAR PHYSICS',
      desc: 'Luminous spheres of plasma held together by self-gravity, generating core heat via nuclear fusion (Hydrogen to Helium and heavier elements).',
      fact: 'A pinhead of core material from a star would kill a human from 150 miles away due to heat radiation.',
      science: 'Balanced by hydrostatic equilibrium between inward gravity pull and outward thermal fusion pressure.',
      visual: 'star-surface'
    },
    {
      id: 'galaxies',
      name: 'Galactic Formations',
      category: 'cosmology',
      classification: 'COSMIC SYSTEM',
      desc: 'Gravitationally bound systems of stars, stellar remnants, interstellar gas, dust, and dark matter halos.',
      fact: 'The Milky Way and Andromeda galaxies will merge in 4.5 billion years to form a giant elliptical galaxy (Milkomeda).',
      science: 'Morphologies classified into spiral, elliptical, and irregular shapes via the Hubble Sequence.',
      visual: 'galaxy-particles'
    },
    {
      id: 'nebulae',
      name: 'Interstellar Nebulae',
      category: 'stellar',
      classification: 'STELLAR PHYSICS',
      desc: 'Giant molecular clouds of gas and dust. They serve as stellar nurseries where collapsing gas clumps ignite new stars.',
      fact: 'The Pillars of Creation inside the Eagle Nebula are columns of cool hydrogen gas spanning 4 light-years.',
      science: 'Composed of 90% hydrogen, 10% helium, and trace ionized elements illuminated by embedded newborn stars.',
      visual: 'nebula-cloud'
    },
    {
      id: 'black-holes',
      name: 'Black Holes',
      category: 'cosmology',
      classification: 'COSMIC SYSTEM',
      desc: 'Regions of spacetime where gravity is so strong that nothing—not even light—can escape. Bounded by an event horizon.',
      fact: 'If you fell into a black hole, gravity would stretch your body like spaghetti, a process called spaghettification.',
      science: 'Described by Schwarzschild or Kerr metrics. Emit Hawking Radiation due to quantum virtual particle separations.',
      visual: 'black-hole-lens'
    },
    {
      id: 'exoplanets',
      name: 'Exoplanetary Worlds',
      category: 'planetary',
      classification: 'PLANETARY SCIENCE',
      desc: 'Planets orbiting stars outside our Solar System. Cataloged by Transit and Radial Velocity surveys.',
      fact: 'Kepler-186f was the first validated Earth-size planet orbiting within its star\'s habitable zone.',
      science: 'Spectroscopy searches exoplanet atmospheres for biosignature gases (water vapor, methane, ozone).',
      visual: 'exoplanet-globe'
    },
    {
      id: 'dark-matter',
      name: 'Dark Matter',
      category: 'cosmology',
      classification: 'COSMIC SYSTEM',
      desc: 'Invisible matter that does not interact with light or electromagnetism. Inferred through galactic rotation curves.',
      fact: 'Dark matter outweighs normal baryonic matter (stars, planets) by a ratio of 5 to 1.',
      science: 'Thought to consist of Weakly Interacting Massive Particles (WIMPs) or Axions forming a cosmic web web scaffolding.',
      visual: 'spacetime-grid'
    },
    {
      id: 'dark-energy',
      name: 'Dark Energy',
      category: 'cosmology',
      classification: 'COSMIC SYSTEM',
      desc: 'A mysterious force causing the expansion of the universe to accelerate, counteracting gravity on cosmic scales.',
      fact: 'Dark energy makes up approximately 68% of the total mass-energy density of the universe.',
      science: 'Hypothesized as the Cosmological Constant (Lambda) representing the vacuum energy of space.',
      visual: 'expanding-grid'
    },
    {
      id: 'constellations',
      name: 'Constellations',
      category: 'cosmology',
      classification: 'COSMIC SYSTEM',
      desc: 'Recognizable patterns of stars mapped on the celestial sphere, historically used for navigation.',
      fact: 'Orion contains Rigel (blue supergiant) and Betelgeuse (red supergiant) at opposite stages of stellar life.',
      science: 'Apparent groupings only; stars are at widely varying physical distances from Earth.',
      visual: 'constellation-map'
    },
    {
      id: 'spacecraft',
      name: 'Orbital Spacecraft',
      category: 'fleet',
      classification: 'FLEET OPERATIONS',
      desc: 'Human-engineered vehicles built for space exploration, ranging from low-orbit space stations to deep space probes.',
      fact: 'The ISS orbits Earth every 90 minutes, experiencing 16 sunrises and sunsets every day.',
      science: 'Must operate in microgravity, requiring solar arrays, control gyroscopes, and thermal radiators.',
      visual: 'spacecraft-blueprint'
    },
    {
      id: 'rockets',
      name: 'Rocket Propulsion Systems',
      category: 'fleet',
      classification: 'FLEET OPERATIONS',
      desc: 'Vehicles powered by chemical reaction thrusters that accelerate dry mass payload past orbit velocity.',
      fact: 'The Saturn V rocket consumed 15 tons of fuel per second during its first stage ascent.',
      science: 'Driven by Newton\'s Third Law. Must generate thrust exceeding gravitational force using liquid oxygen (LOX) oxidizers.',
      visual: 'rocket-engine'
    },
    {
      id: 'astronauts',
      name: 'Space Crew (Astronauts)',
      category: 'figures',
      classification: 'HISTORICAL FIGURES',
      desc: 'Personnel trained to command, pilot, or serve as crew members on space missions, executing EVAs and microgravity science.',
      fact: 'Astronauts grow up to 2 inches taller in space due to spinal decompression in zero gravity.',
      science: 'Subject to muscle atrophy and bone density loss, requiring intensive countermeasure exercise routines.',
      visual: 'emblem-visual'
    },
    {
      id: 'scientists',
      name: 'Astrophysicists & Scientists',
      category: 'figures',
      classification: 'HISTORICAL FIGURES',
      desc: 'Theorists and observers who formulate mathematical models describing cosmic evolution.',
      fact: 'Stephen Hawking solved black hole thermodynamics using equations that combined quantum mechanics and gravity.',
      science: 'Utilize peer-reviewed physical proofs (e.g. Einstein\'s field equations).',
      visual: 'emblem-visual'
    },
    {
      id: 'agencies',
      name: 'Space Agencies',
      category: 'fleet',
      classification: 'FLEET OPERATIONS',
      desc: 'Governmental and commercial organizations (NASA, ESA, Roscosmos, SpaceX) directing spaceflight programs.',
      fact: 'SpaceX is the first private agency to build reusable orbital boosters that land vertically.',
      science: 'Coordinate launch ranges, tracking networks, and deep space communication antennas.',
      visual: 'agency-crest'
    },
    {
      id: 'missions',
      name: 'Space Missions',
      category: 'fleet',
      classification: 'FLEET OPERATIONS',
      desc: 'Specific campaign launches (Apollo, Voyager, Artemis) sent to collect data or establish human presence.',
      fact: 'Voyager 1 carries a Golden Record containing greetings from Earth for any extraterrestrial life.',
      science: 'Missions require precise trajectory planning (Hohmann Transfer orbits) and telemetry links.',
      visual: 'launch-path'
    },
    {
      id: 'discoveries',
      name: 'Scientific Discoveries',
      category: 'cosmology',
      classification: 'COSMIC SYSTEM',
      desc: 'Major breakthroughs (e.g. CMB radiation, gravitational waves) confirming cosmological theories.',
      fact: 'Gravitational waves were first detected in 2015, caused by two merging black holes 1.3 billion light-years away.',
      science: 'Laser interferometers (LIGO) measure fractional space stretches smaller than a proton.',
      visual: 'spectrum-bars'
    },
    {
      id: 'future-missions',
      name: 'Future Space Explorations',
      category: 'fleet',
      classification: 'FLEET OPERATIONS',
      desc: 'Proposed campaigns (Artemis Lunar Gateway, crewed Mars landings) slated to expand human presence.',
      fact: 'NASA\'s Gateway will be the first space station to orbit the Moon, acting as a deep space staging port.',
      science: 'Requires radiation shielding and closed-loop environmental life support systems (ECLSS).',
      visual: 'orbital-transfer'
    }
  ];

  const [selectedArticle, setSelectedArticle] = useState(articles[0]);
  const canvasRef = useRef(null);

  // 1. Interactive Canvas Render Loop (renders vector geometries matching article visual)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth || 300;
      canvas.height = parent.clientHeight || 240;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      time += 0.03;

      const visual = selectedArticle.visual;

      if (visual === 'cosmic-web') {
        // COSMIC WEB NODES
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        const nodes = [];
        for (let i = 0; i < 15; i++) {
          nodes.push({
            x: cx + Math.sin(i * 1.5 + time * 0.4) * 60,
            y: cy + Math.cos(i * 0.8 + time * 0.2) * 50
          });
        }
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < 65) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.fillStyle = '#00f0ff';
        nodes.forEach(n => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (visual === 'solar-orbits') {
        // SOLAR CONCENTRIC ORBITS
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        for (let r = 25; r <= 75; r += 25) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = '#ffca28'; // Sun
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Planet
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(time) * 50, cy + Math.sin(time) * 50, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (visual === 'planet-globe' || visual === 'exoplanet-globe') {
        // ROTATING PLANET GLOBE
        const grad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, 45);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, selectedArticle.id === 'exoplanets' ? '#cf5cff' : '#00f0ff');
        grad.addColorStop(1, '#020b14');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.fill();
        // Rings
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 65, 12, -Math.PI / 12, 0, Math.PI * 2);
        ctx.stroke();
      } else if (visual === 'moon-loop') {
        // MOON LOOPING ORBITS
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(time * 1.5) * 45, cy + Math.sin(time * 1.5) * 45, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (visual === 'star-surface') {
        // ENERGETIC STAR GLOW
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#ff7043');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
        ctx.fill();
      } else if (visual === 'nebula-cloud') {
        // GAS NEBULA RADIAL CLOUD
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
        grad.addColorStop(0, 'rgba(207, 92, 255, 0.15)');
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.08)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fill();
      } else if (visual === 'black-hole-lens') {
        // BLACK HOLE EVENT HORIZON LENS
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.fill();
      } else if (visual === 'spacecraft-blueprint' || visual === 'rocket-engine') {
        // BLUEPRINT SCHEMATIC GRID
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 40, cy - 30, 80, 60);
        ctx.beginPath();
        ctx.moveTo(cx - 60, cy); ctx.lineTo(cx + 60, cy);
        ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy + 50);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.fillRect(cx - 40, cy - 30, 80, 60);
      } else if (visual === 'constellation-map') {
        // CONSTELLATION DOT CONNECTIONS
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy - 30);
        ctx.lineTo(cx + 30, cy - 20);
        ctx.lineTo(cx + 10, cy + 30);
        ctx.lineTo(cx - 20, cy + 20);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#fff';
        [
          { x: cx - 30, y: cy - 30 },
          { x: cx + 30, y: cy - 20 },
          { x: cx + 10, y: cy + 30 },
          { x: cx - 20, y: cy + 20 }
        ].forEach(pt => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // DEFAULT EMBLEM RADAR
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 55, 0, Math.PI * 2);
        ctx.stroke();

        const angle = time % (Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 55, cy + Math.sin(angle) * 55);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [selectedArticle]);

  const handleArticleClick = (art) => {
    spaceSounds.playPlanetSelect();
    setSelectedArticle(art);
  };

  const handleCategoryFilter = (cat) => {
    spaceSounds.playClick();
    setSelectedCategory(cat);
  };

  // Filter logic
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Sub tabs navigation */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p className="font-data-label" style={{ color: 'var(--primary-container)', marginBottom: '8px' }}>STELLAR ARCHIVES DATABASE</p>
          <h1 className="font-headline-lg" style={{ fontSize: '42px', margin: 0 }}>Stellar Archives</h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['encyclopedia', 'galaxies', 'evolution', 'sandbox'].map(tab => (
            <button
              key={tab}
              onClick={() => { spaceSounds.playClick(); setActiveTab(tab); }}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.01)',
                border: activeTab === tab ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.05)',
                color: activeTab === tab ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-data)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {tab === 'encyclopedia' ? 'Encyclopedia Node' : tab === 'evolution' ? 'Stellar Evolution' : tab === 'sandbox' ? 'Black Hole Sandbox' : 'Galaxies classification'}
            </button>
          ))}
        </div>
      </header>

      {/* RENDER MODE A: Encyclopedia Node */}
      {activeTab === 'encyclopedia' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Search bar and Category filter HUD */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text"
                placeholder="Search cosmic index (e.g. dark matter, stars, exoplanets)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(5, 20, 36, 0.75)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Category chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }} className="no-scrollbar">
              {[
                { id: 'all', label: 'All Fields' },
                { id: 'cosmology', label: 'Cosmology' },
                { id: 'stellar', label: 'Stellar Physics' },
                { id: 'planetary', label: 'Planetary Science' },
                { id: 'fleet', label: 'Fleet Operations' },
                { id: 'figures', label: 'Historical Figures' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryFilter(cat.id)}
                  style={{
                    padding: '6px 14px',
                    background: selectedCategory === cat.id ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.01)',
                    border: selectedCategory === cat.id ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.05)',
                    color: selectedCategory === cat.id ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                    cursor: 'pointer',
                    borderRadius: '24px',
                    fontFamily: 'var(--font-data)',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List and Viewport Split Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 8.5fr', gap: 'var(--gutter)' }} className="hud-grid">
            
            {/* Search results list */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', height: '480px', overflowY: 'auto' }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
                MATCHING ARTICLES INDEX ({filteredArticles.length})
              </span>
              {filteredArticles.map(art => (
                <button
                  key={art.id}
                  onClick={() => handleArticleClick(art)}
                  className="comms-history-btn"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: selectedArticle.id === art.id ? '1px solid var(--primary-container)' : '1px solid transparent',
                    background: selectedArticle.id === art.id ? 'rgba(0,240,255,0.06)' : 'transparent',
                    color: selectedArticle.id === art.id ? 'var(--primary-container)' : '#fff',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {art.name}
                </button>
              ))}
            </div>

            {/* Selected Article Dossier details */}
            <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 'var(--gutter)' }} className="hud-grid">
              
              {/* Left Column: Visual canvas */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '480px' }}>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold', marginBottom: '16px' }}>
                  HOLOGRAPHIC VECTOR PROJECTION
                </span>
                <div style={{ flex: 1, border: '1px dashed rgba(0, 240, 255, 0.12)', borderRadius: '8px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                  <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
                </div>
              </div>

              {/* Right Column: Text scientific data */}
              <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', height: '480px', overflowY: 'auto' }}>
                <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff' }}>
                    {selectedArticle.name}
                  </h3>
                  <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-data)', textTransform: 'uppercase' }}>
                    {selectedArticle.classification}
                  </span>
                </header>

                <p style={{ margin: 0, fontSize: '13px', lineHeight: '22px', color: 'var(--on-surface-variant)' }}>
                  {selectedArticle.desc}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', fontSize: '12px', lineHeight: '18px', color: 'var(--on-surface-variant)' }}>
                  <strong style={{ color: '#fff', fontSize: '11px', display: 'block', marginBottom: '4px' }}>SCIENTIFIC EXPLANATION:</strong>
                  {selectedArticle.science}
                </div>

                <div style={{ background: 'rgba(0,240,255,0.02)', border: '1px solid rgba(0,240,255,0.08)', borderRadius: '8px', padding: '16px', fontSize: '12px', lineHeight: '18px', color: '#fff' }}>
                  <strong style={{ color: 'var(--primary-container)', fontSize: '10px', display: 'block', marginBottom: '4px', fontFamily: 'var(--font-data)' }}>INTERESTING FACT:</strong>
                  "{selectedArticle.fact}"
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* RENDER MODE B: Galaxies taxonomy */}
      {activeTab === 'galaxies' && (
        <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 8.5fr', gap: 'var(--gutter)' }} className="hud-grid">
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--on-surface-variant)', marginBottom: '10px' }}>DEEP SPACE SATELLITE CATALOG</span>
            <button className="comms-history-btn" style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--primary-container)', background: 'rgba(0,240,255,0.06)', color: 'var(--primary-container)' }}>Milky Way Galaxy</button>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '520px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff' }}>Milky Way Galaxy</h3>
                <span className="status-chip active" style={{ fontSize: '9px' }}>Barred Spiral (SBbc)</span>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--on-surface-variant)', lineHeight: '20px' }}>
                Our home galaxy, a barred spiral structure spanning 100,000 light-years.
              </p>
            </div>

            <div style={{ flex: 1, border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
              <Galaxy3D galaxyName="Milky Way" arms={4} colorAccent="cyan" />
            </div>
          </div>
        </div>
      )}

      {/* RENDER MODE C: Stellar evolution */}
      {activeTab === 'evolution' && (
        <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 8.5fr', gap: 'var(--gutter)' }} className="hud-grid">
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold', marginBottom: '10px' }}>STELLAR STEPS</span>
            <button className="comms-history-btn" style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--primary-container)', background: 'rgba(0,240,255,0.06)', color: 'var(--primary-container)' }}>Main Sequence (Sun-like)</button>
          </div>

          <div className="hud-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 'var(--gutter)' }}>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ flex: 1, border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden', minHeight: '280px' }}>
                <Star3D star={{ id: 'main-sequence', name: 'Main Sequence', color: '#ffe082', glowColor: 'rgba(255, 224, 130, 0.4)', fusionShells: [{ element: 'Hydrogen' }] }} viewMode="surface" />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff' }}>Main Sequence</h3>
              </header>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '20px', color: 'var(--on-surface-variant)' }}>
                The longest and most stable phase of a star\'s life.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER MODE D: Black Hole sandbox */}
      {activeTab === 'sandbox' && (
        <div className="glass-panel" style={{ height: '520px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <BlackHoleSimulator />
        </div>
      )}

      <style>{`
        .comms-history-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 8px 12px;
          text-align: left;
          color: var(--on-surface-variant);
          font-family: var(--font-body);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .comms-history-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
      `}</style>
    </section>
  );
};

export default ArchivesView;
