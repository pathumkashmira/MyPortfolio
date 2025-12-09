import React, { useState, useEffect } from 'react';

export default function Navbar({ onNavigate, currentPage, onSecretClick, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // --- Dark Mode Logic (Original) ---
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 🔥 FIX: සයිට් එක ක්‍රෑෂ් වෙන එක නවත්වන ෆන්ක්ෂන් එක
  const getSafeName = () => {
    try {
      if (!user) return "User";
      if (user.displayName) return user.displayName;
      if (user.email) return user.email.split('@')[0]; // මෙතන තමයි කලින් කැඩුනේ
      return "User";
    } catch (e) {
      return "User";
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'timeline', label: 'Journey' },
    { id: 'articles', label: 'Articles' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO SECTION --- */}
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-stone-900 dark:text-white select-none cursor-pointer" onClick={() => onNavigate('profile')}>
            <img 
                src="https://media.licdn.com/dms/image/v2/D4E03AQFdRsgOourY5A/profile-displayphoto-scale_200_200/B4EZqEAUJCJ0Ac-/0/1763151268578?e=1766620800&v=beta&t=YOS3Rs0HxNnuPx3hTa2zkHuHYl7Cf6iLS6WxFU-JD7s" 
                alt="PK" 
                className="w-8 h-8 rounded-full border border-stone-300 hover:scale-110 transition-transform"
            />
            <span>Pethum Kashmira</span>
          </div>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex gap-2 text-sm font-medium text-stone-500 dark:text-stone-400 items-center">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-emerald-600 transition-colors ${currentPage === item.id ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
              >
                {item.label}
              </button>
            ))}

            {/* Special Buttons */}
            <button onClick={() => onNavigate('fiverr-gigs')} className="btn-pulse group relative px-5 py-2 bg-emerald-600 text-white rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-all ml-2 flex items-center gap-2">
                <span>Services</span>
            </button>
            
            <button onClick={() => onNavigate('nft-drop')} className="ml-2 px-4 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors shadow-sm font-semibold border border-stone-700 flex items-center gap-1 text-xs">
                NFTs 🚀
            </button>

            {/* 🔥 LOGIN / USER BUTTON (FIXED) */}
            <button 
                onClick={() => { if(onSecretClick) onSecretClick(); }} 
                className={`ml-2 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-colors border ${user ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'border-stone-300 hover:bg-stone-200 dark:border-stone-600 dark:hover:bg-stone-700'}`}
            >
                {user ? (
                    <>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {getSafeName()} {/* මෙන්න මෙතන තමයි අපි අර Safe Function එක දැම්මේ */}
                    </>
                ) : (
                    <>👤 Login</>
                )}
            </button>

            {/* Dark Mode Button */}
            <button onClick={toggleDarkMode} className="ml-3 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 transition-colors">
                {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center gap-3">
             <button onClick={toggleDarkMode} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                {isDark ? '☀️' : '🌙'}
             </button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-stone-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>
          </div>
        </div>

        {/* --- MOBILE MENU DROPDOWN --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 glass-panel mt-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl">
             <div className="flex flex-col space-y-2 p-2">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                    className="text-left px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
                  >
                    {item.label}
                  </button>
                ))}
                
                <hr className="border-stone-200 dark:border-stone-700 my-2"/>
                
                <button onClick={() => { onNavigate('fiverr-gigs'); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-emerald-600 font-bold hover:bg-emerald-50 dark:hover:bg-stone-800 rounded-md">Services</button>
                <button onClick={() => { onNavigate('nft-drop'); setIsMobileMenuOpen(false); }} className="text-left px-3 py-2 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md">NFTs Collection 🚀</button>
                
                {/* Mobile Login Button (FIXED) */}
                <button 
                    onClick={() => { if(onSecretClick) onSecretClick(); setIsMobileMenuOpen(false); }} 
                    className="text-left px-3 py-2 text-stone-800 dark:text-white font-bold bg-stone-100 dark:bg-stone-700 rounded-md flex items-center gap-2"
                >
                    {user ? `👤 Hi, ${getSafeName()}` : '👤 Login / Join'}
                </button>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
}