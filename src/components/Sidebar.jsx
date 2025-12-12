import React, { useState, useEffect } from 'react';

export default function Sidebar({ onNavigate, currentPage, onSecretClick, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  const getSafeName = () => {
    try {
      if (!user) return "Guest";
      if (user.displayName) return user.displayName;
      if (user.email) return user.email.split('@')[0];
      return "User";
    } catch (e) { return "User"; }
  };

  const navItems = [
    { id: 'profile', label: 'Home', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    
    // 🔥 RENAMED TO ABOUT ME
    { id: 'about', label: 'About Me', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    
    { id: 'timeline', label: 'Journey', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
    { id: 'articles', label: 'Articles', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /> },
    { id: 'airdrops', label: 'Airdrops', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
    { id: 'fiverr-gigs', label: 'Services', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
    { id: 'nft-drop', label: 'NFTs', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: 'contact', label: 'Contact', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> }
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <img src="/profile.png" alt="Logo" className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-600" />
            <span className="font-bold text-stone-900 dark:text-white text-sm">Pethum Kashmira</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 dark:text-stone-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/95 dark:bg-[#0c0a09]/95 backdrop-blur-xl border-r border-stone-200 dark:border-stone-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:flex flex-col`}>
        <div className="h-20 flex items-center px-6 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate('profile')}>
                <div className="relative">
                    <img src="/profile.png" alt="PK" className="w-10 h-10 rounded-full border-2 border-stone-200 dark:border-stone-700 group-hover:border-emerald-500 transition-all" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full animate-pulse"></span>
                </div>
                <div>
                    <h1 className="font-bold text-stone-900 dark:text-white leading-tight">Pethum</h1>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono tracking-wider">PORTFOLIO</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${currentPage === item.id 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
                    }`}
                >
                    <svg className={`w-5 h-5 transition-colors ${currentPage === item.id ? 'text-emerald-500' : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {item.icon}
                    </svg>
                    {item.label}
                    {currentPage === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <button onClick={toggleDarkMode} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                <span className="flex items-center gap-2">
                    {isDark ? (
                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isDark ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? 'left-4.5 translate-x-full' : 'left-0.5'}`}></div>
                </div>
            </button>

            <button onClick={() => { if(onSecretClick) onSecretClick(); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${user ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-stone-900 dark:bg-white text-white dark:text-black hover:opacity-90'}`}>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="opacity-70 font-normal text-[10px]">{user ? 'Signed in as' : 'Admin Access'}</span>
                    <span>{getSafeName()}</span>
                </div>
            </button>
        </div>
      </aside>

      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </>
  );
}