import Sidebar from '@/components/layout/Sidebar';
import { Bell, Trophy, Zap, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Executive Top Bar */}
        <header 
          className="glass-panel" 
          role="banner"
          aria-label="Dashboard status bar"
          style={{
            margin: '1rem 1rem 0 1rem',
            padding: '0.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 'var(--radius-md)',
            height: '64px',
            position: 'sticky',
            top: '1rem',
            zIndex: 40,
            background: 'rgba(13, 20, 38, 0.4)'
          }}
        >
          {/* Status Indicators */}
          <div className="flex items-center gap-6" role="status" aria-label="System status">
            <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} color="var(--primary)" aria-hidden="true" />
              <span style={{ fontWeight: 500 }}>AI Core:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }} aria-label="AI Core is Active">Active</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
              <Zap size={14} color="var(--accent)" aria-hidden="true" />
              <span style={{ fontWeight: 500 }}>Sync State:</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }} aria-label="Sync state is Optimal">Optimal</span>
            </div>
          </div>

          {/* User Metrics & Quick Profile */}
          <div className="flex items-center gap-6" style={{ marginLeft: 'auto' }}>
            {/* Points Indicator */}
            <div className="flex items-center gap-2" role="status" aria-label="You have 2,840 eco points" style={{ 
              background: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.2)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              color: 'var(--warning)',
              fontWeight: 600
            }}>
              <Trophy size={14} aria-hidden="true" />
              <span>2,840 pts</span>
            </div>

            {/* Notification Bell */}
            <button 
              aria-label="Notifications — 1 unread"
              style={{ 
                position: 'relative', 
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                padding: '0.25rem'
              }}
            >
              <Bell size={20} aria-hidden="true" />
              <span style={{ 
                position: 'absolute', 
                top: '-2px', 
                right: '-2px', 
                width: '8px', 
                height: '8px', 
                background: 'var(--danger)', 
                borderRadius: '50%' 
              }} aria-hidden="true" />
            </button>

            {/* User Profile Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
              <div aria-hidden="true" style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Outfit',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'white'
              }}>
                CG
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Carbon Guardian</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main id="main-content" role="main" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
