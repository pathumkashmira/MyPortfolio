import React, { useEffect, useRef, useState } from 'react';

export default function Hero({ visitorCount, onNavigate }) {
  const cardRef = useRef(null);
  const [typingText, setTypingText] = useState('');
  
  // 👇 Popup State
  const [showCV, setShowCV] = useState(false);
  
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
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Open to Work & Collaboration
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
                
                <button 
                    onClick={() => onNavigate('fiverr-gigs')} 
                    className="px-6 py-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-semibold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                >
                    Hire Me on Fiverr
                </button>

                <button 
                    onClick={() => setShowCV(true)}
                    className="px-6 py-3 bg-stone-800 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 border border-stone-700 flex items-center gap-2 group cursor-pointer"
                >
                    <span> View My CV </span>
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                </button>
            </div>

            <div className="mt-6 flex items-center gap-3">
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
                    <img src="/cover.png" alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="px-6 pb-6 relative">
                    <div className="-mt-12 mb-4">
                        <img src="/profile.png" alt="Pethum" className="w-24 h-24 rounded-full border-4 border-white dark:border-stone-800 shadow-md object-cover bg-white" />
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

      {/* 👇 CV Modal Popup */}
      {showCV && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowCV(false)}
        >
          <div 
            className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-stone-900 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
              <h3 className="text-lg font-bold text-stone-800 dark:text-white flex items-center gap-2">
                Curriculum Vitae
              </h3>
              
              <div className="flex items-center gap-3">
                {/* Download Button */}
                <a 
                    href="/Pethum_Kashmira_CV.pdf" 
                    download="Pethum_Kashmira_CV.pdf"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-105"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span className="hidden sm:inline">Download</span>
                </a>

                {/* Close Button */}
                <button 
                    onClick={() => setShowCV(false)}
                    className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full text-stone-500 dark:text-stone-400 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 bg-stone-200 dark:bg-stone-950 relative">
              
              {/* 🔥 Desktop View: Embed PDF */}
              <iframe 
                src="/Pethum_Kashmira_CV.pdf#toolbar=0"
                className="hidden md:block w-full h-full border-none" 
                title="CV Preview"
              ></iframe>

              {/* 🔥 Mobile View: Fallback Message */}
              <div className="md:hidden w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 dark:bg-stone-900">
                <div className="w-16 h-16 bg-stone-300 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <svg className="w-8 h-8 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h4 className="text-lg font-bold text-stone-800 dark:text-white mb-2">
                    PDF Preview Not Available
                </h4>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-xs">
                    Mobile browsers cannot embed PDF files directly. Please open the file to view.
                </p>
                <a 
                    href="/Pethum_Kashmira_CV.pdf" 
                    target="_blank"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                    Open PDF File
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}