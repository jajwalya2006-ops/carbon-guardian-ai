'use client'
import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Check, Award, Sparkles, TrendingDown, Eye, CheckCircle2 } from 'lucide-react';

export default function AICoach() {
  // Dynamic state for adopted habits to show live scoring changes
  const [adoptedHabits, setAdoptedHabits] = useState({
    led: false,
    meatless: false,
    ac: false
  });

  const habits = [
    {
      id: 'led',
      title: 'Switch to LED Bulbs',
      impact: 'High',
      savings: '45 kg CO2/mo',
      desc: 'Based on your reported electricity usage, switching all remaining incandescent bulbs to LED can significantly reduce emissions.',
      glowColor: 'var(--primary)'
    },
    {
      id: 'meatless',
      title: 'Meatless Mondays',
      impact: 'Medium',
      savings: '30 kg CO2/mo',
      desc: 'Replacing meat with plant-based alternatives one day a week cuts down agricultural emissions drastically.',
      glowColor: 'var(--accent)'
    },
    {
      id: 'ac',
      title: 'Optimize AC Temperature',
      impact: 'Medium',
      savings: '25 kg CO2/mo',
      desc: 'Setting your thermostat 2 degrees higher in summer can save energy without sacrificing much comfort.',
      glowColor: 'var(--warning)'
    }
  ];

  const handleToggleHabit = useCallback((id) => {
    setAdoptedHabits(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const adoptedCount = useMemo(() => Object.values(adoptedHabits).filter(Boolean).length, [adoptedHabits]);
  const totalSavings = useMemo(() => (
    (adoptedHabits.led ? 45 : 0) +
    (adoptedHabits.meatless ? 30 : 0) +
    (adoptedHabits.ac ? 25 : 0)
  ), [adoptedHabits]);

  const badges = useMemo(() => [
    { title: 'Eco Starter', criteria: 'Adopt 1 Habit', unlocked: adoptedCount >= 1, color: '#06b6d4' },
    { title: 'Carbon Fighter', criteria: 'Adopt 2 Habits', unlocked: adoptedCount >= 2, color: '#10b981' },
    { title: 'Earth Guardian', criteria: 'Adopt 3 Habits', unlocked: adoptedCount >= 3, color: '#f59e0b' }
  ], [adoptedCount]);

  return (
    <div style={{ padding: '0.5rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>AI Sustainability Coach</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Personalized behavioral adjustments computed to reduce your baseline emissions.</p>
        </div>

        {/* Live Savings Badge */}
        <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(16, 185, 129, 0.08)' }}>
          <TrendingDown size={20} color="var(--primary)" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coached Savings</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{totalSavings} kg CO2/mo</div>
          </div>
        </div>
      </header>

      <div className="grid gap-8" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        {/* Actions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {habits.map((h, i) => {
            const isAdopted = adoptedHabits[h.id];
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="glass-card"
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  alignItems: 'flex-start',
                  borderLeft: isAdopted ? `4px solid var(--primary)` : `4px solid rgba(255,255,255,0.05)`,
                  background: isAdopted ? 'rgba(16,185,129,0.03)' : 'rgba(13,20,38,0.45)'
                }}
              >
                {/* Icon blob */}
                <div style={{ 
                  background: isAdopted ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
                  padding: '1rem', 
                  borderRadius: '50%', 
                  color: isAdopted ? 'white' : 'var(--text-secondary)', 
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isAdopted ? 'none' : '1px solid rgba(255,255,255,0.06)'
                }}>
                  {isAdopted ? <Check size={20} /> : <Lightbulb size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{h.title}</h3>
                    <span style={{ 
                      background: 'rgba(16, 185, 129, 0.08)', 
                      border: '1px solid rgba(16,185,129,0.2)',
                      color: 'var(--primary)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      fontWeight: 700 
                    }}>
                      {h.impact} IMPACT
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {h.desc}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Est. Savings: <span style={{ fontWeight: 700, color: 'white' }}>{h.savings}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleToggleHabit(h.id)}
                      className={isAdopted ? "btn btn-primary" : "btn btn-outline"} 
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    >
                      {isAdopted ? (
                        <>
                          <CheckCircle2 size={14} /> Adopted
                        </>
                      ) : 'Adopt Habit'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Achievements Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem', background: 'rgba(13,20,38,0.45)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="var(--primary)" /> Coached Badges
            </h3>
            
            {/* Stepper Progress inside cards */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <span>Milestone Goals</span>
                <span>{adoptedCount}/3 Complete</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(adoptedCount / 3) * 100}%`, 
                  background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Badges Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {badges.map((b, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: b.unlocked ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0,0,0,0.15)',
                    border: b.unlocked ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                    opacity: b.unlocked ? 1 : 0.4,
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ 
                    background: b.unlocked ? b.color + '20' : 'rgba(255,255,255,0.02)', 
                    color: b.unlocked ? b.color : 'var(--text-muted)',
                    padding: '0.5rem', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: b.unlocked ? `0 0 10px ${b.color}25` : 'none'
                  }}>
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: b.unlocked ? 'white' : 'var(--text-secondary)' }}>{b.title}</h4>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{b.criteria}</span>
                  </div>
                  {b.unlocked && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      UNLOCKED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
