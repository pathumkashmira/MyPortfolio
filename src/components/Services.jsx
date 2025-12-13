import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Services({ isAdmin, onEdit, onDelete }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Payment Modal
  const [currency, setCurrency] = useState('USD'); 
  const [selectedPackage, setSelectedPackage] = useState(null); 

  const WHATSAPP_NUMBER = "94769667684"; // 🔥 ඔබේ අංකය

  // --- 🔥 PORTFOLIO ONLY PACKAGES ---
  const packages = [
    {
      name: "Student / CV Portfolio",
      priceUSD: "40",
      priceLKR: "6000",
      type: "Simple & Clean",
      desc: "Perfect for students to showcase their resume online.",
      features: ["One Page Digital CV", "Mobile Responsive", "Contact & Social Links", "Fast Loading", "Source Code Included"],
      popular: false,
      color: "border-stone-200 dark:border-stone-700",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    },
    {
      name: "Pro Freelancer Portfolio",
      priceUSD: "100",
      priceLKR: "20,000",
      type: "Modern Design",
      desc: "For designers, developers & freelancers to show work.",
      features: ["3 Pages (Home, Work, Contact)", "Project Gallery", "Modern Animations", "Dark Mode Support", "Admin Panel to Edit"],
      popular: true, 
      color: "border-emerald-500 ring-2 ring-emerald-500/20",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
    },
    {
      name: "Business / Agency Site",
      priceUSD: "200",
      priceLKR: "50,000",
      type: "Professional", 
      desc: "For small businesses or agencies to display services.",
      features: ["Up to 5 Pages", "Services & Team Section", "Testimonials Slider", "Blog Section", "SEO Optimization"],
      popular: false,
      color: "border-blue-500",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    },
    {
      name: "Custom 3D / Creative",
      priceUSD: "300+",
      priceLKR: "150,000+",
      type: "High-End",
      desc: "Unique, interactive 3D portfolios for maximum impact.",
      features: ["Three.js 3D Models", "Advanced Interactions", "Custom Animations", "Unique Layouts", "Priority Support"],
      popular: false,
      color: "border-purple-500",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    }
  ];

  // --- Fetch Data ---
  useEffect(() => {
    try {
      const ref = collection(db, "services");
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            finalImage: data.image || data.img || "https://via.placeholder.com/400x200?text=No+Image",
            finalDesc: data.description || data.desc || "No description available.",
            finalTitle: data.title || "Untitled Service",
            finalPrice: data.price || "5",
            finalLink: data.link || data.fiverrLink || "#",
            finalRating: data.rating || "5.0",
            dateAdded: data.dateAdded || null
          };
        });
        
        items.sort((a, b) => {
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
            return dateB - dateA;
        });

        setServices(items);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }, []);

  const handleDirectHire = () => {
      const message = "Hi Pethum! 👋 I want to build a professional portfolio website. Can we discuss?";
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePackageInquiry = (pkg) => {
      const selectedPrice = currency === 'USD' ? `$${pkg.priceUSD}` : `LKR ${pkg.priceLKR}`;
      const message = `Hi Pethum! 👋 I am interested in your "${pkg.name}" portfolio package (${selectedPrice}). I am from ${currency === 'LKR' ? 'Sri Lanka' : 'Abroad'}. Can you share more details?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- Get More Details Action ---
  const handleGetMoreDetails = () => {
      if(!selectedPackage) return;
      const price = currency === 'USD' ? `$${selectedPackage.priceUSD}` : `LKR ${selectedPackage.priceLKR}`;
      
      const message = `Hi Pethum! 🚀\nI am interested in the "${selectedPackage.name}" portfolio package (${price}).\nPlease share more details and payment info.`;
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      setSelectedPackage(null); 
  };

  return (
    <div id="page-services" className="page-section">
      <section className="max-w-7xl mx-auto pt-10 px-4">
        
        {/* HEADER */}
        <div className="text-center mb-10 reveal">
          <div className="flex items-center justify-center gap-2 mb-2">
             <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             </div>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Services & Solutions</h2>
          <p className="text-stone-500 mt-2">Professional services tailored to your needs.</p>
        </div>

        {/* 1. HERO DIRECT HIRE CARD */}
        <div className="reveal mb-20 relative group max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-stone-9 text-white rounded-3xl p-8 md:p-12 border border-stone-700 shadow-2xl flex flex-col md:flex-row items-center gap-10 overflow-hidden">
                <div className="flex-1 text-center md:text-left z-10">
                    <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-emerald-500/50">Top Rated Service</div>
                    <h3 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">Need a Portfolio? <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Let's Build It.</span></h3>
                    <p className="text-stone-400 text-lg mb-8 leading-relaxed max-w-lg">I specialize in building high-performance, modern portfolio websites for students, freelancers, and professionals.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                        {["Custom React Design", "Mobile & Desktop Responsive", "Admin Dashboard Included", "Fast Loading Speed", "SEO Friendly Structure", "One-Time Payment"].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div><span className="text-sm font-semibold text-stone-200">{feature}</span></div>
                        ))}
                    </div>
                    <button onClick={handleDirectHire} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto md:mx-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        Chat on WhatsApp
                    </button>
                </div>
                {/* Tech Stack Animation */}
                <div className="hidden md:flex w-1/3 justify-center items-center relative">
                    {/* Background Glow */}
                    <div className="absolute w-56 h-56 bg-[#64ffda]/10 rounded-full blur-[70px] animate-pulse"></div>
                    
                    {/* Floating Elements Container */}
                    <svg className="w-72 h-72 drop-shadow-[0_0_20px_rgba(100,255,218,0.2)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Layer 1 */}
                        <g className="animate-bounce" style={{animationDuration: '4s'}}>
                            <path d="M20 70 L50 85 L80 70 L50 55 L20 70Z" stroke="#64ffda" strokeWidth="1.5" fill="rgba(10, 25, 47, 0.8)" className="path-draw" style={{animationDelay: '0s'}} />
                            <path d="M20 70 V 80 L50 95 L80 80 V 70" stroke="#64ffda" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="path-draw" style={{animationDelay: '0.5s'}} />
                        </g>
                        {/* Layer 2 */}
                        <g className="animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}>
                            <path d="M20 50 L50 65 L80 50 L50 35 L20 50Z" stroke="#64ffda" strokeWidth="1.5" fill="rgba(10, 25, 47, 0.8)" className="path-draw" style={{animationDelay: '1s'}} />
                            <path d="M40 50 L45 55 L55 45" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                        </g>
                        {/* Layer 3 */}
                        <g className="animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                            <path d="M20 30 L50 45 L80 30 L50 15 L20 30Z" stroke="#64ffda" strokeWidth="2" fill="rgba(100, 255, 218, 0.1)" className="path-draw" style={{animationDelay: '1.5s'}} />
                            <path d="M50 15 L80 30" stroke="#64ffda" strokeWidth="1" strokeOpacity="0.5" />
                        </g>
                        {/* Connecting Dots */}
                        <circle cx="50" cy="95" r="1" fill="#64ffda" className="animate-ping" style={{animationDuration: '3s'}} />
                        <circle cx="20" cy="70" r="1" fill="#64ffda" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '1s'}} />
                        <circle cx="80" cy="50" r="1" fill="#64ffda" className="animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.5s'}} />
                    </svg>
                </div>
            </div>
        </div>

        {/* 2. PORTFOLIO PACKAGES */}
        <div className="mb-20">
            <h3 className="text-2xl font-bold text-center text-stone-900 dark:text-white mb-6">Website Creation Packages</h3>
            
            {/* Currency Toggle */}
            <div className="flex justify-center mb-10">
                <div className="bg-stone-200 dark:bg-stone-800 p-1 rounded-full flex relative shadow-inner">
                    <button onClick={() => setCurrency('LKR')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${currency === 'LKR' ? 'text-white' : 'text-stone-500'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Sri Lanka (LKR)
                    </button>
                    <button onClick={() => setCurrency('USD')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${currency === 'USD' ? 'text-white' : 'text-stone-500'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Worldwide ($)
                    </button>
                    <div className={`absolute top-1 bottom-1 w-[50%] bg-emerald-600 rounded-full transition-transform duration-300 shadow-md ${currency === 'USD' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg, idx) => (
                    <div key={idx} className={`reveal bg-white dark:bg-stone-900 rounded-2xl p-6 border shadow-lg hover:shadow-2xl transition-all relative flex flex-col ${pkg.color} ${pkg.popular ? 'scale-105 z-10 shadow-emerald-500/10' : ''}`}>
                        {pkg.popular && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>}
                        <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 text-emerald-500"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{pkg.icon}</svg></div>
                        <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{pkg.type}</div>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-2">{pkg.name}</h4>
                        <div className="text-2xl font-extrabold text-stone-900 dark:text-white mb-2">{currency === 'USD' ? `$${pkg.priceUSD}` : `Rs. ${pkg.priceLKR}`}</div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 h-8">{pkg.desc}</p>
                        <ul className="space-y-3 mb-8 flex-1">{pkg.features.map((feat, i) => (<li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300"><svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>{feat}</li>))}</ul>
                        <button onClick={() => setSelectedPackage(pkg)} className={`w-full py-2.5 rounded-lg font-bold text-xs transition-colors ${pkg.popular ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white'}`}>Select Plan</button>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. FIVERR GIGS */}
        <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 border-l-4 border-indigo-500 pl-3 flex justify-between items-center max-w-6xl mx-auto">
            <span>Marketplace Gigs (Fiverr)</span>
            <span className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-500">{services.length} Gigs</span>
        </h3>

        {loading && <div className="text-center text-stone-500">Loading Gigs...</div>}
        {!loading && services.length === 0 && <div className="text-center text-stone-500 bg-stone-100 dark:bg-stone-800/50 p-10 rounded-xl">No active gigs found.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={service.id} className="reveal relative group" style={{ transitionDelay: `${index * 100}ms` }}>
              {isAdmin && (
                 <div className="absolute top-2 right-2 z-20 flex gap-1">
                    <button onClick={() => onEdit(service)} className="p-1.5 bg-white rounded text-blue-600 shadow">✏️</button>
                    <button onClick={() => onDelete(service.id)} className="p-1.5 bg-white rounded text-red-600 shadow">🗑️</button>
                 </div>
              )}
              <div className="fiverr-card bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative h-48 bg-stone-100 group-inner">
                    <img src={service.finalImage} alt={service.finalTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src='https://via.placeholder.com/400x200?text=Service'} />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-stone-800 flex items-center gap-1"><svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>{service.finalRating}</div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <img src="/profile.png" alt="PK" className="w-8 h-8 rounded-full border border-stone-200" />
                        <div><p className="text-xs font-bold text-stone-700 dark:text-stone-300">Pethum Kashmira</p><p className="text-[10px] text-stone-400">Level 2 Seller</p></div>
                    </div>
                    <h3 className="text-stone-900 dark:text-white font-medium hover:text-emerald-600 cursor-pointer mb-2 transition-colors line-clamp-2">{service.finalTitle}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 line-clamp-2">{service.finalDesc}</p>
                    <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <div className="text-xs text-stone-400">STARTING AT</div>
                        <div className="text-lg font-bold text-stone-800 dark:text-white">${service.finalPrice}</div>
                    </div>
                    <a href={service.finalLink} target="_blank" rel="noreferrer" className="mt-4 block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 group-hover:gap-3">
                        Order on Fiverr <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 PAYMENT MODAL */}
        {selectedPackage && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setSelectedPackage(null)}>
                <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border border-stone-700 p-6" onClick={e => e.stopPropagation()}>
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white">Payment Options</h3>
                        <p className="text-sm text-stone-500">We accept the following methods</p>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-stone-500">Plan</span>
                            <span className="font-bold text-stone-800 dark:text-white">{selectedPackage.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-stone-500">Total</span>
                            <span className="text-xl font-extrabold text-emerald-600">
                                {currency === 'USD' ? `$${selectedPackage.priceUSD}` : `Rs. ${selectedPackage.priceLKR}`}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6 overflow-y-auto max-h-60 custom-scrollbar pr-2">
                        {/* 1. BANK TRANSFER (LKR Only + Worldwide) */}
                        {currency === 'LKR' && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-xl">🏦</div>
                                <div>
                                    <h4 className="font-bold text-sm text-stone-900 dark:text-white">Bank Transfer</h4>
                                    <p className="text-xs text-stone-500">Local Bank Deposit / Online Transfer</p>
                                </div>
                            </div>
                        )}

                        {/* 2. ONLINE WALLETS (Always Visible for Both) */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center text-xl">S</div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Skrill</h4>
                                <p className="text-xs text-stone-500">Instant Transfer</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-xl">P</div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-white">PayPal</h4>
                                <p className="text-xs text-stone-500">Secure Payment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-xl">₿</div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Crypto / Binance</h4>
                                <p className="text-xs text-stone-500">USDT, BTC, ETH</p>
                            </div>
                        </div>
                    </div>

                    {/* 🔥 CHANGED BUTTON TEXT & ACTION */}
                    <button onClick={handleGetMoreDetails} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        Get More Details
                    </button>
                    <button onClick={() => setSelectedPackage(null)} className="w-full mt-3 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-white">Cancel</button>
                </div>
            </div>,
            document.body
        )}

      </section>
    </div>
  );
}