import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function NotificationPopup({ onOpen }) {
  const [latestItem, setLatestItem] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const collections = ['articles', 'services', 'airdrops'];
        const promises = collections.map(col => 
          getDocs(query(collection(db, col), orderBy('dateAdded', 'desc'), limit(1)))
        );

        const results = await Promise.all(promises);
        let newest = null;

        results.forEach((snap, index) => {
          if (!snap.empty) {
            const docData = { id: snap.docs[0].id, type: collections[index], ...snap.docs[0].data() };
            if (!newest || new Date(docData.dateAdded) > new Date(newest.dateAdded)) {
              newest = docData;
            }
          }
        });

        if (newest) {
          const seenUpdate = localStorage.getItem('seen_update_id');
          if (seenUpdate !== newest.id) {
            setLatestItem(newest);
            setTimeout(() => setIsVisible(true), 1500);
          }
        }
      } catch (e) {
        console.error("Noti Error:", e);
      }
    };

    fetchLatest();
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    if (latestItem) localStorage.setItem('seen_update_id', latestItem.id);
  };

  const handleClick = () => {
    setIsVisible(false);
    if (latestItem) {
        localStorage.setItem('seen_update_id', latestItem.id);
        onOpen(latestItem);
    }
  };

  if (!latestItem || !isVisible) return null;

  return (
    // 🔥 POSITION FIXED TOP-LEFT (z-index 200 to be on top)
    <div className="fixed top-4 left-4 z-[200] max-w-sm w-full animate-fade-in-down">
      
      <div 
        onClick={handleClick}
        className="bg-white dark:bg-stone-900/95 backdrop-blur border-l-4 border-emerald-500 shadow-2xl rounded-r-xl p-4 relative cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex gap-4 items-start"
      >
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-2 right-2 text-stone-400 hover:text-red-500 p-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="shrink-0">
             {latestItem.image ? (
               <img src={latestItem.image} alt="New" className="w-14 h-14 rounded-lg object-cover shadow-sm" />
             ) : (
               <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">🔥</div>
             )}
        </div>

        <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                New {latestItem.type === 'airdrops' ? 'Airdrop' : latestItem.type.slice(0, -1)}
                </span>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            </div>
            
            <h4 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">{latestItem.title}</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
              {latestItem.description || latestItem.desc || "Click to see details."}
            </p>
        </div>
      </div>
    </div>
  );
}