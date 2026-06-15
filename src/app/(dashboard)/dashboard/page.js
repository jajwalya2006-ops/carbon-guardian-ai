'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ArrowDown, 
  ArrowUp, 
  Zap, 
  Car, 
  TrendingDown, 
  Info,
  Calendar,
  Globe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const data = [
  { name: 'Mon', emissions: 45 },
  { name: 'Tue', emissions: 52 },
  { name: 'Wed', emissions: 38 },
  { name: 'Thu', emissions: 65 },
  { name: 'Fri', emissions: 48 },
  { name: 'Sat', emissions: 30 },
  { name: 'Sun', emissions: 25 },
];

const activityLog = [
  { id: 1, type: 'transport', activity: 'Commuted by Bicycle', impact: '-4.2 kg CO2', time: '2 hours ago', status: 'optimal' },
  { id: 2, type: 'energy', activity: 'AC Smart Eco Mode', impact: '-1.8 kg CO2', time: '5 hours ago', status: 'optimal' },
  { id: 3, type: 'food', activity: 'Vegan Lunch Day', impact: '-2.5 kg CO2', time: 'Yesterday', status: 'stable' },
  { id: 4, type: 'transport', activity: 'Highway Drive', impact: '+8.4 kg CO2', time: '2 days ago', status: 'critical' },
];


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('weekly');

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* Header section with time filter tabs */}
      <div className="flex justify-between items-end flex-wrap gap-4" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
            Environmental Intelligence
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem' }}>
            Real-time carbon footprint metrics and predictive modeling.
          </p>
        </div>

        {/* Time Tabs */}
        <div className="glass-panel flex gap-1" style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          {['weekly', 'monthly', 'yearly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn"
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                background: activeTab === tab ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                borderRadius: '8px',
                fontWeight: activeTab === tab ? 600 : 500
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '2rem' }}>
        {/* Weekly Footprint Score */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card"
        >
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Weekly Total
            </span>
            <div style={{ background: 'var(--primary-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <AnimatedCounter end={303} /> 
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>kg CO2</span>
          </div>
          <div className="mt-4 flex items-center gap-2" style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px', gap: '4px' }}>
              <ArrowDown size={14} /> 
              <span>12.4%</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>from last week</span>
          </div>
        </motion.div>

        {/* Transport KPI */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card"
        >
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Transit Output
            </span>
            <div style={{ background: 'var(--accent-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--accent)' }}>
              <Car size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <AnimatedCounter end={145} />
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>kg CO2</span>
          </div>
          <div className="mt-4 flex items-center gap-2" style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '12px', gap: '4px' }}>
              <ArrowUp size={14} /> 
              <span>5.2%</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>high commute load</span>
          </div>
        </motion.div>

        {/* Energy KPI */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card"
        >
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Home Energy
            </span>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '0.5rem', borderRadius: '10px', color: 'var(--warning)' }}>
              <Zap size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <AnimatedCounter end={98} />
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>kg CO2</span>
          </div>
          <div className="mt-4 flex items-center gap-2" style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px', gap: '4px' }}>
              <ArrowDown size={14} /> 
              <span>8.1%</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>LED upgrades active</span>
          </div>
        </motion.div>
      </div>

      {/* Main Chart Section */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start', marginBottom: '2rem' }}>
        {/* Trend Area Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card" 
          style={{ height: '440px', display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Emissions Analytics Trend</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Daily carbon cost variations over the active cycle.</p>
            </div>
            <div className="flex items-center gap-1" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Calendar size={14} />
              <span>June 7 - June 13</span>
            </div>
          </div>

          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.00}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.2)" fontSize={12} tickLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.2)" fontSize={12} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(13, 20, 38, 0.95)', 
                    backdropFilter: 'blur(16px)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    color: 'white'
                  }} 
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#chartGradient)" 
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Real-time Environmental Feed */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card"
          style={{ height: '440px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Emissions Activity Log</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Live updates of your carbon saving activities.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {activityLog.map((log) => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{log.activity}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.time}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 700, 
                    color: log.impact.startsWith('-') ? 'var(--success)' : 'var(--danger)' 
                  }}>
                    {log.impact}
                  </span>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: log.status === 'optimal' ? 'var(--primary)' : log.status === 'stable' ? 'var(--accent)' : 'var(--danger)'
                  }}>
                    {log.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
