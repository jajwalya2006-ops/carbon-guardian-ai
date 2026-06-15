'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Activity, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { calculateReduction, BASELINES } from '@/lib/carbonCalculations';

export default function Simulator() {
  const baseEmissions = 4200; // 4.2 tons in kg
  const [commute, setCommute] = useState(100); // 100% of current
  const [energy, setEnergy] = useState(100);
  const [diet, setDiet] = useState(100);

  // Real-time calculation using centralized engine
  const { transport: simTransport, energy: simEnergy, diet: simDiet, total: calculatedEmissions, savings } = calculateReduction(baseEmissions, commute, energy, diet);

  // Chart data
  const chartData = [
    { name: 'Transport', Baseline: BASELINES.transport, Simulated: simTransport },
    { name: 'Home Energy', Baseline: BASELINES.energy, Simulated: simEnergy },
    { name: 'Diet/Food', Baseline: BASELINES.diet, Simulated: simDiet },
  ];

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Reduction Simulator</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Adjust behavior levels to simulate environmental impact modifications.</p>
      </header>

      <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'stretch' }}>
        {/* Sliders Control Card */}
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.25rem', background: 'rgba(13,20,38,0.45)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SlidersHorizontal size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Simulation Parameters</h3>
          </div>

          {/* Commute Car Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label style={{ fontWeight: 600, fontSize: '0.925rem', color: 'white' }}>Commute by Car</label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.925rem' }}>{commute}% of baseline</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={commute} 
              onChange={(e) => setCommute(Number(e.target.value))} 
              className="form-input" 
            />
            <div className="flex justify-between mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>0% (Biking/Transit)</span>
              <span>100% (High driving)</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label style={{ fontWeight: 600, fontSize: '0.925rem', color: 'white' }}>Home Energy Usage</label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.925rem' }}>{energy}% of baseline</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="100" 
              value={energy} 
              onChange={(e) => setEnergy(Number(e.target.value))} 
              className="form-input" 
            />
            <div className="flex justify-between mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>50% (Eco Smart Home)</span>
              <span>100% (Standard HVAC)</span>
            </div>
          </div>

          {/* Diet Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label style={{ fontWeight: 600, fontSize: '0.925rem', color: 'white' }}>Meat Consumption</label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.925rem' }}>{diet}% of baseline</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={diet} 
              onChange={(e) => setDiet(Number(e.target.value))} 
              className="form-input" 
            />
            <div className="flex justify-between mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>0% (Vegan/Plant)</span>
              <span>100% (Daily meat consumption)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation Output & Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Summary Box */}
          <div className="glass-card" style={{ 
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.06) 100%)', 
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 2rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulated Footprint</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', color: 'white', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {(calculatedEmissions / 1000).toFixed(2)} 
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tons/yr</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Potential Savings</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {savings} kg CO2/yr
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="glass-card" style={{ flex: 1, padding: '2rem', height: '280px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Simulated Impact Breakdown</h3>
            <div style={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.2)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255, 255, 255, 0.2)" fontSize={11} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(13, 20, 38, 0.95)', 
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.12)' 
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Baseline" fill="rgba(255, 255, 255, 0.15)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
