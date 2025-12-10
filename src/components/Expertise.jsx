import React, { useEffect } from 'react';

export default function Expertise() {
  
  // --- Data: Cards ---
  const expertiseCards = [
    {
      title: "BSc (Hons) in Agri Business Management",
      desc: "Reading for a BSc (Hons) in Agri Business Management at the University of Ruhuna. Specializing in sustainable supply chain strategies, farm economics, and the integration of modern technology to optimize agricultural resources.",
      img: "https://www.buhave.com/guide/wp-content/uploads/2025/05/University-of-Ruhuna.webp"
    },
    {
      title: "Finance & Audit",
      desc: "Reading for the Chartered Accountant qualification at CA Sri Lanka. Building a rigorous academic foundation in corporate financial reporting, statutory auditing, and taxation. My goal is to master the analytical skills needed to ensure financial compliance and drive strategic fiscal decisions.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp_DARSOSHJ9wYfV1NPhGks-HzpBjFoxnjsA&s"
    },
    {
      title: "Freelancer",
      desc: "Founder of 'The Mind Spark Media' and a rated Seller on Fiverr. I translate complex ideas into compelling visual narratives. Specializing in comprehensive brand identity, digital marketing materials, and creative design solutions that help businesses stand out in competitive global markets",
      img: "https://cdn.prod.website-files.com/606a802fcaa89bc357508cad/62291b5f923ec472a68d77ea_Blog%20-%201%20(2).png"
    },
    {
      title: "Web3 & Blockchain",
      desc: "Deeply immersed in the decentralized economy and digital asset landscape. My expertise ranges from analyzing tokenomics and DeFi protocols to navigating NFT ecosystems and airdrop strategies. I explore how blockchain technology can revolutionize traditional finance and ownership models.",
      img: "https://www.menosfios.com/wp-content/uploads/2023/07/web-3.0.jpg"
    }
  ];

  // --- Data: Skills Cloud ---
  const skills = [
    { name: "Agri Business", type: "core" },
    { name: "Crop Science", type: "core" },
    { name: "Financial Accounting", type: "finance" },
    { name: "Auditing", type: "finance" },
    { name: "Web3 / Blockchain", type: "tech" },
    { name: "NFTs", type: "tech" },
    { name: "Graphic Design", type: "design" },
    { name: "Freelancing", type: "design" },
    { name: "Entrepreneurship", type: "core" }
  ];

  // Color mapping for skills
  const colors = {
    core: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    finance: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    tech: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
    design: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"
  };

  // --- Animation Logic (Scroll Reveal) ---
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
    <div id="page-expertise" className="page-section">
      <section className="max-w-6xl mx-auto pt-10 px-4">
        <div className="text-center mb-10 reveal">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Multidisciplinary Focus</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-2">A visual overview of my core areas of expertise.</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {expertiseCards.map((card, index) => (
            <div 
              key={index} 
              className="reveal expertise-card bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-stone-200 dark:border-dark-border transition-all hover:shadow-lg hover:-translate-y-1"
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

        {/* Competency Cloud */}
        <div className="reveal mt-12 bg-white dark:bg-dark-card rounded-2xl p-8 border border-stone-200 dark:border-dark-border shadow-sm text-center">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Competency Cloud</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {skills.map((skill, index) => (
              <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[skill.type]}`}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}