import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Articles({ isAdmin, onEdit, onDelete, onRead }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // 🔥 Real-time listener with Error Handling & Data Mapping
      const q = query(collection(db, "articles"), orderBy("date", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          
          // 🔥 DATA MAPPING FIX: (Frontend එකට ඕන නම් වලින් Data හදනවා)
          return { 
            id: doc.id, 
            ...data,
            // පින්තූරය නැත්නම් Placeholder එකක් දානවා
            image: data.image || data.img || data.photo || "https://via.placeholder.com/400x200?text=No+Image",
            // Description එක නැත්නම් Content එකෙන් කෑල්ලක් ගන්නවා
            description: data.description || data.desc || data.content?.substring(0, 100) + "..." || "No description available.",
            // වෙනත් නම් වලින් තිබුණොත් මැච් කරගන්නවා
            readTime: data.readTime || data.time || "3 min read",
            category: data.category || data.tag || "General",
            authorName: data.authorName || data.author || "Pethum Kashmira",
            mode: data.mode || "write" // Default mode is 'write'
          };
        });
        setArticles(items);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching articles:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Setup error:", error);
      setLoading(false);
    }
  }, []);

  // --- Scroll Animation ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { 
        if(entry.isIntersecting) entry.target.classList.add('active'); 
      });
    }, { threshold: 0.1 });
    
    // පොඩි වෙලාවක් දීලා Animation එක Load කරවනවා
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 500);

    return () => observer.disconnect();
  }, [articles]);

  return (
    <div id="page-articles" className="page-section">
      <section>
        <div className="flex justify-between items-end mb-8 reveal">
            <div>
                <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-1 block flex items-center gap-2">
                    {/* 💡 Original Lightbulb Icon */}
                    <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Thoughts & Insights
                </span>
                <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Latest Articles</h2>
            </div>
        </div>

        {loading && (
            <div className="text-center text-stone-500 flex justify-center items-center gap-2 py-10">
                <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Loading Articles...
            </div>
        )}

        {!loading && articles.length === 0 && <div className="text-center text-stone-500 py-10">No articles yet.</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
                <div key={article.id} className="reveal relative group" style={{ transitionDelay: `${index * 100}ms` }}>
                    
                    {/* ADMIN BUTTONS (Original) */}
                    {isAdmin && (
                        <div className="absolute top-2 right-2 z-20 flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(article); }} className="p-2 bg-white/90 hover:bg-blue-100 text-blue-600 rounded-full shadow-md transition-transform hover:scale-110" title="Edit">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(article.id); }} className="p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-md transition-transform hover:scale-110" title="Delete">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    )}

                    {/* CARD */}
                    <div 
                        onClick={() => onRead(article)} 
                        className="article-card block bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-stone-200 dark:border-dark-border transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/400x200?text=No+Image'; }} 
                            />
                            
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                {article.category}
                            </div>

                            {/* 🔥 ORIGINAL MODE BADGE (Read on Site vs External) */}
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white px-2 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                                {article.mode === 'write' ? (
                                    <>
                                        Read On Site 
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </>
                                ) : (
                                    <>
                                        External Link 
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <div className="text-xs text-stone-400 mb-2 flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {article.readTime}
                                </span>
                                {article.authorName && <span className="flex items-center gap-1">
                                    • <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    by {article.authorName}
                                </span>}
                            </div>
                            
                            <h3 className="article-title text-lg font-bold text-stone-900 dark:text-white mb-2 transition-colors group-hover:text-emerald-600">
                                {article.title}
                            </h3>
                            
                            <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4">
                                {article.description}
                            </p>

                            <div className="mt-auto flex items-center text-sm font-semibold text-stone-600 dark:text-stone-300 group-hover:text-emerald-600 transition-colors gap-1">
                                {article.mode === 'write' ? (
                                    <>
                                        Read Article 
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </>
                                ) : (
                                    <>
                                        Visit Link 
                                        <svg className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </>
                                )}
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