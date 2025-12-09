import React, { useEffect, useRef, useState } from 'react';

// 👇 onNavigate එක මෙතනට ගත්තා
export default function Hero({ visitorCount, onNavigate }) {
  const cardRef = useRef(null);
  const [typingText, setTypingText] = useState('');
  
  useEffect(() => {
    const textToType = ["Agri-Business", "Financial Strategy", "Blockchain technology"];
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

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.transform = `perspective(1000px) rotateX(${((y - rect.height/2)/rect.height)*-10}deg) rotateY(${((x - rect.width/2)/rect.width)*10}deg) scale(1.02)`;
    };
    const handleLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section id="profile" className="min-h-[85vh] flex items-center justify-center pt-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
        
        <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase tracking-wide border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Open to Work & Collaboration
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 dark:text-white leading-tight">
                Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">{typingText}</span>
                <span className="cursor-blink text-stone-400">|</span><br />
                <span className="text-stone-500 dark:text-stone-400">NFTs</span> & <span className="text-indigo-600">Web3 Revolution</span>.
            </h1>
            
            <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                I am an undergraduate at the <strong>University of Ruhuna</strong> and a student at <strong>CA Sri Lanka</strong>. I combine traditional business acumen with modern digital innovation, exploring the intersection of Agriculture, Financial Strategy, and Blockchain Technology.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
                <a href="https://www.linkedin.com/in/pethum-kashmira/" target="_blank" rel="noreferrer" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5">
                    LinkedIn Profile
                </a>
                
                {/* 🔥 Button Fixed Here */}
                <button 
                    onClick={() => onNavigate('fiverr-gigs')} 
                    className="px-6 py-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-semibold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                >
                    Hire Me on Fiverr
                </button>

                <a href="http://linkedin.com/company/the-mind-spark-media" target="_blank" rel="noreferrer" className="px-6 py-3 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 border border-stone-700 flex items-center gap-2">
                    <span> Mind Spark Media </span>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                </a>
            </div>

            <div className="mt-6 flex items-center gap-3 animate-pulse">
                <div className="flex -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-stone-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt=""/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-stone-900 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt=""/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-stone-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64" alt=""/>
                </div>
                <div className="text-sm font-medium text-stone-600 dark:text-stone-300">
                    <span className="font-bold text-emerald-600 text-lg">{visitorCount || "Loading..."}</span> 
                    <span className="text-xs text-stone-400 block">People visited this profile</span>
                </div>
            </div>
        </div>

        <div className="md:col-span-5 relative">
            <div ref={cardRef} className="glass-panel rounded-2xl shadow-2xl relative z-10 overflow-hidden tilt-card transition-all duration-300">
                <div className="h-32 w-full bg-stone-200 dark:bg-stone-800">
                    <img src="https://media.licdn.com/dms/image/v2/D5616AQFAk5ilkB8lZw/profile-displaybackgroundimage-shrink_350_1400/B56ZgozRjVHQAY-/0/1753031221804?e=1766620800&v=beta&t=g9uBL94vYxGGxaorJ7Wu15ZaD8jQvCzAEvZGlR-e5GQ" alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="px-6 pb-6 relative">
                    <div className="-mt-12 mb-4">
                        <img src="https://media.licdn.com/dms/image/v2/D4E03AQFdRsgOourY5A/profile-displayphoto-scale_200_200/B4EZqEAUJCJ0Ac-/0/1763151268578?e=1766620800&v=beta&t=YOS3Rs0HxNnuPx3hTa2zkHuHYl7Cf6iLS6WxFU-JD7s" alt="Pethum" className="w-24 h-24 rounded-full border-4 border-white dark:border-stone-800 shadow-md object-cover bg-white" />
                    </div>
                    <div className="flex justify-between items-start mb-4 border-b border-stone-200 dark:border-stone-700 pb-4">
                        <div>
                            <h2 className="font-bold text-xl text-stone-900 dark:text-white">Pethum Kashmira</h2>
                            <p className="text-sm text-stone-500 dark:text-stone-400">Student, Crypto Enthusiast & Freelancer</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">AVAILABLE</span>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v11m0 0l-9-5 9-5 9 5m-9 5l-9-5 9-5 9 5"/></svg> 
                                University
                            </span>
                            <span className="font-medium text-right text-stone-900 dark:text-stone-200">University of Ruhuna</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg> 
                                Professional
                            </span>
                            <span className="font-medium text-right text-stone-900 dark:text-stone-200">CA Sri Lanka (Student)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.142a2.463 2.463 0 00-3.342-3.342L10 12l-5.618 5.618a2.463 2.463 0 003.342 3.342L12 16l5.618-5.618a2.463 2.463 0 00-3.342-3.342z"/></svg> 
                                Focus
                            </span>
                            <span className="font-medium text-right text-stone-900 dark:text-stone-200">Agri Business Mgt.</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> 
                                Location
                            </span>
                            <span className="font-medium text-right text-stone-900 dark:text-stone-200">Polonnaruwa, Sri Lanka</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}