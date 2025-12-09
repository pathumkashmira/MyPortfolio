import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Services({ isAdmin, onEdit, onDelete }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div id="page-fiverr-gigs" className="page-section">
      <section className="space-y-10">
        <div className="text-center reveal">
            <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-2 block flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Freelance Services
            </span>
            <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Hire Me on Fiverr</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-2">Professional services tailored to your business needs.</p>
        </div>

        {loading && (
            <div className="text-center text-stone-500 flex justify-center items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Loading Services...
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
                <div key={service.id} className="reveal relative group" style={{ transitionDelay: `${index * 100}ms` }}>
                    
                    {/* 🔥 ADMIN BUTTONS */}
                    {isAdmin && (
                        <div className="absolute top-2 right-2 z-20 flex gap-1">
                            <button 
                                onClick={() => onEdit(service)} 
                                className="p-2 bg-white/90 hover:bg-blue-100 text-blue-600 rounded-full shadow-md transition-transform hover:scale-110" 
                                title="Edit"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button 
                                onClick={() => onDelete(service.id)} 
                                className="p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-md transition-transform hover:scale-110" 
                                title="Delete"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    )}

                    <div className="fiverr-card bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-stone-200 dark:border-dark-border transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-xl">
                        <div className="relative h-48 bg-stone-100 group-inner">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src='https://via.placeholder.com/400x200'} />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-stone-800 flex items-center gap-1">
                                <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                {service.rating}
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 mb-3">
                                <img src="https://media.licdn.com/dms/image/v2/D4E03AQFdRsgOourY5A/profile-displayphoto-scale_200_200/B4EZqEAUJCJ0Ac-/0/1763151268578?e=1766620800&v=beta&t=YOS3Rs0HxNnuPx3hTa2zkHuHYl7Cf6iLS6WxFU-JD7s" alt="PK" className="w-8 h-8 rounded-full border border-stone-200" />
                                <div>
                                    <p className="text-xs font-bold text-stone-700 dark:text-stone-300">Pethum Kashmira</p>
                                    <p className="text-[10px] text-stone-400">Level 2 Seller</p>
                                </div>
                            </div>
                            <h3 className="text-stone-900 dark:text-white font-medium hover:text-emerald-600 cursor-pointer mb-2 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 line-clamp-2">
                                {service.description}
                            </p>
                            <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                                <div className="text-xs text-stone-400">STARTING AT</div>
                                <div className="text-lg font-bold text-stone-800 dark:text-white">${service.price}</div>
                            </div>
                            <a href={service.link} target="_blank" rel="noreferrer" className="mt-4 block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 group-hover:gap-3">
                                Order on Fiverr
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}