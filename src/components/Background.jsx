import React from 'react';

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      
      {/* 1. ANIMATED GRADIENT (Deep Colors for readability) */}
      <div className="absolute inset-0 w-full h-full gradient-bg"></div>

      {/* 2. TEXTURE OVERLAY (Subtle Dots to reduce contrast issues) */}
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]"
        style={{
            backgroundImage: `radial-gradient(circle, #888 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
        }}
      ></div>

      {/* 3. CSS STYLES */}
      <style>{`
        /* Dark Mode Background: Very Deep Colors (So White Text Pops) */
        .gradient-bg {
          background: linear-gradient(-45deg, #000000, #0f172a, #1e1b4b, #020617);
          background-size: 400% 400%;
          animation: gradientMove 20s ease infinite;
        }

        /* Light Mode Background: Very Light Colors (So Black Text Pops) */
        :root:not(.dark) .gradient-bg {
           background: linear-gradient(-45deg, #ffffff, #f1f5f9, #e0f2fe, #f0fdf4);
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}