// SettingsView.jsx - System Controls, Theme Customization, and Accessibility Parameters
import React from 'react';
import spaceSounds from '../components/SoundManager';

const SettingsView = ({ settings, setSettings }) => {

  const handleMuteChange = (muted) => {
    spaceSounds.playClick();
    spaceSounds.setMute(muted);
    setSettings(prev => ({ ...prev, muted }));
    
    if (!muted && settings.ambience) {
      spaceSounds.startAmbience();
    }
  };

  const handleVolumeChange = (vol) => {
    spaceSounds.setVolume(vol);
    setSettings(prev => ({ ...prev, volume: vol }));
  };

  const handleAmbienceChange = (ambience) => {
    spaceSounds.playClick();
    if (ambience && !settings.muted) {
      spaceSounds.startAmbience();
    } else {
      spaceSounds.stopAmbience();
    }
    setSettings(prev => ({ ...prev, ambience }));
  };

  const handleParticlesChange = (particles) => {
    spaceSounds.playClick();
    setSettings(prev => ({ ...prev, particles }));
  };

  const handleAccentChange = (accent) => {
    spaceSounds.playClick();
    document.documentElement.setAttribute('data-accent', accent);
    setSettings(prev => ({ ...prev, accent }));
  };

  const handleToggleAccessibility = (key, val) => {
    spaceSounds.playClick();
    if (key === 'reducedMotion') {
      document.documentElement.setAttribute('data-reduced-motion', val ? 'true' : 'false');
    }
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  return (
    <section 
      className="glass-panel" 
      style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '32px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '32px',
        animation: 'fadeIn 0.5s ease-out' 
      }}
    >
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--primary-fixed)' }}>
          Command Center Settings
        </h1>
        <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-data)' }}>
          SYSTEM COGNITIVE PARAMETERS
        </span>
      </header>

      {/* 1. Audio Synthesis Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>
          SYNTHESIZED AUDIO CONTROLS
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gutter)' }} className="hud-grid">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Master Mute</div>
              <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Silence all synthesized sound effects</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.muted} 
              onChange={(e) => handleMuteChange(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Ambience Hum</div>
              <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Deep space background vacuum drone</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.ambience} 
              disabled={settings.muted}
              onChange={(e) => handleAmbienceChange(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
            <span>Master Volume</span>
            <span style={{ fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>{Math.round(settings.volume * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={settings.volume} 
            disabled={settings.muted}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 2. Accessibility & Visual Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>
          ACCESSIBILITY & OPTIMIZATIONS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gutter)' }} className="hud-grid">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Visual Sound Captions</div>
              <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Display captions when audio sweeps trigger</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.soundCaptions || false} 
              onChange={(e) => handleToggleAccessibility('soundCaptions', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Reduced Motion</div>
              <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Pause background star drift & complex loops</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.reducedMotion || false} 
              onChange={(e) => handleToggleAccessibility('reducedMotion', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Parallax Canvas Starfield</div>
            <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Twinkling stars, moving parallax, and shooting stars</div>
          </div>
          <input 
            type="checkbox" 
            checked={settings.particles} 
            onChange={(e) => handleParticlesChange(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 3. Color Theme Customizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>
          SYSTEM ACCENT SPECTRUM
        </h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { id: 'cyan', label: 'Electric Cyan', color: '#00f0ff' },
            { id: 'purple', label: 'Nebula Purple', color: '#cf5cff' },
            { id: 'orange', label: 'Supernova Orange', color: '#ff9800' }
          ].map(theme => (
            <button
              key={theme.id}
              onClick={() => handleAccentChange(theme.id)}
              style={{
                flex: 1,
                padding: '16px',
                background: settings.accent === theme.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)',
                border: settings.accent === theme.id ? `2px solid ${theme.color}` : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.color }} />
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Keyboard Shortcuts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-data)', color: 'var(--primary-container)' }}>
          SYSTEM KEYBOARD SHORTCUTS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontFamily: 'var(--font-data)', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
          <div>[ H ] KEY -- NAVIGATE TO HOME</div>
          <div>[ D ] KEY -- NAVIGATE TO MISSION CONTROL</div>
          <div>[ S ] KEY -- NAVIGATE TO SOLAR SYSTEM</div>
          <div>[ A ] KEY -- NAVIGATE TO STELLAR ARCHIVES</div>
          <div>[ M ] KEY -- TOGGLE SYSTEM AUDIO MUTE</div>
        </div>
      </div>

    </section>
  );
};

export default SettingsView;
