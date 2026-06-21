'use client'
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, Shield, Award, Crown } from 'lucide-react';

export default function Leaderboard() {
  const users = useMemo(() => [
    { rank: 1, name: 'EcoQueen', points: 3450, trend: 'up', color: '#f59e0b', trophyType: 'gold' },
    { rank: 2, name: 'GreenMachine', points: 3200, trend: 'up', color: '#94a3b8', trophyType: 'silver' },
    { rank: 3, name: 'PlanetSaver', points: 2950, trend: 'down', color: '#b45309', trophyType: 'bronze' },
    { rank: 4, name: 'You (Carbon Guardian)', points: 2840, trend: 'up', isUser: true },
    { rank: 5, name: 'SustainableSteve', points: 2600, trend: 'down' },
  ], []);

  // Separate podium users and standard list users in a single pass O(N)
  const { podiumOrder } = useMemo(() => {
    const topThree = [];
    const remaining = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].rank <= 3) topThree.push(users[i]);
      else remaining.push(users[i]);
    }

    // Reorder top three for visual podium (2nd, 1st, 3rd)
    const order = [
      topThree.find(u => u.rank === 2),
      topThree.find(u => u.rank === 1),
      topThree.find(u => u.rank === 3)
    ];

    return { topThree, remaining, podiumOrder: order };
  }, [users]);

  return (
    <div style={{ padding: '0.5rem 0', maxWidth: '850px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Community Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Compare your points with other environmental guardians globally.</p>
      </header>

      {/* Top 3 Podium Displays */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        gap: '1.5rem', 
        marginBottom: '3.5rem', 
        paddingTop: '2rem' 
      }}>
        {podiumOrder.map((user) => {
          if (!user) return null;
          
          const isFirst = user.rank === 1;
          const height = isFirst ? '160px' : user.rank === 2 ? '130px' : '110px';
          
          return (
            <motion.div 
              key={user.rank}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: user.rank * 0.1 }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '120px'
              }}
            >
              {/* Avatar Indicator */}
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                {isFirst && (
                  <Crown size={22} color="#f59e0b" style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)' }} />
                )}
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: isFirst 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                    : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                  border: `2px solid ${user.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: isFirst ? 'black' : 'white',
                  fontSize: '1.1rem',
                  boxShadow: isFirst ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none'
                }}>
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '-5px',
                  background: user.color,
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: 'black'
                }}>
                  {user.rank}
                </div>
              </div>

              {/* User name label */}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {user.points} pts
              </span>

              {/* Podium Block */}
              <div className="glass-panel" style={{ 
                width: '100%', 
                height: height, 
                borderBottomLeftRadius: 0, 
                borderBottomRightRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                background: isFirst ? 'rgba(245,158,11,0.08)' : 'rgba(13,20,38,0.6)',
                border: `1px solid ${isFirst ? 'rgba(245,158,11,0.2)' : 'var(--glass-border)'}`
              }}>
                <Trophy size={isFirst ? 28 : 20} color={user.color} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Standard Ranking List */}
      <div className="glass-panel" style={{ overflow: 'hidden', background: 'rgba(13,20,38,0.45)' }}>
        {users.map((user, i) => {
          const isTop3 = user.rank <= 3;
          return (
            <motion.div 
              key={user.rank} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1.25rem 2rem',
                borderBottom: i !== users.length - 1 ? '1px solid var(--glass-border)' : 'none',
                background: user.isUser ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                borderLeft: user.isUser ? '4px solid var(--primary)' : '4px solid transparent',
                transition: 'background-color 0.3s'
              }}
            >
              {/* Rank column */}
              <div style={{ 
                width: '50px', 
                fontWeight: 800, 
                fontSize: '1.15rem', 
                color: isTop3 ? user.color : 'var(--text-muted)' 
              }}>
                #{user.rank}
              </div>

              {/* Name & Badge column */}
              <div style={{ 
                flex: 1, 
                fontWeight: user.isUser ? 700 : 500, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.65rem',
                color: user.isUser ? 'white' : 'var(--text-primary)'
              }}>
                {user.isUser && <Shield size={14} color="var(--primary)" />}
                {user.name}
              </div>

              {/* Points column */}
              <div style={{ fontWeight: 800, fontFamily: 'Outfit', fontSize: '1.15rem', color: 'white', marginRight: '2rem' }}>
                {user.points} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>pts</span>
              </div>

              {/* Trend Arrow column */}
              <div style={{ 
                width: '30px', 
                display: 'flex', 
                justifyContent: 'flex-end', 
                color: user.trend === 'up' ? 'var(--success)' : 'var(--danger)' 
              }}>
                {user.trend === 'up' ? (
                  <div style={{ background: 'rgba(16,185,129,0.12)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                    <ArrowUp size={14} />
                  </div>
                ) : (
                  <div style={{ background: 'rgba(239,68,68,0.12)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                    <ArrowDown size={14} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
