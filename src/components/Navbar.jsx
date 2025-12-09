import React, { useState, useEffect } from 'react';

export default function Navbar({ onNavigate, currentPage, onSecretClick, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // --- Dark Mode Logic ---
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

  // 🔥 SAFE NAME FUNCTION
  const getSafeName = () => {
    try {
      if (!user) return "User";
      if (user.displayName) return user.displayName;
      if (user.email) return user.email.split('@')[0];
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
    <nav className="sticky top-0 z-50 bg-stone-50/90 dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO --- */}
          <div className="flex items-center gap-3 font-bold text-lg tracking-tight text-stone-900 dark:text-white select-none cursor-pointer group" onClick={() => onNavigate('profile')}>
            <div className="relative">
                {/* 🔥 FIXED: Navbar Logo Source changed to local asset */}
                <img 
                    src="/profile.png" 
                    alt="PK" 
                    className="w-9 h-9 rounded-full border-2 border-stone-300 dark:border-stone-600 group-hover:border-emerald-500 transition-colors duration-300 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full animate-pulse"></span>
            </div>
            <span className="group-hover:text-emerald-600 transition-colors">Pethum Kashmira</span>
          </div>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex gap-1 text-sm font-medium text-stone-600 dark:text-stone-400 items-center">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${currentPage === item.id ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-emerald-600'}`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-6 w-px bg-stone-300 dark:bg-stone-700 mx-2"></div>

            {/* Services Button */}
            <button onClick={() => onNavigate('fiverr-gigs')} className="group relative px-5 py-2 bg-stone-900 dark:bg-emerald-600 text-white rounded-full font-bold shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                    Services
                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </span>
            </button>
            
            {/* NFT Button */}
            <button onClick={() => onNavigate('nft-drop')} className="group ml-2 px-4 py-2 bg-white dark:bg-stone-800 text-stone-800 dark:text-white rounded-full hover:bg-stone-50 dark:hover:bg-stone-700 transition-all shadow-sm font-semibold border border-stone-200 dark:border-stone-700 flex items-center gap-2 text-xs">
                NFTs
                <svg className="w-4 h-4 text-purple-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16 8l2 2 14 14" />
                </svg>
            </button>

            {/* Login Button */}
            <button 
                onClick={() => { if(onSecretClick) onSecretClick(); }} 
                className={`ml-2 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all border ${user ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'border-stone-200 hover:border-emerald-400 hover:text-emerald-600'}`}
            >
                {user ? (
                    <>
                        <div className="relative">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                             </svg>
                             <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        </div>
                        {getSafeName()}
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                    </>
                )}
            </button>

            {/* Dark Mode Toggle (Desktop) */}
            <button onClick={toggleDarkMode} className="ml-2 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-amber-400 transition-colors relative overflow-hidden group">
                 <div className="relative w-5 h-5">
                    <svg className={`w-5 h-5 absolute transform transition-all duration-500 ${isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100 text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg className={`w-5 h-5 absolute transform transition-all duration-500 ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                 </div>
            </button>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center gap-3">
             
             {/* FIXED: Mobile Dark Mode Toggle (Now using SVG instead of Emoji) */}
             <button onClick={toggleDarkMode} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-amber-400 relative overflow-hidden group">
                <div className="relative w-6 h-6">
                    <svg className={`w-6 h-6 absolute transform transition-all duration-500 ${isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100 text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg className={`w-6 h-6 absolute transform transition-all duration-500 ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </div>
             </button>

             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-stone-500 hover:text-emerald-600 transition-colors">
                {isMobileMenuOpen ? (
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
             </button>
          </div>
        </div>

        {/* --- MOBILE MENU DROPDOWN --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 glass-panel mt-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 shadow-xl animate-fade-in-up">
             <div className="flex flex-col space-y-1 p-3">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                    className="text-left px-4 py-3 text-stone-600 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-800 hover:text-emerald-600 rounded-xl font-medium transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 bg-stone-300 rounded-full"></span>
                    {item.label}
                  </button>
                ))}
                
                <div className="h-px bg-stone-100 dark:bg-stone-800 my-2"></div>
                
                <button onClick={() => { onNavigate('fiverr-gigs'); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 text-emerald-600 font-bold bg-emerald-50/50 dark:bg-stone-800 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Services
                </button>

                <button onClick={() => { onNavigate('nft-drop'); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16 8l2 2 14 14" />
                    </svg>
                    NFTs Collection
                </button>
                
                <button 
                    onClick={() => { if(onSecretClick) onSecretClick(); setIsMobileMenuOpen(false); }} 
                    className="mt-2 text-left px-4 py-3 text-white font-bold bg-stone-900 dark:bg-emerald-700 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {user ? `Hi, ${getSafeName()}` : 'Login / Join'}
                </button>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
}