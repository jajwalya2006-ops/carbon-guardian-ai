'use client'
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, Target, Send, Bot, User, HelpCircle, ShieldAlert, Sparkles, TrendingDown, TreePine, Car } from 'lucide-react';
import { calculateTreeEquivalent, calculateCarMilesEquivalent } from '@/lib/carbonCalculations';

const SVGCircle = ({ percentage, color, icon: Icon }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px' }} aria-hidden="true">
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={`${color}33`}
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={28} color={color} />
      </div>
    </div>
  );
};

export default function CarbonTwin() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'chat'
  
  // Local chatbot states
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I am your Carbon Twin. I act as a digital replica of your environmental footprint. You can ask me how changes in your daily behavior will modify my projection profile. Try clicking one of the recommendation questions below!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickQuestions = [
    "How do I drop my baseline to 2.5 Tons?",
    "Tell me about my transit footprint.",
    "Which habit gives the biggest savings?"
  ];

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // 2. Trigger Typing Indicator
    setIsTyping(true);

    // 3. Simulated Response mapping
    setTimeout(() => {
      let replyText = "Based on your carbon profile, I recommend optimization of your home heating efficiency and lowering car commute by 20% to reach a better carbon grade.";
      
      const query = text.toLowerCase();
      if (query.includes('2.5') || query.includes('baseline')) {
        replyText = "To hit our Optimized Target of 2.5 Tons CO2/yr, we need to implement three core modifications: 1) Switch to LED bulbs (~45 kg CO2/mo), 2) Replace daily gasoline commute with public/active transit 2 days/week (~90 kg CO2/mo), and 3) Switch to vegetarian meals 3 days/week (~60 kg CO2/mo).";
      } else if (query.includes('transit') || query.includes('car')) {
        replyText = "Your transport profile represents 145 kg CO2 weekly (our highest segment!). Transitioning to a hybrid commuter model or using public transit could shave up to 35% of this value. I suggest checking out the simulator page to test target commute changes.";
      } else if (query.includes('habit') || query.includes('savings') || query.includes('biggest')) {
        replyText = "The single biggest impact area for your profile is commuter habits. Adjusting your daily driving distance or swapping to an electric vehicle reduces emissions by an estimated 1.5 Tons of CO2 annually. Second to that is transitioning to a vegetarian/flexitarian diet.";
      }

      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: replyText };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const savingsKg = 1700; // 4.2 - 2.5 = 1.7 Tons = 1700 kg
  const treesSaved = calculateTreeEquivalent(savingsKg);
  const milesSaved = calculateCarMilesEquivalent(savingsKg);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Carbon Twin AI</h1>
          <p style={{ color: 'var(--text-secondary)' }}>A digital avatar of your lifestyle, mapping carbon outcomes and behavioral variations.</p>
        </div>

        {/* Tab Toggle */}
        <div className="glass-panel flex gap-1" style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)' }} role="tablist" aria-label="Carbon Twin Views">
          <button
            onClick={() => setActiveTab('analytics')}
            className="btn"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            style={{
              padding: '0.4rem 1.2rem',
              fontSize: '0.85rem',
              background: activeTab === 'analytics' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'analytics' ? 'white' : 'var(--text-secondary)',
              borderRadius: '8px',
              fontWeight: activeTab === 'analytics' ? 600 : 500
            }}
          >
            Twin Analytics
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className="btn"
            role="tab"
            aria-selected={activeTab === 'chat'}
            style={{
              padding: '0.4rem 1.2rem',
              fontSize: '0.85rem',
              background: activeTab === 'chat' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'chat' ? 'white' : 'var(--text-secondary)',
              borderRadius: '8px',
              fontWeight: activeTab === 'chat' ? 600 : 500
            }}
          >
            Interact (AI Chat)
          </button>
        </div>
      </header>

      {/* Main Content Render */}
      <AnimatePresence mode="wait">
        {activeTab === 'analytics' ? (
          <motion.div
            key="analytics"
            role="tabpanel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-col gap-6"
            style={{ display: 'flex' }}
          >
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {/* Current Lifestyle */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Profile</span>
                  <span className="badge badge-danger">Unoptimized</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit', color: 'white' }}>4.2</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Tons CO2/yr</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                  Your carbon replica is currently modeled based on baseline habits (e.g. daily car commutes, standard thermostat settings).
                </p>
                
                {/* Visual Ring Representation */}
                <div style={{ 
                  marginTop: 'auto', 
                  height: '180px', 
                  background: 'rgba(239, 68, 68, 0.03)', 
                  border: '1px solid rgba(239, 68, 68, 0.08)',
                  borderRadius: 'var(--radius-sm)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative', 
                  overflow: 'hidden'
                }} aria-label="Visual representation of current profile - 100% capacity">
                  <SVGCircle percentage={100} color="var(--danger)" icon={ShieldAlert} />
                </div>
              </div>

              {/* 6-Month Projection */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>6-Month Outlook</span>
                  <span className="badge badge-warning">Trend Stable</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit', color: 'white' }}>3.8</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Tons CO2/yr</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                  Estimated projection baseline if minor voluntary home energy savings are consistently maintained.
                </p>
                
                {/* Visual Ring Representation */}
                <div style={{ 
                  marginTop: 'auto', 
                  height: '180px', 
                  background: 'rgba(245, 158, 11, 0.03)', 
                  border: '1px solid rgba(245, 158, 11, 0.08)',
                  borderRadius: 'var(--radius-sm)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative', 
                  overflow: 'hidden'
                }} aria-label="Visual representation of 6-month outlook - 90% capacity">
                  <SVGCircle percentage={90} color="var(--warning)" icon={TrendingDown} />
                </div>
              </div>

              {/* Optimized Target */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Optimized Target</span>
                  <span className="badge badge-success">Optimized</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--primary)' }}>2.5</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Tons CO2/yr</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                  Achievable profile carbon status mapping to maximum habit changes and green tech recommendations.
                </p>
                
                {/* Visual Ring Representation */}
                <div style={{ 
                  marginTop: 'auto', 
                  height: '180px', 
                  background: 'var(--primary-glow)', 
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  borderRadius: 'var(--radius-sm)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative', 
                  overflow: 'hidden'
                }} aria-label="Visual representation of optimized target - 60% capacity">
                  <SVGCircle percentage={60} color="var(--primary)" icon={Target} />
                </div>
              </div>
            </div>

            {/* Savings Callout Card */}
            <div className="glass-card flex items-center justify-between flex-wrap gap-6" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>What You Could Save</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px' }}>
                  Reaching your optimized target of 2.5 Tons CO2/yr would reduce your annual footprint by 1.7 Tons (1,700 kg). Here is what that means for the planet:
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="glass-panel text-center" style={{ padding: '1rem', minWidth: '140px', background: 'rgba(13, 20, 38, 0.5)' }}>
                  <div className="flex justify-center mb-2" style={{ color: 'var(--primary)' }}><TreePine size={24} aria-hidden="true" /></div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{treesSaved}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Trees Planted</div>
                </div>
                <div className="glass-panel text-center" style={{ padding: '1rem', minWidth: '140px', background: 'rgba(13, 20, 38, 0.5)' }}>
                  <div className="flex justify-center mb-2" style={{ color: 'var(--accent)' }}><Car size={24} aria-hidden="true" /></div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{milesSaved.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Miles Not Driven</div>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          /* ChatGPT style interface */
          <motion.div
            key="chat"
            role="tabpanel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-panel"
            style={{ 
              height: '580px', 
              display: 'flex', 
              flexDirection: 'column', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              background: 'rgba(13,20,38,0.45)'
            }}
          >
            {/* Chat Header */}
            <div style={{ 
              padding: '1.25rem 2rem', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.01)'
            }}>
              <div aria-hidden="true" style={{ 
                background: 'var(--primary-glow)', 
                padding: '0.5rem', 
                borderRadius: '50%', 
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Virtual Carbon Advisor</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online • Calibrated to Jane Doe profile</span>
              </div>
            </div>

            {/* Conversation Area */}
            <div 
              role="log" 
              aria-live="polite" 
              style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '0.75rem' 
                  }}
                >
                  {msg.sender === 'ai' && (
                    <div aria-hidden="true" style={{ background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '50%', color: 'var(--primary)' }}>
                      <Bot size={16} />
                    </div>
                  )}
                  <div style={{ 
                    maxWidth: '70%', 
                    padding: '0.85rem 1.25rem', 
                    borderRadius: '16px', 
                    fontSize: '0.925rem', 
                    lineHeight: 1.5,
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: msg.sender === 'user' 
                      ? '1px solid rgba(6, 182, 212, 0.2)' 
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    color: msg.sender === 'user' ? '#e2f8ff' : 'var(--text-primary)',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                  }}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div aria-hidden="true" style={{ background: 'var(--accent-glow)', padding: '6px', borderRadius: '50%', color: 'var(--accent)' }}>
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Loader bubble */}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.75rem' }} aria-label="AI is typing...">
                  <div aria-hidden="true" style={{ background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '50%', color: 'var(--primary)' }}>
                    <Bot size={16} />
                  </div>
                  <div className="typing-indicator" style={{ padding: '0.85rem 1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Cards */}
            <div style={{ padding: '0 2rem', display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem' }} aria-label="Quick questions">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="btn btn-glass"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <Sparkles size={12} color="var(--primary)" style={{ marginRight: '4px' }} aria-hidden="true" />
                  {q}
                </button>
              ))}
            </div>

            {/* Text Input area */}
            <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(0,0,0,0.1)' }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  aria-label="Message your virtual advisor"
                  placeholder="Ask your digital twin clone how behavior changes impact carbon score..."
                  className="form-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  style={{ flex: 1 }}
                />
                <button 
                  aria-label="Send message"
                  onClick={() => handleSendMessage(inputValue)}
                  className="btn btn-primary"
                  style={{ width: '46px', height: '42px', padding: 0, flexShrink: 0, borderRadius: 'var(--radius-sm)' }}
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
