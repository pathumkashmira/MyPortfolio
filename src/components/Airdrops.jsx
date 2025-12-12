import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; 
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function Airdrops({ isAdmin, onEdit, onDelete, targetId }) {
  const [airdrops, setAirdrops] = useState([]);
  const [selectedAirdrop, setSelectedAirdrop] = useState(null);

  // --- Load Data ---
  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        const q = query(collection(db, "airdrops"), orderBy("dateAdded", "desc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAirdrops(items);

        // Notification click කරලා ආවොත් Auto Open වෙනවා
        if (targetId) {
          const target = items.find(item => item.id === targetId);
          if (target) setSelectedAirdrop(target);
        }
      } catch (e) {
        console.error("Error loading airdrops:", e);
      }
    };
    fetchAirdrops();
  }, [targetId]);

  // --- Copy Link Function ---
  const copyLink = (id) => {
      const link = `${window.location.origin}/?type=airdrop&id=${id}`;
      navigator.clipboard.writeText(link);
      alert("Airdrop Link Copied! 🔗\n" + link);
  };

  return (
    <div id="page-airdrops" className="page-section">
      <section className="max-w-6xl mx-auto pt-10 px-4">
        
        <div className="text-center mb-10 reveal">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Crypto Airdrops 🪂</h2>
          <p className="text-stone-500 mt-2">Latest opportunities & updates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airdrops.map((drop) => (
            <div key={drop.id} className="reveal bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:shadow-lg transition-all group relative">
              
              {/* 🔥 Control Buttons (Copy Link is PUBLIC now) */}
              <div className="absolute top-2 right-2 z-20 flex gap-1">
                  {/* Share Button - Visible to Everyone */}
                  <button 
                      onClick={(e) => {e.stopPropagation(); copyLink(drop.id);}} 
                      className="p-1.5 bg-white/90 rounded-full text-emerald-600 shadow-md hover:bg-emerald-100 transition-transform hover:scale-110" 
                      title="Copy Link"
                  >
                      🔗
                  </button>

                  {/* Edit/Delete - Admin Only */}
                  {isAdmin && (
                    <>
                        <button 
                            onClick={(e) => {e.stopPropagation(); onEdit(drop);}} 
                            className="p-1.5 bg-white/90 rounded-full text-blue-600 shadow hover:bg-blue-100"
                            title="Edit"
                        >
                            ✏️
                        </button>
                        <button 
                            onClick={(e) => {e.stopPropagation(); onDelete(drop.id);}} 
                            className="p-1.5 bg-white/90 rounded-full text-red-600 shadow hover:bg-red-100"
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </>
                  )}
              </div>

              <div className="h-40 overflow-hidden relative cursor-pointer" onClick={() => setSelectedAirdrop(drop)}>
                <img 
                    src={drop.image} 
                    alt={drop.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    onError={(e) => e.target.src='https://via.placeholder.com/400x200?text=Airdrop'} 
                />
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                  ${drop.value || 'Free'}
                </div>
              </div>
              
              <div className="p-5 cursor-pointer" onClick={() => setSelectedAirdrop(drop)}>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1">{drop.title}</h3>
                <p className="text-xs text-stone-500 mb-3">{drop.platform || 'Web3'}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-500">
                        {drop.timeline?.length || 0} Updates
                    </span>
                    <button className="text-emerald-600 font-bold text-sm hover:underline">View Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- MODAL --- */}
        {selectedAirdrop && createPortal(
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up" 
            onClick={() => setSelectedAirdrop(null)}
          >
            <div 
                className="bg-white dark:bg-stone-900 w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative border border-stone-700 flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
              
              {/* Header Image */}
              <div className="relative h-48 sm:h-64 shrink-0">
                  <img src={selectedAirdrop.image} alt={selectedAirdrop.title} className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedAirdrop(null)} className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-red-500 transition-colors z-10">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                      <h2 className="text-3xl font-bold text-white">{selectedAirdrop.title}</h2>
                      <span className="text-emerald-400 font-mono text-sm">{selectedAirdrop.platform}</span>
                  </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                
                <div className="flex justify-between items-center mb-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div>
                        <p className="text-xs text-stone-500">Estimated Value</p>
                        <p className="text-lg font-bold text-stone-900 dark:text-white">${selectedAirdrop.value}</p>
                    </div>
                    <a href={selectedAirdrop.link} target="_blank" rel="noreferrer" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105 flex items-center gap-2">
                        Claim Now 🚀
                    </a>
                </div>

                {/* Main Description */}
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none mb-8 text-stone-600 dark:text-stone-300 whitespace-pre-wrap prose-img:rounded-xl prose-a:text-blue-500"
                    dangerouslySetInnerHTML={{ __html: selectedAirdrop.description }}
                />

                {/* Timeline Updates */}
                {selectedAirdrop.timeline && selectedAirdrop.timeline.length > 0 && (
                    <div className="mt-8 border-t border-stone-200 dark:border-stone-700 pt-6">
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Updates Timeline
                        </h3>
                        <div className="relative border-l-2 border-stone-200 dark:border-stone-700 ml-3 space-y-8">
                            {selectedAirdrop.timeline.map((update, idx) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-stone-900"></div>
                                    <span className="text-xs font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">{update.date}</span>
                                    <h4 className="text-md font-bold text-stone-800 dark:text-white mt-1">{update.title}</h4>
                                    
                                    <div 
                                        className="prose prose-sm dark:prose-invert mt-2 text-stone-600 dark:text-stone-300 max-w-none prose-img:rounded-lg prose-a:text-blue-500"
                                        dangerouslySetInnerHTML={{ __html: update.desc }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

              </div>
            </div>
          </div>,
          document.body
        )}

      </section>
    </div>
  );
}