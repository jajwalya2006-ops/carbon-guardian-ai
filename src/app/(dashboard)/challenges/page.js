'use client'
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Award, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Challenges() {
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Zero Waste Day', desc: 'Produce no non-recyclable trash today.', points: 50, completed: true },
    { id: 2, title: 'Turn off Unused Devices', desc: 'Unplug all vampire appliances before sleeping.', points: 20, completed: false },
    { id: 3, title: 'Reusable Bottle', desc: 'Do not buy any plastic water bottles today.', points: 15, completed: false },
  ]);

  const handleComplete = useCallback((id) => {
    setChallenges(prev => 
      prev.map(c => c.id === id ? { ...c, completed: true } : c)
    );
  }, []);

  // Compute points and progress metrics
  const completedCount = useMemo(() => challenges.filter(c => c.completed).length, [challenges]);
  const earnedPoints = useMemo(() => challenges.reduce((acc, curr) => acc + (curr.completed ? curr.points : 0), 0), [challenges]);
  const totalAvailable = useMemo(() => challenges.reduce((acc, curr) => acc + curr.points, 0), [challenges]);
  const progressPercent = useMemo(() => Math.min((earnedPoints / totalAvailable) * 100, 100), [earnedPoints, totalAvailable]);

  return (
    <div style={{ padding: '0.5rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Daily Challenges</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Complete active environmental tasks to earn community points and badges.</p>
        </div>

        {/* Live point badge */}
        <div className="glass-card" style={{ padding: '0.75rem 1.5rem', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Earned Today</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>+{earnedPoints} pts</div>
        </div>
      </header>

      {/* Challenges list container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {challenges.map((c, i) => (
          <motion.div 
            key={c.id} 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="glass-card" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              opacity: c.completed ? 0.65 : 1,
              borderLeft: c.completed ? '4px solid var(--primary)' : '4px solid rgba(255,255,255,0.06)',
              background: c.completed ? 'rgba(16,185,129,0.02)' : 'rgba(13,20,38,0.45)',
              transition: 'opacity 0.3s, border-color 0.3s'
            }}
          >
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ 
                color: c.completed ? 'var(--primary)' : 'var(--text-muted)',
                background: c.completed ? 'var(--primary-glow)' : 'rgba(255,255,255,0.03)',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex'
              }}>
                {c.completed ? <CheckCircle size={20} /> : <Target size={20} />}
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.15rem', 
                  fontWeight: 700, 
                  textDecoration: c.completed ? 'line-through' : 'none',
                  color: c.completed ? 'var(--text-secondary)' : 'white'
                }}>
                  {c.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.15rem' }}>{c.desc}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.95rem' }}>+{c.points} pts</span>
              
              {c.completed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Completed
                </div>
              ) : (
                <button 
                  onClick={() => handleComplete(c.id)}
                  className="btn btn-outline" 
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  Complete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Summary Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.2)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '0.65rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <Trophy size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Level Milestones</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Earn enough daily experience to unlock the next level badge.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          <span>Eco-Warrior Rank Progress</span>
          <span style={{ fontWeight: 600, color: 'white' }}>{earnedPoints} / {totalAvailable} EXP</span>
        </div>

        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
          }} />
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} color="var(--primary)" />
          {progressPercent === 100 
            ? "Congratulations! You have completed all of today's challenges. Check back tomorrow!" 
            : `You are ${(totalAvailable - earnedPoints)} points away from today's cap!`}
        </p>
      </motion.div>
    </div>
  );
}
