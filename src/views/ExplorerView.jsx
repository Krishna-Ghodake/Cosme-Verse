// ExplorerView.jsx - Solar System Planet Explorer & Multi-Scale Simulator
import React, { useState, useEffect, useRef } from 'react';
import { planets } from '../data/planets';
import spaceSounds from '../components/SoundManager';
import Planet3D from '../components/Planet3D';
import SolarSystem3D from '../components/SolarSystem3D';
import PlanetCore3D from '../components/PlanetCore3D';
import Galaxy3D from '../components/Galaxy3D';
import MoonOrbit3D from '../components/MoonOrbit3D';

const ExplorerView = () => {
  const [universeScale, setUniverseScale] = useState('orbital'); // galactic, orbital, core
  const [selectedPlanet, setSelectedPlanet] = useState(planets[2]); // Default Earth
  const [activeDetailTab, setActiveDetailTab] = useState('telemetry');
  
  // Comparison deck states
  const [compareMode, setCompareMode] = useState(false);
  const [compPlanet1, setCompPlanet1] = useState(planets[2]); // Default Earth
  const [compPlanet2, setCompPlanet2] = useState(planets[3]); // Default Mars
  
  // Toggle views for comparison columns
  const [comp1View, setComp1View] = useState('surface'); // surface, core, moons
  const [comp2View, setComp2View] = useState('surface');

  const handlePlanetSelectFromOrbit = (planet) => {
    setSelectedPlanet(planet);
    setActiveDetailTab('telemetry');
  };

  const handleScaleChange = (scale) => {
    spaceSounds.playTransition();
    setUniverseScale(scale);
    setCompareMode(false);
  };

  const handleCompareClick = () => {
    spaceSounds.playAchievement();
    setCompareMode(true);
  };

  const getNumericValue = (valStr) => {
    return parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
  };

  return (
    <section style={{ animation: 'fadeIn 0.5s ease-out', position: 'relative', minHeight: '620px' }}>
      
      {/* Universal Scale Selection HUD (Fixed left vertical sidebar) */}
      {!compareMode && (
        <div 
          className="scale-hud-sidebar"
          style={{
            position: 'absolute',
            left: '-64px',
            top: '40px',
            width: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px 0',
            alignItems: 'center',
            zIndex: 90
          }}
        >
          {[
            { id: 'galactic', label: 'G', title: 'Galactic Scale' },
            { id: 'orbital', label: 'S', title: 'Solar System Scale' },
            { id: 'core', label: 'C', title: 'Geological Core Scale' }
          ].map(scale => {
            const isActive = universeScale === scale.id;
            return (
              <button
                key={scale.id}
                onClick={() => handleScaleChange(scale.id)}
                onMouseEnter={() => spaceSounds.playHover()}
                className={`btn-ghost ${isActive ? 'active' : ''}`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: isActive ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0,0,0,0.4)',
                  borderColor: isActive ? 'var(--primary-container)' : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer'
                }}
                title={scale.title}
              >
                {scale.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 1. Header controls */}
      {!compareMode && (
        <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <p className="font-data-label" style={{ color: 'var(--primary-container)', marginBottom: '6px', textTransform: 'uppercase' }}>
              UNIVERSAL SCALE EXPLORER • {universeScale === 'orbital' ? 'SOLAR SYSTEM' : universeScale.toUpperCase()} LEVEL
            </p>
            <h1 className="font-display-xl" style={{ fontSize: '38px', margin: 0 }}>
              {universeScale === 'galactic' && 'Milky Way Galaxy'}
              {universeScale === 'orbital' && '3D Solar System & Globe'}
              {universeScale === 'core' && 'Stratigraphical Core Wedge'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleCompareClick} 
              onMouseEnter={() => spaceSounds.playHover()}
              className="btn-ghost" 
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)' }}
            >
              Compare Decks
            </button>
          </div>
        </header>
      )}

      {/* 2. Unified Split-Screen Layout */}
      {!compareMode && (
        <div 
          className="hud-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '6.5fr 5.5fr', 
            gap: 'var(--gutter)', 
            minHeight: '560px' 
          }}
        >
          
          {/* LEFT PANEL: Macro Space Structures (Galaxy or 3D Solar System Map) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--primary-container)', fontWeight: 'bold' }}>
                {universeScale === 'galactic' ? 'MILKY WAY SYSTEM • GALAXY PARTICLES' : '3D SOLAR SYSTEM ORBITS (DRAG TO ROTATE)'}
              </span>
            </div>
            <div style={{ flex: 1, minHeight: '440px', position: 'relative' }}>
              {universeScale === 'galactic' ? (
                <Galaxy3D galaxyName="Milky Way" arms={4} colorAccent="cyan" />
              ) : (
                <SolarSystem3D onSelectPlanet={handlePlanetSelectFromOrbit} />
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Details, Active 3D Globe, Core Wedge, and Stats */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            
            {universeScale === 'galactic' ? (
              /* Galaxy Details */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff' }}>Milky Way Galaxy</h3>
                <span className="status-chip active" style={{ alignSelf: 'flex-start' }}>Barred Spiral (SBbc)</span>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '22px', color: 'var(--on-surface-variant)' }}>
                  Our home galaxy, a barred spiral structure spanning 100,000 light-years. It contains up to 400 billion stars orbiting Sagittarius A*, a supermassive black hole singularity.
                </p>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong style={{ color: 'var(--primary-fixed-dim)' }}>DIAMETER:</strong> 100,000 Light Years</div>
                  <div><strong style={{ color: 'var(--primary-fixed-dim)' }}>SINGULARITY CORE:</strong> Sagittarius A*</div>
                  <div><strong style={{ color: 'var(--primary-fixed-dim)' }}>STELLAR BODY COUNT:</strong> ~400 Billion Stars</div>
                </div>
              </div>
            ) : universeScale === 'core' ? (
              /* Core geological wedge view */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <div style={{ height: '240px', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                  <PlanetCore3D planet={selectedPlanet} />
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff' }}>
                    {selectedPlanet.name} Stratigraphy
                  </h3>
                  <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-data)' }}>
                    CORE DISSOLVE SPECS
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    {selectedPlanet.interior.map((layer, idx) => (
                      <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{layer.name}</strong>
                          <div style={{ color: 'var(--on-surface-variant)', marginTop: '2px' }}>{layer.composition}</div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>{layer.thickness}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Planetary details & 3D Planet sphere model */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* 3D Sphere Renderer */}
                <div style={{ height: '200px', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                  <Planet3D planet={selectedPlanet} />
                </div>

                {/* Info and tabs */}
                <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff' }}>{selectedPlanet.name}</h3>
                    <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-data)' }}>{selectedPlanet.classification} • SUN CO-ORBIT: {selectedPlanet.distanceFromSun}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['telemetry', 'structure', 'history', 'ai-insights'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => { spaceSounds.playClick(); setActiveDetailTab(tab); }}
                      style={{
                        padding: '6px 12px',
                        background: activeDetailTab === tab ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.01)',
                        border: activeDetailTab === tab ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.04)',
                        color: activeDetailTab === tab ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-data)',
                        fontSize: '10px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div style={{ flex: 1, minHeight: '160px' }}>
                  {activeDetailTab === 'telemetry' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        <div className="glass-panel" style={{ padding: '10px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', marginBottom: '2px' }}>MASS</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedPlanet.mass}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '10px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', marginBottom: '2px' }}>DIAMETER</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedPlanet.diameter}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '10px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', marginBottom: '2px' }}>GRAVITY</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedPlanet.gravity}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '10px 12px' }}>
                          <div style={{ fontFamily: 'var(--font-data)', fontSize: '8px', color: 'var(--on-surface-variant)', marginBottom: '2px' }}>MOONS</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedPlanet.moons}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === 'structure' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div><strong style={{ color: 'var(--primary-container)' }}>ATMOSPHERE: </strong>{selectedPlanet.details.atmosphere}</div>
                      <div><strong style={{ color: 'var(--primary-container)' }}>SURFACE: </strong>{selectedPlanet.details.surface}</div>
                      <div><strong style={{ color: 'var(--primary-container)' }}>TEMP RANGE: </strong>{selectedPlanet.details.tempRange}</div>
                    </div>
                  )}

                  {activeDetailTab === 'history' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', lineHeight: '18px' }}>
                      <div><strong>DISCOVERY HISTORY:</strong><p style={{ margin: '2px 0 0 0', color: 'var(--on-surface-variant)' }}>{selectedPlanet.discoveryHistory}</p></div>
                    </div>
                  )}

                  {activeDetailTab === 'ai-insights' && (
                    <p style={{ margin: 0, fontSize: '12px', lineHeight: '20px', color: 'var(--on-surface-variant)' }}>{selectedPlanet.aiAnomalies}</p>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* 3. Interactive Comparison Deck Dashboard */}
      {compareMode && (
        <div className="glass-panel" style={{ padding: '24px 32px', minHeight: '520px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease-out' }}>
          
          <header style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--primary-fixed)' }}>
                Planet Comparison Deck
              </h1>
              <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                Compare core features, interior layers, and moon systems of planets side-by-side.
              </span>
            </div>
            <button 
              onClick={() => { spaceSounds.playClick(); setCompareMode(false); }}
              className="btn-secondary"
              style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}
            >
              EXIT COMPARISON
            </button>
          </header>

          <div 
            className="hud-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 'var(--gutter)' 
            }}
          >
            
            {/* COLUMN 1: Primary Planet */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--primary-container)', fontWeight: 'bold' }}>PRIMARY SPHERE</label>
                <select 
                  value={compPlanet1.id} 
                  onChange={(e) => { spaceSounds.playClick(); setCompPlanet1(planets.find(p => p.id === e.target.value)); }}
                  style={{
                    background: 'rgba(5, 20, 36, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '10px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {planets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* View Toggles for Column 1 */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['surface', 'core', 'moons'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => { spaceSounds.playClick(); setComp1View(mode); }}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      fontSize: '9px',
                      fontFamily: 'var(--font-data)',
                      textTransform: 'uppercase',
                      background: comp1View === mode ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                      border: comp1View === mode ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.05)',
                      color: comp1View === mode ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Display Viewport 1 */}
              <div style={{ height: '220px', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                {comp1View === 'surface' && <Planet3D planet={compPlanet1} />}
                {comp1View === 'core' && <PlanetCore3D planet={compPlanet1} />}
                {comp1View === 'moons' && <MoonOrbit3D planet={compPlanet1} />}
              </div>

              {/* Stats Dossier 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>MASS:</span> <strong style={{ color: '#fff' }}>{compPlanet1.mass} 10^24 kg</strong></div>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>GRAVITY:</span> <strong style={{ color: '#fff' }}>{compPlanet1.gravity}</strong></div>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>MOONS:</span> <strong style={{ color: '#fff' }}>{compPlanet1.moons}</strong></div>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>SURFACE:</span> <p style={{ margin: '2px 0 0 0', color: 'var(--on-surface-variant)', fontSize: '11px', lineHeight: '16px' }}>{compPlanet1.details.surface}</p></div>
              </div>
            </div>

            {/* COLUMN 2: Secondary Planet */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontFamily: 'var(--font-data)', fontSize: '10px', color: 'var(--primary-container)', fontWeight: 'bold' }}>SECONDARY SPHERE</label>
                <select 
                  value={compPlanet2.id} 
                  onChange={(e) => { spaceSounds.playClick(); setCompPlanet2(planets.find(p => p.id === e.target.value)); }}
                  style={{
                    background: 'rgba(5, 20, 36, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '10px',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {planets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* View Toggles for Column 2 */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['surface', 'core', 'moons'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => { spaceSounds.playClick(); setComp2View(mode); }}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      fontSize: '9px',
                      fontFamily: 'var(--font-data)',
                      textTransform: 'uppercase',
                      background: comp2View === mode ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                      border: comp2View === mode ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.05)',
                      color: comp2View === mode ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Display Viewport 2 */}
              <div style={{ height: '220px', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '8px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                {comp2View === 'surface' && <Planet3D planet={compPlanet2} />}
                {comp2View === 'core' && <PlanetCore3D planet={compPlanet2} />}
                {comp2View === 'moons' && <MoonOrbit3D planet={compPlanet2} />}
              </div>

              {/* Stats Dossier 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>MASS:</span> <strong style={{ color: '#fff' }}>{compPlanet2.mass} 10^24 kg</strong></div>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>GRAVITY:</span> <strong style={{ color: '#fff' }}>{compPlanet2.gravity}</strong></div>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>MOONS:</span> <strong style={{ color: '#fff' }}>{compPlanet2.moons}</strong></div>
                <div><span style={{ color: 'var(--on-surface-variant)' }}>SURFACE:</span> <p style={{ margin: '2px 0 0 0', color: 'var(--on-surface-variant)', fontSize: '11px', lineHeight: '16px' }}>{compPlanet2.details.surface}</p></div>
              </div>
            </div>

          </div>

        </div>
      )}

      <style>{`
        .scale-hud-sidebar {
          position: absolute;
          left: -64px;
          top: 40px;
          width: 48px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px 0;
          align-items: center;
          z-index: 90;
        }
        @media (max-width: 1024px) {
          .scale-hud-sidebar {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            flex-direction: row !important;
            justify-content: center !important;
            padding: 8px !important;
            margin-bottom: 20px !important;
          }
          .hud-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ExplorerView;
