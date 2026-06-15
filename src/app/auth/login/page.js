'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { validateEmail, validatePassword, RateLimiter, RATE_LIMITS } from '@/lib/security';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [rateLimitError, setRateLimitError] = useState(null);
  const [limiter, setLimiter] = useState(null);

  useEffect(() => {
    setLimiter(new RateLimiter('login', RATE_LIMITS.maxLoginAttempts, RATE_LIMITS.lockoutDurationMs));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrors({});
    setRateLimitError(null);

    if (limiter) {
      const limitStatus = limiter.checkLimit();
      if (!limitStatus.allowed) {
        setRateLimitError(limitStatus.message);
        return;
      }
    }

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.valid || !passwordValidation.valid) {
      setErrors({
        email: emailValidation.error,
        password: passwordValidation.error,
      });
      return;
    }

    if (limiter) limiter.recordAttempt();
    
    // Proceed if validation passes (simulated success)
    if (limiter) limiter.reset();
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

        <AnimatePresence>
          {rateLimitError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                color: 'var(--danger)',
                fontSize: '0.875rem'
              }}
              role="alert"
            >
              <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{rateLimitError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group" style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input 
                id="login-email"
                type="email" 
                className="form-input" 
                placeholder="name@domain.com" 
                required 
                style={{ paddingLeft: '2.5rem', borderColor: errors.email ? 'var(--danger)' : '' }}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && <span id="email-error" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
          </div>
          <div className="form-group" style={{ position: 'relative', marginBottom: '2rem' }}>
            <label htmlFor="login-password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input 
                id="login-password"
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                required 
                style={{ paddingLeft: '2.5rem', borderColor: errors.password ? 'var(--danger)' : '' }}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
            </div>
            {errors.password && <span id="password-error" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.password}</span>}
          </div>
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit" 
            className="btn btn-primary w-full"
            style={{ marginTop: '0.5rem', height: '48px' }}
            disabled={!!rateLimitError}
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
