import React from 'react';

const StudentPoster = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-10">
      
      {/* --- POSTER CONTAINER --- */}
      <div className="relative w-[450px] h-[650px] bg-gradient-to-br from-emerald-600 to-teal-900 rounded-[40px] shadow-[0_20px_50px_rgba(16,185,129,0.5)] overflow-hidden text-white p-8 flex flex-col justify-between border-4 border-emerald-500/30 relative">
        
        {/* Glow Effects */}
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        {/* 1. TOP BADGE & TITLE */}
        <div className="z-10 text-center mt-4">
            <span className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/30 shadow-lg text-emerald-100">
                🎓 Student Special
            </span>
            <h1 className="text-5xl font-black leading-none mb-2 drop-shadow-2xl font-sans tracking-tight">
                DIGITAL <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">PORTFOLIO</span>
            </h1>
            <p className="text-emerald-100/80 text-sm font-medium tracking-wide mt-3">Showcase your skills. Land your dream job.</p>
        </div>

        {/* 2. PRICE TAG */}
        <div className="z-10 text-center relative py-4">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full transform scale-75"></div>
            <div className="relative text-7xl font-black text-white drop-shadow-xl tracking-tighter">
                $40
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1 bg-black/20 inline-block px-4 py-1 rounded-lg backdrop-blur-sm">
                LKR 6,000/=
            </div>
        </div>

        {/* 3. FEATURES LIST */}
        <div className="z-10 bg-black/20 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/20 shadow-inner">
            <ul className="space-y-4">
                {[
                    "One Page Professional CV Site",
                    "Fully Mobile Responsive 📱",
                    "Contact & Social Media Links",
                    "Super Fast Loading Speed ⚡",
                    "Free Source Code Included 💻"
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-white/90">
                        <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-900 text-xs shadow-lg shadow-emerald-500/50">✓</div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* 4. FOOTER / CTA */}
        <div className="z-10 text-center mb-2">
            <div className="w-full py-4 bg-white text-emerald-900 font-black text-lg rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                Order Now
            </div>
            <div className="flex justify-between items-center mt-6 px-2 opacity-60">
                <span className="text-[10px] uppercase font-bold tracking-widest">Pethum Kashmira</span>
                <span className="text-[10px] font-mono">Ver 3.0</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StudentPoster;
      
