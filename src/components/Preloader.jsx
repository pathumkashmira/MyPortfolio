import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // තත්පර 1.5 කින් Preloader එක අයින් වෙනවා
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-50 dark:bg-[#0c0a09] flex items-center justify-center transition-opacity duration-500">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-stone-200 dark:border-stone-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            
            <h2 className="text-xl font-bold text-stone-900 dark:text-white animate-pulse tracking-wider">
                Pethum Kashmira
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-mono">Loading Experience...</p>
        </div>
    </div>
  );
}