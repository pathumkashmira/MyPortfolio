import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export default function Journey({ isAdmin, onEdit, onDelete }) {
  const [journeyItems, setJourneyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "journey"));
        const querySnapshot = await getDocs(q);
        
        let items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        items.sort((a, b) => new Date(b.dateAdded || b.date) - new Date(a.dateAdded || a.date)); // Sort by newest
        
        setJourneyItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journey:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBadgeColor = (cat) => {
      if(cat === 'Academic') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      if(cat === 'Professional') return 'bg-blue-100 text-blue-700 border-blue-200';
      if(cat === 'Non-Academic') return 'bg-amber-100 text-amber-700 border-amber-200';
      return 'bg-stone-100 text-stone-700';
  };

  return (
    <div id="page-timeline" className="page-section">
      <section className="max-w-5xl mx-auto pt-10 px-4">
        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-2 text-center reveal">
            My Journey 🚀
        </h2>
        <p className="text-center text-stone-500 mb-12">Milestones in Education, Career & Life</p>
        
        <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-4 md:ml-6 space-y-12 pb-4">
            {loading && <p className="text-center text-stone-500 pl-8">Loading Timeline...</p>}
            
            {!loading && journeyItems.length === 0 && (
                <div className="pl-8 text-stone-500 italic">No journey items yet.</div>
            )}

            {journeyItems.map((item, index) => (
                <div key={item.id} className="reveal timeline-item relative pl-8 md:pl-12 group" style={{ transitionDelay: `${index * 100}ms` }}>
                    {/* Dot */}
                    <div className="timeline-dot absolute -left-[9px] top-6 w-5 h-5 rounded-full border-4 border-white dark:border-stone-900 shadow-sm bg-stone-300 dark:bg-stone-600 group-hover:bg-emerald-500 transition-colors"></div>
                    
                    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all relative hover:-translate-y-1 overflow-hidden">
                        
                        {/* Background Gradient Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        {/* Admin Buttons */}
                        {isAdmin && (
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <button onClick={() => onEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                <button onClick={() => onDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* Image (If exists) */}
                            {item.image && (
                                <div className="shrink-0 w-full md:w-48 h-32 md:h-auto rounded-xl overflow-hidden bg-stone-100">
                                    <img src={item.image} alt="Event" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(item.category)}`}>
                                        {item.category || 'General'}
                                    </span>
                                    <span className="text-xs font-mono text-stone-400">{item.date}</span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-1">{item.title}</h3>
                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3">{item.place}</p>
                                
                                {/* 🔥 Rich Text Description */}
                                <div 
                                    className="prose prose-sm dark:prose-invert text-stone-600 dark:text-stone-300 max-w-none"
                                    dangerouslySetInnerHTML={{ __html: item.desc || item.description }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}