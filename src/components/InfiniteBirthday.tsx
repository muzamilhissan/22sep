"use client";
import React, { useState, useEffect, useRef } from "react";

export default function InfiniteBirthday() {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const emojis = ["🎂", "🥳", "🎉", "💖", "✨", "🌸", "🎁", "🎈"];

  useEffect(() => {
    // Start interval
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Keep scrolled to bottom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [count]);

  const displayCount = Math.min(count, 40);
  
  return (
    <section style={{ padding: '3rem 1rem', background: 'linear-gradient(135deg, #ffe6f2 0%, #ffcce6 100%)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '900', 
          color: '#ff1a75', 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          lineHeight: '1.2'
        }}>
          Infinite Birthday Wishes! ♾️
        </h2>
        
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '1.5rem',
          background: '#ff1a75',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.6rem 1.5rem',
          borderRadius: '9999px',
          boxShadow: '0 4px 12px rgba(255, 26, 117, 0.4)'
        }}>
          <span>Times written:</span>
          <span style={{ fontSize: '1.4rem', fontFamily: 'monospace' }}>{count.toLocaleString()}</span>
        </div>

        <div 
          ref={containerRef}
          style={{
            height: '280px',
            overflowY: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '1rem',
            boxShadow: '0 10px 25px rgba(255, 26, 117, 0.15)',
            border: '3px solid #ff99c2',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {count === 0 && (
            <div style={{ color: '#ff66a3', fontStyle: 'italic', marginTop: 'auto', marginBottom: 'auto' }}>
              Starting the endless wishes...
            </div>
          )}
          {Array.from({ length: displayCount }).map((_, i) => {
            const actualIndex = count - displayCount + i;
            const emoji = emojis[actualIndex % emojis.length];
            const isLatest = i === displayCount - 1;
            
            return (
              <div 
                key={actualIndex} 
                style={{ 
                  color: isLatest ? '#ff0066' : '#ff4d94', 
                  fontWeight: isLatest ? '800' : '600',
                  fontSize: isLatest ? '1.2rem' : '1.1rem',
                  opacity: Math.max(0.2, 1 - ((displayCount - 1 - i) * 0.05)),
                  transition: 'all 0.1s ease',
                  textAlign: 'left',
                  paddingLeft: '1rem'
                }}
              >
                <span style={{ display: 'inline-block', width: '3rem', fontFamily: 'monospace', color: '#ff99c2', fontSize: '0.9rem' }}>
                  #{actualIndex + 1}
                </span>
                Happy Birthday Eraj {emoji}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
