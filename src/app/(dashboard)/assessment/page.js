'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Car, Zap, Coffee, ShieldCheck, HelpCircle } from 'lucide-react';
import { calculateFootprint } from '@/lib/carbonCalculations';
import { validateNumericInput, sanitizeInput } from '@/lib/security';

export default function CarbonCalculator() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Form states to enable real-time feedback calculation
  const [commuteType, setCommuteType] = useState('Car (Gasoline)');
  const [commuteDistance, setCommuteDistance] = useState('');
  const [flights, setFlights] = useState('');
  const [energyBill, setEnergyBill] = useState('');
  const [heatingSource, setHeatingSource] = useState('Natural Gas');
  const [diet, setDiet] = useState('Omnivore (Meat daily)');
  const [clothing, setClothing] = useState('Monthly');

  // Real-time calculation formula using centralized engine
  const getEstimatedEmissions = () => {
    const footprint = calculateFootprint({
      commuteType: sanitizeInput(commuteType) || 'Car (Gasoline)',
      commuteDistance: validateNumericInput(commuteDistance, 0, 10000).value,
      flights: validateNumericInput(flights, 0, 1000).value,
      energyBill: validateNumericInput(energyBill, 0, 100000).value,
      heatingSource: sanitizeInput(heatingSource) || 'Natural Gas',
      diet: sanitizeInput(diet) || 'Omnivore (Meat daily)',
      clothing: sanitizeInput(clothing) || 'Monthly'
    });
    return footprint.toFixed(1);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else setCompleted(true);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (completed) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card text-center" 
          style={{ padding: '4.5rem 2.5rem', border: '1px solid rgba(16, 185, 129, 0.25)' }}
        >
          <div style={{
            background: 'var(--primary-glow)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <CheckCircle size={48} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Assessment Complete</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem' }}>
            We've mapped your lifestyle to your virtual digital twin profile.
          </p>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2.5rem'
          }}>
            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Your Annual Baseline
            </span>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--primary)', lineHeight: 1 }}>
              {getEstimatedEmissions()} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tons CO2/yr</span>
            </div>
          </div>
          
          <button className="btn btn-primary btn-lg w-full" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
    })
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 0' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Carbon Assessment</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Provide your lifestyle habits to establish your environmental digital twin.</p>
      </header>

      {/* Stepper Progress Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', background: 'rgba(13,20,38,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Stepper Line Background */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 1, transform: 'translateY(-50%)' }} />
          {/* Stepper Line Progress */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            width: step === 1 ? '0%' : step === 2 ? '50%' : '100%', 
            height: '2px', 
            background: 'var(--primary)', 
            zIndex: 1, 
            transform: 'translateY(-50%)',
            transition: 'width 0.4s ease'
          }} />

          {/* Steps */}
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ 
              zIndex: 2, 
              background: s < step ? 'var(--primary)' : s === step ? 'var(--secondary)' : 'var(--bg-color)', 
              border: `2px solid ${s <= step ? 'var(--primary)' : 'rgba(255,255,255,0.12)'}`,
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: s <= step ? 'white' : 'var(--text-muted)',
              boxShadow: s === step ? '0 0 15px var(--primary-glow-strong)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {s < step ? '✓' : s}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: step === 1 ? 600 : 500, color: step === 1 ? 'white' : 'inherit' }}>Transportation</span>
          <span style={{ fontWeight: step === 2 ? 600 : 500, color: step === 2 ? 'white' : 'inherit' }}>Home & Energy</span>
          <span style={{ fontWeight: step === 3 ? 600 : 500, color: step === 3 ? 'white' : 'inherit' }}>Food & Shopping</span>
        </div>
      </div>

      <div className="grid gap-8" style={{ gridTemplateColumns: '7fr 4fr', alignItems: 'start' }}>
        {/* Wizard Form */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleNext}>
            <AnimatePresence mode="wait" custom={step}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary-glow)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
                      <Car size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Transportation Habits</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">How do you primarily commute?</label>
                    <select className="form-input" value={commuteType} onChange={(e) => setCommuteType(e.target.value)}>
                      <option>Car (Gasoline)</option>
                      <option>Car (Electric)</option>
                      <option>Public Transit</option>
                      <option>Bicycle / Walk</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Average daily commute distance (km)?</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 15" 
                      value={commuteDistance} 
                      onChange={(e) => setCommuteDistance(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Flights taken in the last year?</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 2" 
                      value={flights} 
                      onChange={(e) => setFlights(e.target.value)} 
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(245,158,11,0.12)', padding: '0.5rem', borderRadius: '8px', color: 'var(--warning)' }}>
                      <Zap size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Home Energy & Water</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Average monthly electricity bill ($)?</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 80" 
                      value={energyBill} 
                      onChange={(e) => setEnergyBill(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary heating source?</label>
                    <select className="form-input" value={heatingSource} onChange={(e) => setHeatingSource(e.target.value)}>
                      <option>Natural Gas</option>
                      <option>Electric</option>
                      <option>Oil</option>
                      <option>Other</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--accent-glow)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent)' }}>
                      <Coffee size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Food & Shopping</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dietary preference?</label>
                    <select className="form-input" value={diet} onChange={(e) => setDiet(e.target.value)}>
                      <option>Omnivore (Meat daily)</option>
                      <option>Flexitarian (Meat occasionally)</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">How often do you buy new clothing?</label>
                    <select className="form-input" value={clothing} onChange={(e) => setClothing(e.target.value)}>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Rarely</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}
              
              <button type="submit" className="btn btn-primary">
                {step === 3 ? 'Complete Assessment' : 'Next Step'} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Real-time Estimate Card */}
        <div className="glass-card" style={{ background: 'rgba(13,20,38,0.45)', padding: '2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--primary)" /> Live Estimation Preview
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Our AI engine dynamically computes your score in real-time as you fill out the wizard.
          </p>

          <div style={{ 
            background: 'var(--secondary)', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--glass-border)',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Footprint</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--primary)', marginTop: '0.25rem' }}>
              {getEstimatedEmissions()}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '4px', fontWeight: 500 }}>Tons/yr</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div className="flex justify-between" style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <span>Commute Factor:</span>
              <span style={{ color: 'white', fontWeight: 600 }}>{commuteType.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between" style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <span>Dietary Profile:</span>
              <span style={{ color: 'white', fontWeight: 600 }}>{diet.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Energy Heating:</span>
              <span style={{ color: 'white', fontWeight: 600 }}>{heatingSource}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
