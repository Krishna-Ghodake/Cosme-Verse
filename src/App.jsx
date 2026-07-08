// App.jsx - Main Application and Custom Router Entry
import React, { useState, useEffect, useRef } from 'react';
import StarfieldBackground from './components/StarfieldBackground';
import TopNavBar from './components/TopNavBar';
import spaceSounds from './components/SoundManager';

// Lazy-loaded Views
const HomeView = React.lazy(() => import('./views/HomeView'));
const DashboardView = React.lazy(() => import('./views/DashboardView'));
const ExplorerView = React.lazy(() => import('./views/ExplorerView'));
const MissionsView = React.lazy(() => import('./views/MissionsView'));
const ArchivesView = React.lazy(() => import('./views/ArchivesView'));
const TimelineView = React.lazy(() => import('./views/TimelineView'));
const AssistantView = React.lazy(() => import('./views/AssistantView'));
const SettingsView = React.lazy(() => import('./views/SettingsView'));

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);
  
  const [settings, setSettings] = useState({
    muted: true, // Default to muted for browser autoplay compliance
    volume: 0.5,
    ambience: true,
    particles: true,
    accent: 'cyan',
    soundCaptions: false,
    reducedMotion: false
  });

  // Achievements States
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  
  // Accessibility captions state
  const [activeCaption, setActiveCaption] = useState(null);

  useEffect(() => {
    let timeout;
    const handleSoundCaption = (e) => {
      if (settings.soundCaptions) {
        setActiveCaption(e.detail.text);
        clearTimeout(timeout);
        timeout = setTimeout(() => setActiveCaption(null), 1800);
      }
    };
    window.addEventListener('play-sound-caption', handleSoundCaption);
    return () => {
      window.removeEventListener('play-sound-caption', handleSoundCaption);
      clearTimeout(timeout);
    };
  }, [settings.soundCaptions]);

  // Custom Cursor States
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cinematic Loading Screen logic
  useEffect(() => {
    const logs = [
      'SECURE DEEP SPACE NETWORK LINK CONNECTED',
      'QUANTUM ENGINE SIMULATOR INITIALIZED',
      'ORBITAL TRAJECTORY GRAPHICS ALIGNED',
      'GRAVITATIONAL WAVE ANOMALIES CALIBRATED',
      'COSMICAL TIME EPOCHS SYNCHRONIZED',
      'COSMOSVERSE QUANTUM NODE READY'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 600);
      }
      setLoadingProgress(currentProgress);

      const logIndex = Math.min(
        Math.floor((currentProgress / 100) * logs.length),
        logs.length - 1
      );
      setDiagnosticLogs(prev => {
        if (!prev.includes(logs[logIndex])) {
          return [...prev, `[${new Date().toLocaleTimeString()}] INFO: ${logs[logIndex]}`].slice(-3);
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Custom Cursor setup
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      if (target && (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('select') || 
        target.closest('input') || 
        target.closest('textarea') ||
        target.closest('.comms-history-btn') ||
        target.closest('.scale-hud-sidebar button')
      )) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Spring animation trail for custom cursor outer ring
  useEffect(() => {
    if (isMobile || loading) return;
    
    let animId;
    const updateTrail = () => {
      setTrailPos(prev => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      animId = requestAnimationFrame(updateTrail);
    };
    animId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, isMobile, loading]);

  // Global achievement listener
  useEffect(() => {
    const handleUnlock = (e) => {
      const { id, title, desc } = e.detail;
      
      setUnlockedBadges((prev) => {
        if (prev.includes(id)) return prev;

        spaceSounds.playAchievement();

        setActiveNotification({ title, desc });
        setTimeout(() => {
          setActiveNotification(null);
        }, 4500);

        return [...prev, id];
      });
    };

    window.addEventListener('unlock-achievement', handleUnlock);
    return () => window.removeEventListener('unlock-achievement', handleUnlock);
  }, []);

  // Ambient drone loops trigger
  useEffect(() => {
    if (!settings.muted && settings.ambience) {
      spaceSounds.startAmbience();
    } else {
      spaceSounds.stopAmbience();
    }
  }, [settings.muted, settings.ambience]);

  // Bind system hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const key = e.key.toLowerCase();
      if (key === 'h') {
        e.preventDefault();
        spaceSounds.playClick();
        setActiveTab('home');
      } else if (key === 'd') {
        e.preventDefault();
        spaceSounds.playClick();
        setActiveTab('dashboard');
      } else if (key === 's') {
        e.preventDefault();
        spaceSounds.playClick();
        setActiveTab('explorer');
      } else if (key === 'a') {
        e.preventDefault();
        spaceSounds.playClick();
        setActiveTab('archives');
      } else if (key === 'm') {
        e.preventDefault();
        const nextMute = !settings.muted;
        spaceSounds.playClick();
        spaceSounds.setMute(nextMute);
        setSettings(prev => ({ ...prev, muted: nextMute }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.muted]);

  // Render view mapping
  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardView />;
      case 'explorer':
        return <ExplorerView />;
      case 'missions':
        return <MissionsView />;
      case 'archives':
        return <ArchivesView />;
      case 'timeline':
        return <TimelineView />;
      case 'assistant':
        return <AssistantView />;
      case 'settings':
        return <SettingsView settings={settings} setSettings={setSettings} />;
      default:
        return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* Cinematic System Loading Screen */}
      {loading && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#051424',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-data)',
            color: '#00f0ff',
            backgroundImage: 'radial-gradient(circle, rgba(0, 240, 255, 0.05) 0%, transparent 80%)'
          }}
        >
          {/* Scanline CRT overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', zIndex: 10 }}>
            {/* Circular progress loader */}
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="4" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#00f0ff" strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - loadingProgress / 100)}
                  style={{ transition: 'stroke-dashoffset 0.1s linear', filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-data)',
                fontSize: '18px',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(0,240,255,0.5)'
              }}>
                {loadingProgress}%
              </div>
            </div>

            {/* Diagnostic system logs */}
            <div style={{ height: '70px', width: '380px', textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
              {diagnosticLogs.map((log, idx) => (
                <div key={idx} style={{ opacity: idx === diagnosticLogs.length - 1 ? 1 : 0.35, transition: 'opacity 0.2s', marginBottom: '4px', letterSpacing: '0.05em' }}>
                  {log}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setLoading(false)}
              className="btn-secondary"
              style={{ padding: '6px 16px', borderRadius: '4px', fontSize: '9px', pointerEvents: 'auto', background: 'rgba(255,255,255,0.03)' }}
            >
              SKIP BOOT SEQUENCE
            </button>
          </div>
        </div>
      )}

      {/* Sci-Fi Custom Cursor (Hidden on touch devices) */}
      {!isMobile && !loading && (
        <>
          {/* Inner focus dot */}
          <div style={{
            position: 'fixed',
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '6px',
            height: '6px',
            backgroundColor: isHovered ? 'var(--primary-container)' : '#ffffff',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 999999,
            transition: 'background-color 0.2s'
          }} />

          {/* Outer rotating spring ring */}
          <div 
            style={{
              position: 'fixed',
              left: `${trailPos.x}px`,
              top: `${trailPos.y}px`,
              width: isHovered ? '42px' : '24px',
              height: isHovered ? '42px' : '24px',
              border: '1.5px dashed var(--primary-container)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 999998,
              transition: 'width 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s',
              animation: 'rotate-self 10s linear infinite',
              borderColor: isHovered ? 'var(--primary-container)' : 'rgba(255,255,255,0.4)',
              boxShadow: isHovered ? '0 0 15px var(--accent-glow)' : 'none'
            }}
          />
        </>
      )}

      {/* 1. Starfield Background Canvas */}
      <StarfieldBackground enabled={settings.particles && !settings.reducedMotion} />

      {/* Background radial overlay */}
      <div className="space-gradient-bg" />

      {/* 2. Top Header Navigation */}
      <TopNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        settings={settings} 
        setSettings={setSettings} 
      />

      {/* 3. Main Route Canvas View */}
      <main 
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '112px var(--margin-desktop) 64px var(--margin-desktop)',
          minHeight: 'calc(100vh - 120px)',
          zIndex: 10,
          position: 'relative'
        }}
        className="main-view-container"
      >
        <div key={activeTab} className="route-fade-enter-active">
          <React.Suspense fallback={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px', color: 'var(--primary-container)', fontFamily: 'var(--font-data)' }}>
              <span className="pulse-glow-node" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary-container)' }} />
              <div>SYNAPSE FEED LOADING...</div>
            </div>
          }>
            {renderView()}
          </React.Suspense>
        </div>
      </main>

      {/* 4. Floating Achievement Notification Banner */}
      {activeNotification && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '320px',
            padding: '20px',
            zIndex: 9999,
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            borderColor: 'var(--primary-container)',
            boxShadow: '0 0 25px var(--accent-glow)',
            animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <span 
            className="material-symbols-outlined pulse-glow-node" 
            style={{ 
              fontSize: '36px', 
              color: 'var(--primary-container)',
              background: 'rgba(0, 240, 255, 0.1)',
              padding: '8px',
              borderRadius: '50%'
            }}
          >
            emoji_events
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: '9px', color: 'var(--primary-container)', fontWeight: 'bold', letterSpacing: '0.1em' }}>
              ACHIEVEMENT UNLOCKED
            </div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: '4px 0 2px 0' }}>
              {activeNotification.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', lineHeight: '15px' }}>
              {activeNotification.desc}
            </div>
          </div>
        </div>
      )}

      {/* Floating Sound Caption Overlay for Deaf/Hard-of-Hearing Accessibility */}
      {activeCaption && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            padding: '12px 18px',
            zIndex: 99999,
            pointerEvents: 'none',
            borderColor: 'var(--primary-container)',
            boxShadow: '0 0 20px var(--accent-glow-soft)',
            fontFamily: 'var(--font-data)',
            fontSize: '11px',
            color: 'var(--primary-container)',
            backgroundColor: 'rgba(5, 20, 36, 0.95)',
            borderRadius: '4px'
          }}
        >
          {activeCaption}
        </div>
      )}

      {/* 5. Footer */}
      <footer 
        style={{
          width: '100%',
          padding: '48px var(--margin-desktop)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: 'var(--surface-lowest)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          zIndex: 20,
          position: 'relative',
          fontSize: '13px',
          fontFamily: 'var(--font-data)'
        }}
        className="footer-deck"
      >
        <div style={{ color: 'var(--on-surface-variant)' }}>
          © 2026 CosmosVerse. Scientific Data via NASA/ESA.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" className="footer-link">Privacy Protocol</a>
          <a href="#" className="footer-link">Deep Space Network</a>
          <a href="#" className="footer-link">Contact Command</a>
        </div>
        <div 
          className="glow-text" 
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '18px', 
            fontWeight: 800, 
            letterSpacing: '0.05em',
            color: 'var(--primary-container)' 
          }}
        >
          COSMOSVERSE
        </div>
      </footer>

      {/* Custom Global overrides */}
      {!isMobile && (
        <style>{`
          /* Hide standard system cursors on desktop to prevent overlap */
          body, button, a, select, input, textarea, label {
            cursor: none !important;
          }
        `}</style>
      )}
      <style>{`
        .footer-link {
          color: var(--on-surface-variant);
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 1.5px;
          background-color: var(--primary-container);
          transition: width 0.3s ease;
        }
        .footer-link:hover {
          color: var(--primary-container);
        }
        .footer-link:hover::after {
          width: 100%;
        }
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .main-view-container {
            padding: 96px var(--margin-mobile) 48px var(--margin-mobile) !important;
          }
          .footer-deck {
            padding: 32px var(--margin-mobile) !important;
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default App;
