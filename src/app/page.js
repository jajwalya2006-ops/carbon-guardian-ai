'use client'
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Globe } from 'lucide-react';

const FeaturesGrid = dynamic(() => import('@/components/FeaturesGrid'), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

export default function LandingPage() {
  return (
    <main className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem', position: 'relative' }}>
      {/* Top Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-panel" 
        style={{ 
          padding: '1rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '4rem',
          background: 'rgba(13, 20, 38, 0.4)'
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', 
            padding: '0.6rem', 
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
          }}>
            <Shield color="white" size={20} />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
            Carbon<span className="text-gradient">Guardian</span> AI
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
            Log In
          </Link>
          <Link href="/auth/signup" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center" 
        style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Futuristic Tech Badge */}
        <motion.div 
          variants={itemVariants}
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '0.5rem 1.25rem',
            borderRadius: '30px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}
        >
          <Globe size={14} className="animate-pulse" />
          <span>Award-Winning Environmental Copilot</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={itemVariants}
          style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.1, 
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            maxWidth: '900px'
          }}
        >
          Take Control of Your <br />
          <span className="text-gradient">Carbon Footprint</span> with AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: 'var(--text-secondary)', 
            maxWidth: '650px', 
            margin: '0 auto 2.5rem auto', 
            lineHeight: 1.6 
          }}
        >
          Analyze your environmental impact using advanced digital twin models. 
          Predict, simulate, and lower emissions with tailored AI coaching and gamified incentives.
        </motion.p>

        {/* Hero Actions */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center gap-4"
        >
          <Link href="/assessment" className="btn btn-primary btn-lg">
            Calculate Footprint <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard" className="btn btn-glass btn-lg">
            Explore Demo
          </Link>
        </motion.div>
      </motion.section>

      {/* Grid Features */}
      <FeaturesGrid />
    </main>
  );
}
