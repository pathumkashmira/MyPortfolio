import React, { useEffect } from 'react';

export default function ArticleReader({ article, onBack }) {
  
  // Page load වෙද්දී උඩටම Scroll වෙන්න
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!article) return null;

  return (
    <div className="min-h-screen pt-5 pb-20 animate-fade-in-up">
      <div className="max-w-3xl mx-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
        
        {/* Close Button */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-stone-900/90 backdrop-blur z-10">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-emerald-600 transition-colors">
                ← Back to Articles
            </button>
            <span className="text-xs font-mono text-stone-400">{article.readTime} read</span>
        </div>

        {/* Cover Image */}
        <div className="w-full h-64 md:h-96 relative">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8 pt-20">
                <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider mb-2 inline-block">
                    {article.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight shadow-sm">
                    {article.title}
                </h1>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-stone-200 dark:border-stone-800">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-xl">👤</div>
                <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-white">{article.authorName || 'Pethum Kashmira'}</p>
                    <p className="text-xs text-stone-500">{new Date(article.date || article.dateAdded).toLocaleDateString()}</p>
                </div>
            </div>

            {/* 🔥 RICH TEXT CONTENT RENDERER */}
            <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-stone-800 dark:prose-headings:text-stone-100
                prose-p:text-stone-600 dark:prose-p:text-stone-300 prose-p:leading-relaxed
                prose-a:text-emerald-600 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8"
                dangerouslySetInnerHTML={{ __html: article.content }} 
            />
        </div>

        {/* Footer Area */}
        <div className="bg-stone-50 dark:bg-stone-800/50 p-8 text-center border-t border-stone-200 dark:border-stone-800">
            <p className="text-stone-500 mb-4">Enjoyed this article?</p>
            <button onClick={onBack} className="px-6 py-3 bg-stone-900 dark:bg-stone-700 text-white rounded-full font-bold hover:bg-emerald-600 transition-colors">
                Read More Articles
            </button>
        </div>

      </div>
    </div>
  );
}