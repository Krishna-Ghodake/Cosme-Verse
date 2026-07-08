// TimelineView.jsx - Space Knowledge Base & Interactive Chronological Timeline
import React, { useState, useEffect, useRef } from 'react';
import spaceSounds from '../components/SoundManager';
import { timelineEvents } from '../data/timeline';

const TimelineView = () => {
  // Profiles database
  const profiles = {
    astronauts: [
      {
        id: 'armstrong',
        name: 'Neil Armstrong',
        role: 'Apollo 11 Commander',
        bio: 'First human to walk on the Moon. A decorated Naval Aviator and aerospace engineer, he commanded Apollo 11, landing the Lunar Module Eagle on the Sea of Tranquility on July 20, 1969.',
        quote: "That's one small step for a man, one giant leap for mankind.",
        missions: 'Gemini 8, Apollo 11',
        awards: 'Congressional Space Medal of Honor, Presidential Medal of Freedom',
        timeline: [
          { year: '1962', event: 'Selected for NASA Astronaut Group 2' },
          { year: '1966', event: 'Commanded Gemini 8, performing first orbital docking' },
          { year: '1969', event: 'First human to set foot on the lunar surface' }
        ],
        visualType: 'moon-orbit'
      },
      {
        id: 'whitson',
        name: 'Peggy Whitson',
        role: 'NASA Chief Astronaut',
        bio: 'Holder of the record for most cumulative time in space of any NASA astronaut (675 days). She was the first female commander of the ISS and commanded the Axiom-2 commercial mission.',
        quote: "You have to work hard at what you want to achieve, but it's worth it.",
        missions: 'Expedition 5, 16, 50/51/52, Axiom-2',
        awards: 'NASA Distinguished Service Medal, space flight badges',
        timeline: [
          { year: '1996', event: 'Selected as astronaut candidate' },
          { year: '2007', event: 'First female commander of the International Space Station' },
          { year: '2023', event: 'Commanded commercial mission Axiom-2' }
        ],
        visualType: 'iss-orbit'
      }
    ],
    scientists: [
      {
        id: 'einstein',
        name: 'Albert Einstein',
        role: 'Theoretical Physicist',
        bio: 'Developed the general theory of relativity, which describes gravity as the curvature of spacetime. His work forms the absolute foundation of modern relativistic astrophysics and cosmology.',
        quote: "The most incomprehensible thing about the universe is that it is comprehensible.",
        missions: 'Theory of Relativity, Cosmological Constant',
        awards: 'Nobel Prize in Physics (1921), Copley Medal',
        timeline: [
          { year: '1905', event: 'Published Special Relativity & Photoelectric effect' },
          { year: '1915', event: 'Formulated General Relativity field equations' },
          { year: '1921', event: 'Awarded Nobel Prize in Physics' }
        ],
        visualType: 'spacetime-grid'
      },
      {
        id: 'hawking',
        name: 'Stephen Hawking',
        role: 'Theoretical Cosmologist',
        bio: 'Discovered that black holes emit thermal radiation—now known as Hawking Radiation—due to quantum vacuum effects near the event horizon. Authored A Brief History of Time.',
        quote: "Remember to look up at the stars and not down at your feet.",
        missions: 'Black Hole Thermodynamics, Quantum Gravity',
        awards: 'Albert Einstein Award, Presidential Medal of Freedom',
        timeline: [
          { year: '1974', event: 'Discovered Hawking Radiation emission' },
          { year: '1983', event: 'Proposed Hartle-Hawking state of early universe' },
          { year: '1988', event: 'Published "A Brief History of Time"' }
        ],
        visualType: 'blackhole-radiation'
      }
    ],
    engineers: [
      {
        id: 'braun',
        name: 'Wernher von Braun',
        role: 'Chief Rocket Architect',
        bio: 'Architect of the Saturn V heavy-lift rocket launcher that enabled the Apollo Moon landings. Directed the Marshall Space Flight Center, pioneering liquid-fueled propulsion designs.',
        quote: "I have learned to use the word 'impossible' with the greatest caution.",
        missions: 'Explorer 1, Saturn V Rocket Program',
        awards: 'National Medal of Science, NASA Distinguished Service Medal',
        timeline: [
          { year: '1950', event: 'Directed Redstone rocket program development' },
          { year: '1958', event: 'Launched Explorer 1, first US satellite' },
          { year: '1969', event: 'Saturn V rocket successfully launches Apollo 11' }
        ],
        visualType: 'saturn-rocket'
      },
      {
        id: 'johnson',
        name: 'Kelly Johnson',
        role: 'Lockheed Skunk Works Founder',
        bio: 'Legendary aerospace engineer who designed the U-2, SR-71 Blackbird spy planes, and early rocket fuselage profiles. Pioneered the KISS principle ("Keep It Simple, Stupid").',
        quote: "Keep it simple, stupid. That is the secret of good engineering.",
        missions: 'Agena rocket stage, SR-71 Blackbird',
        awards: 'Presidential Medal of Freedom, Collier Trophy',
        timeline: [
          { year: '1943', event: 'Founded Lockheed Skunk Works division' },
          { year: '1964', event: 'Designed and tested titanium-skin Mach 3 SR-71' },
          { year: '1975', event: 'Contributed to early space shuttle shuttle wing tests' }
        ],
        visualType: 'aerospace-vectors'
      }
    ],
    directors: [
      {
        id: 'kranz',
        name: 'Gene Kranz',
        role: 'Apollo Flight Director',
        bio: 'NASA Lead Flight Director during Gemini and Apollo missions. Famous for directing the Apollo 13 control room mission recovery and his white flight vests.',
        quote: "Failure is not an option. We are not leaving them out there.",
        missions: 'Gemini missions, Apollo 11, Apollo 13 Recovery',
        awards: 'Presidential Medal of Freedom, NASA Distinguished Service Medal',
        timeline: [
          { year: '1960', event: 'Joined Space Task Group at Langley' },
          { year: '1969', event: 'Flight Director during Apollo 11 lunar landing' },
          { year: '1970', event: 'Led Mission Control crew recovery of Apollo 13' }
        ],
        visualType: 'flight-radar'
      }
    ]
  };

  const [activeCategory, setActiveCategory] = useState('astronauts');
  const [selectedProfile, setSelectedProfile] = useState(profiles.astronauts[0]);
  const [activeProfileTab, setActiveProfileTab] = useState('bio');

  const canvasRef = useRef(null);

  // 1. Profile visualizer 3D-like animation loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const drawVisual = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      time += 0.035;

      const type = selectedProfile.visualType;

      if (type === 'spacetime-grid') {
        // CURVED SPACETIME GRID (Albert Einstein)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.lineWidth = 1;
        // Draw coordinate lines warped toward center
        for (let i = -100; i <= 100; i += 20) {
          ctx.beginPath();
          for (let y = -100; y <= 100; y += 5) {
            const dx = i;
            const dy = y;
            const dist = Math.hypot(dx, dy);
            const warp = Math.max(1, 100 / (dist + 8));
            const px = cx + dx * (1 + warp * 0.05);
            const py = cy + dy * (1 + warp * 0.05);
            if (y === -100) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else if (type === 'blackhole-radiation') {
        // HAWKING RADIATION CHANNELS (Stephen Hawking)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(207, 92, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.stroke();

        // Radiating particles
        ctx.fillStyle = 'cyan';
        for (let i = 0; i < 6; i++) {
          const angle = time + (i * Math.PI) / 3;
          const r = 38 + (time * 12) % 60;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'moon-orbit') {
        // EARTH-MOON ORBIT (Neil Armstrong)
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        ctx.arc(cx, cy, 75, 0, Math.PI * 2);
        ctx.stroke();

        // Earth
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();

        // Moon
        const mx = cx + Math.cos(time * 0.4) * 75;
        const my = cy + Math.sin(time * 0.4) * 75;
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'iss-orbit') {
        // ISS HELICAL ORBIT (Peggy Whitson)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
        ctx.stroke();

        // Station
        const sx = cx + Math.cos(time * 0.5) * 60;
        const sy = cy + Math.sin(time * 0.5) * 60;
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx - 6, sy - 2, 12, 4);
        ctx.fillStyle = '#cf5cff';
        ctx.fillRect(sx - 2, sy - 8, 4, 16);
      } else {
        // DEFAULT FLIGHT TELEMETRY (Braun/Johnson/Kranz)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        ctx.stroke();

        // Radar line sweep
        const radarAngle = time % (Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(radarAngle) * 70, cy + Math.sin(radarAngle) * 70);
        ctx.stroke();
      }

      animId = requestAnimationFrame(drawVisual);
    };

    drawVisual();
    return () => cancelAnimationFrame(animId);
  }, [selectedProfile]);

  const handleCategoryChange = (catKey) => {
    spaceSounds.playClick();
    setActiveCategory(catKey);
    setSelectedProfile(profiles[catKey][0]);
    setActiveProfileTab('bio');
  };

  const handleProfileSelect = (p) => {
    spaceSounds.playPlanetSelect();
    setSelectedProfile(p);
    setActiveProfileTab('bio');
  };

  // Chronology game alignment quiz states
  const [quizList, setQuizList] = useState(() => {
    const landmarks = timelineEvents.filter(e => 
      ['big-bang', 'galileo', 'sputnik', 'apollo'].includes(e.id)
    );
    return [...landmarks].sort(() => Math.random() - 0.5);
  });
  const [gameUnlocked, setGameUnlocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctAlignments, setCorrectAlignments] = useState(false);

  const moveItem = (index, direction) => {
    spaceSounds.playClick();
    const nextList = [...quizList];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= nextList.length) return;
    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    setQuizList(nextList);
    setShowResult(false);
  };

  const checkAlignment = () => {
    const correctOrder = ['big-bang', 'galileo', 'sputnik', 'apollo'];
    const currentOrder = quizList.map(item => item.id);
    const isCorrect = correctOrder.every((id, idx) => id === currentOrder[idx]);

    setShowResult(true);
    setCorrectAlignments(isCorrect);

    if (isCorrect) {
      spaceSounds.playAchievement();
      setGameUnlocked(true);
      window.dispatchEvent(new CustomEvent('unlock-achievement', {
        detail: {
          id: 'chronology-commander',
          title: 'Chronology Commander',
          desc: 'Successfully aligned the chronological landmarks of cosmic history!'
        }
      }));
    } else {
      spaceSounds.playHover();
    }
  };

  return (
    <section style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* 1. Header with Directory selectors */}
      <header style={{ marginBottom: '40px', display: 'flex', justify: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p className="font-data-label" style={{ color: 'var(--primary-container)', marginBottom: '8px' }}>COSMOS DIRECTORY & ARCHIVES</p>
          <h1 className="font-display-xl" style={{ fontSize: '46px', margin: 0 }}>Knowledge Base</h1>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['astronauts', 'scientists', 'engineers', 'directors'].map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '8px 16px',
                background: activeCategory === cat ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.01)',
                border: activeCategory === cat ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.05)',
                color: activeCategory === cat ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                cursor: 'pointer',
                borderRadius: '4px',
                fontFamily: 'var(--font-data)',
                fontSize: '10px',
                textTransform: 'uppercase'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Directory Explorer Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 8.5fr', gap: 'var(--gutter)', marginBottom: '48px' }} className="hud-grid">
        
        {/* Left Side: Directory Profiles list */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold', marginBottom: '10px' }}>PROFILES FEEDS</span>
          {profiles[activeCategory].map(p => (
            <button
              key={p.id}
              onClick={() => handleProfileSelect(p)}
              className="comms-history-btn"
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                border: selectedProfile.id === p.id ? '1px solid var(--primary-container)' : '1px solid transparent',
                background: selectedProfile.id === p.id ? 'rgba(0,240,255,0.06)' : 'transparent',
                color: selectedProfile.id === p.id ? 'var(--primary-container)' : '#fff',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {p.name}
            </button>
          ))}

          {/* 3D-like physics emblem projection at the bottom of the list */}
          <div style={{ flex: 1, border: '1px dashed rgba(0,240,255,0.1)', borderRadius: '8px', overflow: 'hidden', minHeight: '160px', marginTop: '16px', background: 'rgba(0,0,0,0.1)' }}>
            <canvas ref={canvasRef} width="190" height="160" />
          </div>
        </div>

        {/* Right Side: Profile Details Dossier */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '440px' }}>
          
          <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '28px', color: '#fff' }}>
              {selectedProfile.name}
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--primary-container)', fontFamily: 'var(--font-data)', textTransform: 'uppercase' }}>
              {selectedProfile.role}
            </span>
          </header>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['bio', 'timeline', 'achievements'].map(tab => (
              <button
                key={tab}
                onClick={() => { spaceSounds.playClick(); setActiveProfileTab(tab); }}
                style={{
                  padding: '6px 12px',
                  background: activeProfileTab === tab ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.01)',
                  border: activeProfileTab === tab ? '1px solid var(--primary-container)' : '1px solid rgba(255,255,255,0.05)',
                  color: activeProfileTab === tab ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-data)',
                  fontSize: '9px',
                  textTransform: 'uppercase'
                }}
              >
                {tab === 'bio' ? 'Biography & Quote' : tab === 'achievements' ? 'Achievements & Awards' : 'Personal Timeline'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, fontSize: '13px', lineHeight: '22px', color: 'var(--on-surface-variant)' }}>
            {activeProfileTab === 'bio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
                <p>{selectedProfile.bio}</p>
                <div style={{ borderLeft: '2.5px solid var(--primary-container)', paddingLeft: '14px', fontStyle: 'italic', color: '#fff', fontSize: '14px' }}>
                  "{selectedProfile.quote}"
                </div>
                <div style={{ marginTop: '12px' }}>
                  <strong>RELATED CAMPAIGNS/THEORIES:</strong> <span style={{ color: 'var(--primary-fixed-dim)' }}>{selectedProfile.missions}</span>
                </div>
              </div>
            )}

            {activeProfileTab === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
                {selectedProfile.timeline.map((item, idx) => (
                  <div key={idx} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', display: 'flex', gap: '16px' }}>
                    <strong style={{ color: 'var(--primary-container)', fontFamily: 'var(--font-data)', width: '60px' }}>{item.year}</strong>
                    <span>{item.event}</span>
                  </div>
                ))}
              </div>
            )}

            {activeProfileTab === 'achievements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
                <div>
                  <strong style={{ color: '#fff' }}>DECORATIONS & AWARDS:</strong>
                  <p style={{ marginTop: '4px' }}>{selectedProfile.awards}</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 3. Chronological Landmarks Ordering Quiz Deck (Integrated matching requirement) */}
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff', marginBottom: '8px' }}>
            Stellar Chronology Alignments
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', margin: 0 }}>
            Reorder the events chronologically from oldest (top) to newest (bottom).
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quizList.map((item, idx) => (
            <div 
              key={item.id} 
              className="glass-panel"
              style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-fixed-dim)', fontSize: '20px' }}>
                  {item.icon}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{item.title}</div>
                  <div style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--on-surface-variant)', marginTop: '2px' }}>{item.epoch}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  disabled={idx === 0} 
                  onClick={() => moveItem(idx, -1)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', width: '32px', height: '32px', borderRadius: '4px', color: idx === 0 ? 'rgba(255,255,255,0.1)' : '#fff', cursor: idx === 0 ? 'default' : 'pointer' }}
                  title="Move Up"
                >
                  ▲
                </button>
                <button 
                  disabled={idx === quizList.length - 1} 
                  onClick={() => moveItem(idx, 1)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', width: '32px', height: '32px', borderRadius: '4px', color: idx === quizList.length - 1 ? 'rgba(255,255,255,0.1)' : '#fff', cursor: idx === quizList.length - 1 ? 'default' : 'pointer' }}
                  title="Move Down"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
          <button 
            onClick={checkAlignment} 
            className="btn-primary" 
            style={{ padding: '12px 32px', borderRadius: 'var(--radius-sm)' }}
          >
            Submit Alignment
          </button>

          {showResult && (
            <div style={{ padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-data)', fontSize: '11px', textAlign: 'center', backgroundColor: correctAlignments ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', border: correctAlignments ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(231, 76, 60, 0.3)', color: correctAlignments ? '#2ecc71' : '#e74c3c' }}>
              {correctAlignments ? (
                <div>
                  <strong>ALIGNMENT CORRECT!</strong><br/>
                  🏆 Achievement Unlocked: Chronology Commander Badge
                </div>
              ) : (
                <div>
                  <strong>ALIGNMENT CRITICAL ERROR!</strong><br/>
                  Historical anomalies detected in vector layout. Reset coordinates and try again.
                </div>
              )}
            </div>
          )}

          {gameUnlocked && (
            <div style={{ color: 'var(--primary-container)', fontFamily: 'var(--font-data)', fontSize: '11px', textAlign: 'center' }}>
              🎖️ profile badge earned: "Chronology Commander" • synced to system logs
            </div>
          )}
        </div>
      </div>

    </section>
  );
};

export default TimelineView;
