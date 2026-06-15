import React, { useEffect, useState, useCallback } from 'react';

const AnimatedCounter = ({ end, to, from = 0, duration = 2000, prefix = '', suffix = '' }) => {
  const target = to !== undefined ? to : end;
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(from + easeProgress * (target - from)));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup RAF on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, from, duration]);

  return <>{prefix}{count.toLocaleString()}{suffix}</>;
};

export default React.memo(AnimatedCounter);
