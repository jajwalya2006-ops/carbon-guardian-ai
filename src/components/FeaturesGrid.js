'use client'
import { motion } from 'framer-motion';
import { Activity, TrendingDown, Award } from 'lucide-react';

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

export default function FeaturesGrid() {
  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="grid mt-8 gap-6" 
      style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        marginTop: '6rem'
      }}
    >
      <motion.div 
        variants={itemVariants} 
        className="glass-card"
        whileHover={{ translateY: -6 }}
      >
        <div style={{ 
          marginBottom: '1.25rem', 
          color: 'var(--primary)',
          background: 'var(--primary-glow)',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)'
        }}>
          <Activity size={24} />
        </div>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700 }}>Carbon Twin AI</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Model a real-time digital twin of your carbon profile. Interactively consult your virtual advisor to simulate lifestyle improvements.
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        className="glass-card card-hover-cyan"
        whileHover={{ translateY: -6 }}
      >
        <div style={{ 
          marginBottom: '1.25rem', 
          color: 'var(--accent)',
          background: 'var(--accent-glow)',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(6, 182, 212, 0.1)'
        }}>
          <TrendingDown size={24} />
        </div>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700 }}>Scenario Simulator</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Adjust parameters like transportation mix or home energy efficiency to witness immediate savings projections on interactive charts.
        </p>
      </motion.div>

      <motion.div 
        variants={itemVariants} 
        className="glass-card"
        whileHover={{ translateY: -6 }}
      >
        <div style={{ 
          marginBottom: '1.25rem', 
          color: 'var(--warning)',
          background: 'rgba(245, 158, 11, 0.1)',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(245, 158, 11, 0.1)'
        }}>
          <Award size={24} />
        </div>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700 }}>Gamified Growth</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Complete daily targets, level up badges, and climb the leaderboard alongside a conscious community cutting down footprint.
        </p>
      </motion.div>
    </motion.section>
  );
}
