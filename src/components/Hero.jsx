import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function Hero({ visitorCount, onNavigate }) {
  const [typingText, setTypingText] = useState('');
  const [time, setTime] = useState(new Date());
  const [latestArticle, setLatestArticle] = useState(null);

  // --- 1. Typing Effect ---
  useEffect(() => {
    const textToType = ["Agri-Business", "Financial Strategy", "Web3 Revolution"];
    let typeIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer;

    const typeWriter = () => {
      const currentText = textToType[typeIdx];
      if (isDeleting) {
        setTypingText(currentText.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setTypingText(currentText.substring(0, charIdx + 1));
        charIdx++;
      }
      let typeSpeed = isDeleting ? 100 : 150;
      if (!isDeleting && charIdx === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        typeIdx = (typeIdx + 1) % textToType.length;
        typeSpeed = 500;
      }
      timer = setTimeout(typeWriter, typeSpeed);
    };
    typeWriter();
    return () => clearTimeout(timer);
  }, []);

  // --- 2. Live Time ---
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- 3. Fetch Latest Article ---
  useEffect(() => {
    const fetchLatestArt = async () => {
      try {
        const q = query(collection(db, "articles"), orderBy("dateAdded", "desc"), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setLatestArticle(snap.docs[0].data());
        }
      } catch (e) { console.error(e); }
    };
    fetchLatestArt();
  }, []);

  // Skills for Marquee
  const skills = ["React.js", "Firebase", "Agri-Economics", "Financial Auditing", "Web3", "NFTs", "Strategic Planning", "Solidity", "Tailwind CSS"];

  return (
    <section className="min-h-screen flex flex-col justify-center py-10 px-4 animate-fade-in-up">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-8">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase tracking-wide border border-emerald-200 dark:border-emerald-800 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for Hire
         </div>
         <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 dark:text-white leading-tight">
            Hello, I'm <span className="text-emerald-600">Pethum</span>.<br/>
            <span className="text-2xl md:text-4xl font-semibold text-stone-500 dark:text-stone-400 mt-2 block">
                Exploring <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">{typingText}</span>
                <span className="cursor-blink">|</span>
            </span>
         </h1>
      </div>

      {/* INFINITE SKILL MARQUEE */}
      <div className="w-full overflow-hidden mb-10 opacity-70">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...skills, ...skills, ...skills].map((skill, i) => (
                <span key={i} className="text-xl font-bold text-stone-300 dark:text-stone-700 uppercase tracking-widest">{skill}</span>
            ))}
        </div>
        <style>{`
            .animate-marquee { animation: marquee 20s linear infinite; }
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        `}</style>
      </div>

      {/* 🔥 BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto w-full">
        
        {/* 1. ABOUT / BIO (2x2) */}
        <div onClick={() => onNavigate('about')} className="md:col-span-2 md:row-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {/* User SVG */}
                <svg className="w-32 h-32 text-stone-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                    <img src="/profile.png" alt="Profile" className="w-16 h-16 rounded-full border-2 border-stone-100 dark:border-stone-700 shadow-sm mb-4 object-cover" />
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">Who am I?</h3>
                    <p className="text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                        An undergraduate at <strong>University of Ruhuna</strong> & <strong>CA Sri Lanka</strong> student. 
                        I bridge the gap between Agri-Business, Financial Strategy, and the Web3 Revolution.
                    </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-3 transition-all">
                    Read Full Bio <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
            </div>
        </div>

        {/* 2. SERVICES (1x2 - TALL CARD & HIGHLIGHTED) 🔥 */}
        <div onClick={() => onNavigate('fiverr-gigs')} className="md:col-span-1 md:row-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-xl"></div>
            <div className="flex flex-col h-full justify-between relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm mb-4">
                    {/* Briefcase SVG */}
                    <svg className="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-1">Services</h3>
                    <p className="text-emerald-100 text-sm mb-4">Graphic Design & Consulting on Fiverr.</p>
                    <button className="w-full bg-white text-emerald-600 text-xs font-bold py-2 rounded-lg shadow hover:bg-emerald-50 transition-colors">
                        Hire Me Now
                    </button>
                </div>
            </div>
        </div>

        {/* 3. AIRDROPS (1x1 - LOWLIGHTED) 🔥 */}
        <div onClick={() => onNavigate('airdrops')} className="md:col-span-1 bg-stone-100 dark:bg-stone-800 rounded-3xl p-6 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer group flex flex-col justify-between border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">Earn Crypto</h3>
                {/* Rocket SVG */}
                <svg className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-stone-500 text-xs">Legit airdrops & earning guides.</p>
        </div>

        {/* 4. JOURNEY (1x1) */}
        <div onClick={() => onNavigate('timeline')} className="md:col-span-1 bg-amber-50 dark:bg-stone-800/50 border border-amber-200 dark:border-stone-700 rounded-3xl p-6 hover:bg-amber-100 dark:hover:bg-stone-700 transition-all cursor-pointer group flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">Journey</h3>
                {/* Academic Cap SVG */}
                <svg className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
             </div>
             <div>
                <p className="text-xs text-stone-500 mt-1">Education & Career Path</p>
                <span className="text-amber-600 font-bold text-xs mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">View Timeline →</span>
             </div>
        </div>

        {/* 5. LIVE TIME & LOCATION (1x1) */}
        <div className="md:col-span-1 bg-stone-900 dark:bg-stone-800 text-white rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-lg">
            <p className="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Local Time</p>
            <h3 className="text-2xl font-mono font-bold text-emerald-400 mb-2">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h3>
            <div className="flex items-center gap-1 text-xs text-stone-400">
                {/* Location SVG */}
                <svg className="w-3 h-3 text-red-500 animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Polonnaruwa, LK
            </div>
        </div>

        {/* 6. CONTACT (1x1) */}
        <div onClick={() => onNavigate('contact')} className="md:col-span-1 bg-rose-50 dark:bg-stone-800/50 border border-rose-200 dark:border-stone-700 rounded-3xl p-6 hover:bg-rose-100 dark:hover:bg-stone-700 transition-all cursor-pointer group flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">Contact</h3>
                {/* Mail SVG */}
                <svg className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             </div>
             <div>
                <p className="text-xs text-stone-500 mt-1">Let's work together</p>
                <span className="text-rose-600 font-bold text-xs mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">Get in Touch →</span>
             </div>
        </div>

        {/* 7. LINKEDIN CARD (1x1) - Restored to Card Style */}
        <a href="https://www.linkedin.com/in/pethum-kashmira/" target="_blank" rel="noreferrer" className="md:col-span-1 bg-[#0077b5] text-white rounded-3xl p-6 hover:opacity-90 transition-all flex flex-col justify-center items-center gap-2 group">
            {/* LinkedIn SVG */}
            <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span className="font-bold">Connect on LinkedIn</span>
        </a>

        {/* 8. GITHUB CARD (1x1) */}
        <a href="https://github.com/pathumkashmira" target="_blank" rel="noreferrer" className="md:col-span-1 bg-stone-800 text-white rounded-3xl p-6 hover:bg-black transition-all flex flex-col justify-center items-center gap-2 group">
            {/* GitHub SVG */}
            <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span className="font-bold">GitHub Profile</span>
        </a>

        {/* 9. ARTICLES (4x1 - Full Width Strip) */}
        <div onClick={() => onNavigate('articles')} className="md:col-span-4 bg-stone-50 dark:bg-stone-800/50 border border-dashed border-stone-300 dark:border-stone-700 rounded-3xl p-6 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center shadow-sm">
                    {/* Pen SVG */}
                    <svg className="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">Latest Insight from the Blog</h3>
                    {latestArticle ? (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 group-hover:underline">
                            "{latestArticle.title}"
                        </p>
                    ) : (
                        <p className="text-sm text-stone-400 mt-1">Stay tuned for updates.</p>
                    )}
                </div>
            </div>
            <div className="hidden md:block">
                <span className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold group-hover:scale-105 transition-transform">
                    Read All Articles
                </span>
            </div>
        </div>

      </div>

      {/* VISITOR COUNT */}
      <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-900 rounded-full text-xs font-mono text-stone-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {visitorCount} Visits
          </div>
      </div>

    </section>
  );
}