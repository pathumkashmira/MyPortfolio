import React, { useEffect, useState } from 'react';

export default function Expertise() {
  
  const [showCV, setShowCV] = useState(false);

  // --- Data: Cards ---
  const expertiseCards = [
    {
      title: "BSc (Hons) in Agri Business Management",
      desc: "Reading for a BSc (Hons) in Agri Business Management at the University of Ruhuna. Specializing in sustainable supply chain strategies and farm economics.",
      img: "https://www.buhave.com/guide/wp-content/uploads/2025/05/University-of-Ruhuna.webp"
    },
    {
      title: "Chartered Accountancy",
      desc: "Reading for the Chartered Accountant qualification at CA Sri Lanka. Mastering financial reporting, statutory auditing, and taxation strategies.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp_DARSOSHJ9wYfV1NPhGks-HzpBjFoxnjsA&s"
    },
    {
      title: "Freelancer (Fiverr)",
      desc: "Founder of 'The Mind Spark Media'. Specializing in brand identity, digital marketing materials, and creative design solutions.",
      img: "https://cdn.prod.website-files.com/606a802fcaa89bc357508cad/62291b5f923ec472a68d77ea_Blog%20-%201%20(2).png"
    },
    {
      title: "Web3 & Blockchain Technology",
      desc: "Deeply immersed in the decentralized economy. Expertise in analyzing tokenomics, DeFi protocols, NFT ecosystems, and airdrop strategies.",
      img: "https://www.menosfios.com/wp-content/uploads/2023/07/web-3.0.jpg"
    }
  ];

  const skills = [
    { name: "Agri Business", type: "core" },
    { name: "Financial Analysis", type: "finance" },
    { name: "Auditing", type: "finance" },
    { name: "Crypto Trading", type: "tech" },
    { name: "Airdrop Hunting", type: "tech" },
    { name: "Graphic Design", type: "design" },
    { name: "Brand Identity", type: "design" },
    { name: "Strategic Planning", type: "core" }
  ];

  const colors = {
    core: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    finance: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    tech: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
    design: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="page-about" className="page-section">
      <section className="max-w-6xl mx-auto pt-10 px-4">
        
        {/* PERSONAL INTRO SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-16 reveal">
            <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <img 
                        src="/about.png" 
                        alt="Pethum Kashmira" 
                        className="relative w-64 h-64 rounded-full object-cover border-4 border-white dark:border-stone-800 shadow-2xl z-10"
                    />
                    {/* CV Download Button (Moved Here) */}
                    <button 
                        onClick={() => setShowCV(true)}
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-900 hover:bg-black text-white px-6 py-2 rounded-full shadow-xl border border-stone-700 z-20 flex items-center gap-2 whitespace-nowrap transition-transform hover:scale-105"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download CV
                    </button>
                </div>
            </div>
            
            <div className="w-full md:w-2/3 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-6 leading-tight">
                    Hi, I'm <span className="text-emerald-600">Pethum Kashmira</span>.
                </h2>
                <div className="space-y-4 text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                    <p>
                        I am a multidisciplinary professional bridging the gap between traditional industries and the digital future. 
                        As an undergraduate at the <strong className="text-stone-900 dark:text-white">University of Ruhuna</strong> and a student at <strong className="text-stone-900 dark:text-white">CA Sri Lanka</strong>, 
                        I possess a unique blend of agricultural insight and financial acumen.
                    </p>
                    <p>
                        Beyond academics, I am a passionate <strong className="text-indigo-500">Web3 Enthusiast</strong> and <strong className="text-indigo-500">Graphic Designer</strong>. 
                        I believe in the power of blockchain to revolutionize finance and ownership, and I actively participate in this ecosystem through trading, airdrop hunting, and community building.
                    </p>
                </div>
            </div>
        </div>

        {/* PURPOSE OF THE WEBSITE */}
        <div className="mb-16 reveal">
            <div className="bg-stone-900 dark:bg-stone-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="bg-emerald-500 p-2 rounded-lg text-white">🎯</span>
                        Why This Platform?
                    </h3>
                    <p className="text-stone-300 text-lg mb-8 max-w-3xl">
                        This website serves as my digital headquarters. It wasn't built just to showcase a portfolio, but to achieve three main goals:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                            <h4 className="font-bold text-emerald-400 mb-2">01. Share Knowledge</h4>
                            <p className="text-sm text-stone-400">To publish insights on Agri-Business trends, Financial strategies, and the latest in Crypto/Web3.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                            <h4 className="font-bold text-blue-400 mb-2">02. Empower Community</h4>
                            <p className="text-sm text-stone-400">To provide legitimate, step-by-step guides for Airdrops and digital earning opportunities for everyone.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                            <h4 className="font-bold text-purple-400 mb-2">03. Offer Services</h4>
                            <p className="text-sm text-stone-400">To connect with clients globally and provide top-tier Graphic Design & Consultation services.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* EXPERTISE CARDS */}
        <div className="text-center mb-10 reveal">
          <h3 className="text-2xl font-bold text-stone-900 dark:text-white">Areas of Expertise</h3>
          <p className="text-stone-500 dark:text-stone-400 mt-2">Where my passion meets proficiency.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {expertiseCards.map((card, index) => (
            <div 
              key={index} 
              className="reveal expertise-card bg-white dark:bg-stone-900 rounded-xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-800 transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="h-36 w-full bg-stone-100 overflow-hidden relative group">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-md text-stone-900 dark:text-white mb-1">{card.title}</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COMPETENCY CLOUD */}
        <div className="reveal bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm text-center">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Core Competencies</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {skills.map((skill, index) => (
              <span key={index} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${colors[skill.type]} transition-transform hover:scale-105 cursor-default`}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* CV MODAL */}
      {showCV && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setShowCV(false)}>
          <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center bg-stone-50 dark:bg-stone-800">
                <h3 className="font-bold text-lg dark:text-white">My Curriculum Vitae</h3>
                <div className="flex gap-2">
                    <a href="/cv.pdf" download className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">Download PDF</a>
                    <button onClick={() => setShowCV(false)} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full">✕</button>
                </div>
            </div>
            <div className="flex-1 bg-stone-100 dark:bg-stone-950">
                <iframe src="/cv.pdf#toolbar=0" className="w-full h-full" title="CV Preview"></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}