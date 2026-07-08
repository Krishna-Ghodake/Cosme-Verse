// SideNavBar.jsx - Collapsible sidebar for detailed dashboard controls
import React from 'react';
import spaceSounds from './SoundManager';

const SideNavBar = ({ activeSubTab, setActiveSubTab, onScanTrigger }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'telemetry', label: 'Telemetry Logs', icon: 'query_stats' },
    { id: 'map', label: 'Stellar Map', icon: 'auto_awesome_motion' },
    { id: 'crew', label: 'Crew Manifest', icon: 'group' },
    { id: 'logs', label: 'System Logs', icon: 'menu_book' }
  ];

  const handleSubTabClick = (tabId) => {
    spaceSounds.playClick();
    setActiveSubTab(tabId);
  };

  const handleScanClick = () => {
    spaceSounds.playPlanetSelect();
    if (onScanTrigger) {
      onScanTrigger();
    }
  };

  return (
    <aside 
      style={{
        position: 'fixed',
        left: 0,
        top: '80px',
        bottom: 0,
        width: '260px',
        backgroundColor: 'rgba(5, 20, 36, 0.35)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90
      }}
      className="hidden-mobile"
    >
      {/* Commander Profile Block */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
            className="holo-avatar"
          >
            <img 
              alt="Commander Visor" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9_7A3Tn1dAZ5Jb6S3OgfJ2sK7keKFpruRKeiW6sOey-Lofzni2OSkV77NU9Nnw6WRCf-NfGjKP9SQcficXSIO9vYYBi0q3sY_WF1oXjcPIPafdlXTU8f1nZC1WJi-ADmhn-tt5dbGv4Ds7BcljVK-iBhq0HKCrmjcXzHH9x3U1dee8gWcS6u2c5zV1cnFIZ2lDcpmlnINY72PSsXZWvwwKZqEasB6k4NCgpE5LjyX7n6LsNKPWU84" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h4 
              style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '15px', 
                fontWeight: 600, 
                color: 'var(--primary-fixed)' 
              }}
            >
              Cdr. Vance
            </h4>
            <span 
              style={{ 
                fontFamily: 'var(--font-data)', 
                fontSize: '9px', 
                color: 'var(--on-surface-variant)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Station Alpha-1
            </span>
          </div>
        </div>

        {/* Initiate Scan Trigger */}
        <button
          onClick={handleScanClick}
          onMouseEnter={() => spaceSounds.playHover()}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.15em'
          }}
        >
          Initiate Scan
        </button>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map(item => {
            const isActive = activeSubTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleSubTabClick(item.id)}
                  onMouseEnter={() => spaceSounds.playHover()}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                    borderRight: isActive ? '4px solid var(--primary-container)' : 'none',
                    color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                    fontFamily: 'var(--font-data)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  className={!isActive ? "glow-hover-sidebar" : ""}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sub Info node */}
      <div 
        style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontFamily: 'var(--font-data)',
          fontSize: '10px',
          color: 'var(--on-surface-variant)',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span>SYS STATUS</span>
        <span className="glow-text" style={{ color: 'var(--primary-container)', fontWeight: 'bold' }}>NOMINAL</span>
      </div>

      <style>{`
        .glow-hover-sidebar:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #fff !important;
          transform: translateX(3px);
        }
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default SideNavBar;
