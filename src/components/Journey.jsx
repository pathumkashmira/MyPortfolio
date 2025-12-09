import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function Journey({ isAdmin, onEdit, onDelete }) {
  const [journeyItems, setJourneyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "journey"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJourneyItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journey:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div id="page-timeline" className="page-section">
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-8 text-center reveal">
            Academic & Professional Journey
        </h2>
        
        <div className="relative border-l-2 border-stone-200 dark:border-stone-700 ml-3 space-y-12 pb-4">
            {loading && <p className="text-center text-stone-500 pl-8">Loading Timeline...</p>}

            {journeyItems.map((item, index) => (
                <div key={item.id} className="reveal timeline-item relative pl-8 group" style={{ transitionDelay: `${index * 100}ms` }}>
                    <div className={`timeline-dot absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-stone-900 shadow-sm ${item.type === 'edu' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                    
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-stone-200 dark:border-dark-border shadow-sm group-hover:shadow-md transition-all relative hover:translate-x-1">
                        {/* 🔥 ADMIN BUTTONS (DELETE / EDIT) */}
                        {isAdmin && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700 text-xs font-bold border border-blue-200 px-2 py-1 rounded">✏️ Edit</button>
                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold border border-red-200 px-2 py-1 rounded">🗑️ Del</button>
                            </div>
                        )}

                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wide font-mono">{item.date}</span>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">{item.title}</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">{item.place}</p>
                        <p className="text-stone-600 dark:text-stone-300 mt-3 leading-relaxed text-sm">
                            {item.description || item.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}