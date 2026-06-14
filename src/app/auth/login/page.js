'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Mail, Lock } from 'lucide-react';

export default function Login() {
  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-card" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '3.5rem 2.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', 
            padding: '0.9rem', 
            borderRadius: '50%', 
            marginBottom: '1.25rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
          }}>
            <Shield color="white" size={28} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>Log in to Carbon Guardian AI</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="email" className="form-input" placeholder="name@domain.com" required style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
          <div className="form-group" style={{ position: 'relative', marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="password" className="form-input" placeholder="••••••••" required style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit" 
            className="btn btn-primary w-full"
            style={{ marginTop: '0.5rem', height: '48px' }}
          >
            Log In <ArrowRight size={18} />
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account? <Link href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
