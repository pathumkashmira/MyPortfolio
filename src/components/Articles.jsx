import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function Articles({ isAdmin, onEdit, onDelete, onRead }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // 🔥 FIXED: Changed sorting back to 'date' to show ALL articles
        const q = query(collection(db, "articles"), orderBy("date", "desc")); 
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(items);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div id="page-articles" className="page-section">
      <section>
        <div className="flex justify-between items-end mb-8 reveal">
            <div>
                <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-1 block">Thoughts & Insights</span>
                <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Latest Articles</h2>
            </div>
        </div>

        {loading && <div className="text-center text-stone-500">Loading Articles...</div>}

        {!loading && articles.length === 0 && <div className="text-center text-stone-500">No articles yet.</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
                <div key={article.id} className="reveal relative group" style={{ transitionDelay: `${index * 100}ms` }}>
                    
                    {/* ADMIN BUTTONS */}
                    {isAdmin && (
                        <div className="absolute top-2 right-2 z-20 flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(article); }} className="p-2 bg-white/90 hover:bg-blue-100 text-blue-600 rounded-full shadow-md">✏️</button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(article.id); }} className="p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-md">🗑️</button>
                        </div>
                    )}

                    {/* CARD */}
                    <div 
                        onClick={() => onRead(article)} 
                        className="article-card block bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-stone-200 dark:border-dark-border transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src='https://via.placeholder.com/400x200'} />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                                {article.category}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-[10px] uppercase font-bold">
                                {article.mode === 'write' ? 'Read On Site 📄' : 'External Link 🔗'}
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="text-xs text-stone-400 mb-2 flex items-center gap-2">
                                <span>{article.readTime}</span>
                                {article.authorName && <span>• by {article.authorName}</span>}
                            </div>
                            <h3 className="article-title text-lg font-bold text-stone-900 dark:text-white mb-2 transition-colors group-hover:text-emerald-600">
                                {article.title}
                            </h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4">
                                {article.description}
                            </p>
                            <div className="mt-auto flex items-center text-sm font-semibold text-stone-600 dark:text-stone-300 group-hover:text-emerald-600 transition-colors">
                                {article.mode === 'write' ? 'Read Article →' : 'Visit Link ↗'}
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