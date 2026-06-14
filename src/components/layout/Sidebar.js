'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calculator, 
  Activity, 
  Lightbulb, 
  SlidersHorizontal, 
  Target, 
  Trophy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calculator', href: '/assessment', icon: Calculator },
  { name: 'Carbon Twin', href: '/twin', icon: Activity },
  { name: 'AI Coach', href: '/coach', icon: Lightbulb },
  { name: 'Simulator', href: '/simulator', icon: SlidersHorizontal },
  { name: 'Challenges', href: '/challenges', icon: Target },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load collapse state from local storage after mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(nextState));
  };

  if (!mounted) {
    return (
      <aside className="glass-panel" style={{ 
        width: '260px', 
        height: 'calc(100vh - 2rem)', 
        margin: '1rem 0 1rem 1rem'
      }} />
    );
  }

  return (
    <motion.aside 
      layout
      className="glass-panel" 
      role="navigation"
      aria-label="Main navigation"
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
      style={{ 
        height: 'calc(100vh - 2rem)', 
        position: 'sticky', 
        top: '1rem',
        display: 'flex',
        flexDirection: 'column',
        padding: isCollapsed ? '1.25rem 0.75rem' : '1.5rem',
        margin: '1rem 0 1rem 1rem',
        overflow: 'hidden',
        zIndex: 50
      }}
    >
      {/* Brand Header */}
      <div style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: '0.5rem',
        position: 'relative',
        height: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div aria-hidden="true" style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', 
            padding: '0.6rem', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)'
          }}>
            <Shield color="white" size={18} />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', whiteSpace: 'nowrap' }}
            >
              Carbon<span className="text-gradient">Guardian</span>
            </motion.span>
          )}
        </div>

        {/* Toggle Collapse Button */}
        {!isCollapsed && (
          <button 
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
            aria-expanded="true"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button 
          onClick={toggleCollapse}
          aria-label="Expand sidebar"
          aria-expanded="false"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            margin: '0 auto 1.5rem auto'
          }}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Navigation Menu */}
      <nav aria-label="Dashboard pages" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              style={{ textDecoration: 'none' }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={isCollapsed ? item.name : undefined}
            >
              <motion.div
                whileHover={{ x: isCollapsed ? 0 : 4, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: '1rem',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '4px',
                      height: '60%',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '0 4px 4px 0',
                      boxShadow: '0 0 10px var(--primary)'
                    }}
                  />
                )}
                <Icon size={18} aria-hidden="true" style={{ color: isActive ? 'var(--primary)' : 'inherit', flexShrink: 0 }} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '0.925rem', whiteSpace: 'nowrap' }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout / Return Home */}
      <div style={{ marginTop: 'auto' }}>
        <Link href="/" style={{ textDecoration: 'none' }} aria-label="Return to home page">
          <motion.div
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '1rem',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <LogOut size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontSize: '0.925rem', whiteSpace: 'nowrap' }}
              >
                Logout
              </motion.span>
            )}
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
}
