// TopNavBar.jsx - Main header navigation with sound settings
import React, { useState } from 'react';
import spaceSounds from './SoundManager';

const TopNavBar = ({ activeTab, setActiveTab, settings, setSettings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    spaceSounds.playClick();
    window.dispatchEvent(new Event('transition-start'));
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const toggleMute = () => {
    const nextMute = !settings.muted;
    spaceSounds.playClick();
    spaceSounds.setMute(nextMute);
    setSettings({ ...settings, muted: nextMute });
    
    // Auto start background ambience if unmuted
    if (!nextMute && settings.ambience) {
      spaceSounds.startAmbience();
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: 'explore' },
    { id: 'dashboard', label: 'Mission Control', icon: 'dashboard' },
    { id: 'explorer', label: 'Solar System', icon: 'travel_explore' },
    { id: 'missions', label: 'Missions', icon: 'rocket_launch' },
    { id: 'archives', label: 'Stellar Archives', icon: 'auto_awesome_motion' },
    { id: 'timeline', label: 'Knowledge Base', icon: 'auto_stories' },
    { id: 'assistant', label: 'AI Assistant', icon: 'smart_toy' }
  ];

  return (
    <>
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '80px',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 var(--margin-desktop)',
          backgroundColor: 'rgba(5, 20, 36, 0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(125, 244, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
        }}
        className="navbar-desktop"
      >
        {/* Left Side: Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          onMouseEnter={() => spaceSounds.playHover()}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span 
            className="glow-text"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: 'var(--primary-fixed)'
            }}
          >
            COSMOS<span style={{ color: '#fff' }}>VERSE</span>
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="hidden md-flex">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => spaceSounds.playHover()}
                style={{
                  padding: '8px 16px',
                  fontFamily: 'var(--font-data)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  background: isActive ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--primary-container)' : '2px solid transparent',
                  color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Sound Manager and Settings Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Mute/Unmute Synthesizer Sound Controls */}
          <button
            onClick={toggleMute}
            onMouseEnter={() => spaceSounds.playHover()}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: settings.muted ? 'var(--error-color)' : 'var(--primary-fixed)',
              transition: 'all 0.3s ease'
            }}
            className="glow-hover"
            title={settings.muted ? "Unmute Ambience & SFX" : "Mute Ambience & SFX"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {settings.muted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Quick settings profile route */}
          <button
            onClick={() => handleNavClick('settings')}
            onMouseEnter={() => spaceSounds.playHover()}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: activeTab === 'settings' ? 'var(--primary-container)' : 'var(--on-surface-variant)',
              transition: 'all 0.3s ease'
            }}
            className="glow-hover font-icon"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              settings
            </span>
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              display: 'none'
            }}
            className="mobile-menu-toggle"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 80px)',
            backgroundColor: 'rgba(5, 20, 36, 0.95)',
            backdropFilter: 'blur(30px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 20px',
            gap: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={() => spaceSounds.playHover()}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                color: activeTab === item.id ? 'var(--primary-container)' : '#fff',
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span className="material-symbols-outlined" style={{ color: activeTab === item.id ? 'var(--primary-container)' : 'var(--on-surface-variant)' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Embedded CSS rules for nav responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop {
            padding: 0 var(--margin-mobile) !important;
            height: 70px !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .hidden-md-flex {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default TopNavBar;
