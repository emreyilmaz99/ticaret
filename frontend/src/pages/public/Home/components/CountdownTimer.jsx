// src/pages/public/Home/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';

/**
 * Countdown timer component for deal section
 */
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 43, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      fontSize: '20px', 
      fontWeight: '700', 
      color: '#ef4444' 
    }}>
      <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
      <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
};

export default CountdownTimer;
