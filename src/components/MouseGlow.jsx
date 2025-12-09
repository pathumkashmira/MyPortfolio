import React, { useState, useEffect } from 'react';

export default function MouseGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 1. Main Glow (Emerald - Theme Color) */}
      <div
        className="absolute inset-0 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`,
        }}
      ></div>

      {/* 2. Secondary Glow (Blue - For Depth) */}
      <div
        className="absolute inset-0 transition duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 30%)`,
        }}
      ></div>
    </div>
  );
}