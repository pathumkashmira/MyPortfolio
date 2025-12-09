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
            <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-2 block">Freelance Services</span>
            <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Hire Me on Fiverr</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-2">Professional services tailored to your business needs.</p>
        </div>

        {loading && <div className="text-center text-stone-500">Loading Services...</div>}

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
                                ✏️
                            </button>
                            <button 
                                onClick={() => onDelete(service.id)} 
                                className="p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-md transition-transform hover:scale-110" 
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    )}

                    <div className="fiverr-card bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-stone-200 dark:border-dark-border transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-xl">
                        <div className="relative h-48 bg-stone-100 group-inner">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src='https://via.placeholder.com/400x200'} />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-stone-800">
                                ⭐ {service.rating}
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
                            <a href={service.link} target="_blank" rel="noreferrer" className="mt-4 block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors text-sm">
                                Order on Fiverr
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