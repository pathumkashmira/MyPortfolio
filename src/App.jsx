import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; 
import { doc, getDoc, setDoc, updateDoc, increment, deleteDoc } from 'firebase/firestore'; 

// --- COMPONENTS IMPORTS ---
import Preloader from './components/Preloader';
import Background from './components/Background';
import MouseGlow from './components/MouseGlow';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import Journey from './components/Journey';
import Services from './components/Services';
import Articles from './components/Articles';
import ArticleReader from './components/ArticleReader';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import ChatWidget from './components/ChatWidget';
import AdminDashboard from './components/AdminDashboard'; 
import LoginModal from './components/LoginModal'; 

// 🔥 YOUR ADMIN EMAIL
const ADMIN_EMAIL = "pethumkashmira@gmail.com"; 

// --- 🔥 FIXED CRYPTO TICKER COMPONENT ---
const CryptoTicker = () => {
  useEffect(() => {
    // 1. Check if script already exists to prevent duplicates
    if (document.getElementById('coingecko-script')) return;

    // 2. Load the script manually
    const script = document.createElement('script');
    script.id = 'coingecko-script';
    script.src = "https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => { 
        // Cleanup is tricky with external widgets, usually better to leave it or check carefully
    };
  }, []);

  return (
    <div className="w-full bg-stone-50 dark:bg-[#0c0a09] border-t border-stone-200 dark:border-stone-800 relative z-30">
      <coingecko-coin-price-marquee-widget 
        coin-ids="bitcoin,ethereum,solana,binancecoin,ripple,cardano,polkadot" 
        currency="usd" 
        background-color="transparent" 
        locale="en" 
        font-color="#059669"
      ></coingecko-coin-price-marquee-widget>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [currentPage, setCurrentPage] = useState('profile');
  
  // Auth & Admin States
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 
  
  // UI States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [visitors, setVisitors] = useState("Loading...");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null); 

  // 1. VISITOR COUNT
  useEffect(() => {
    const updateVisitors = async () => {
      const counterRef = doc(db, 'stats', 'visitors');
      const visited = sessionStorage.getItem('visited');
      try {
        if (!visited) {
          await setDoc(counterRef, { count: increment(1) }, { merge: true });
          sessionStorage.setItem('visited', 'true');
        }
        const docSnap = await getDoc(counterRef);
        if (docSnap.exists()) setVisitors(docSnap.data().count.toLocaleString());
      } catch (e) { setVisitors("1,200+"); }
    };
    updateVisitors();
  }, []);

  // 2. AUTH LISTENER
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      const statusRef = doc(db, 'stats', 'status');
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email === ADMIN_EMAIL) {
            setIsAdmin(true);
            await setDoc(statusRef, { online: true, lastSeen: new Date().toISOString() }, { merge: true });
            window.addEventListener('beforeunload', () => { updateDoc(statusRef, { online: false }); });
        } else { setIsAdmin(false); }
      } else {
        setUser(null); setIsAdmin(false); await setDoc(statusRef, { online: false }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  // --- HANDLERS ---
  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedArticle(null); 
    window.scrollTo(0, 0);
  };

  const handleEdit = (item, type) => {
    if(!user) return alert("Please login first.");
    setEditItem({ ...item, type }); 
    window.scrollTo(0, 0); 
  };

  const handleDelete = async (collectionName, id) => {
    if(!isAdmin && collectionName !== 'articles') return alert("Permission Denied");
    if(confirm("Are you sure you want to delete this?")) {
        try {
            await deleteDoc(doc(db, collectionName, id));
            alert("Deleted!");
            window.location.reload(); 
        } catch (e) { alert("Error: " + e.message); }
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-stone-800 dark:text-dark-text transition-colors duration-300 font-sans relative">
      
      {/* 1. VISUAL EFFECTS LAYER */}
      <Preloader />
      <Background />
      <MouseGlow />

      {/* 2. NAVBAR */}
      <Navbar 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
        onSecretClick={() => setIsLoginOpen(true)} 
        user={user} 
      />

      {/* 3. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full relative z-10">
        
        {/* Admin/User Dashboard */}
        {user && (
            <AdminDashboard 
                editItem={editItem} 
                setEditItem={setEditItem} 
                user={user} 
                isAdmin={isAdmin} 
            />
        )}
        
        {/* Page Content */}
        {currentPage === 'profile' && <Hero visitorCount={visitors} onNavigate={handleNavigate} />}
        {currentPage === 'expertise' && <Expertise />}
        {currentPage === 'timeline' && <Journey isAdmin={isAdmin} onEdit={(item) => handleEdit(item, 'journey')} onDelete={(id) => handleDelete('journey', id)} />}
        
        {/* Article Logic */}
        {currentPage === 'articles' && (
            selectedArticle ? (
                <ArticleReader article={selectedArticle} onBack={() => { setSelectedArticle(null); window.scrollTo(0,0); }} />
            ) : (
                <Articles 
                    isAdmin={isAdmin} 
                    onEdit={(item) => handleEdit(item, 'articles')} 
                    onDelete={(id) => handleDelete('articles', id)}
                    onRead={(article) => {
                        if (article.mode === 'write' || article.content) { setSelectedArticle(article); } 
                        else { window.open(article.link, '_blank'); }
                    }}
                />
            )
        )}
        
        {currentPage === 'fiverr-gigs' && <Services isAdmin={isAdmin} onEdit={(item) => handleEdit(item, 'services')} onDelete={(id) => handleDelete('services', id)} />}
        
        {currentPage === 'contact' && <Contact openChat={() => setIsChatOpen(true)} />}

        {currentPage === 'nft-drop' && (
             <div className="text-center mt-20 fade-in min-h-[50vh] flex flex-col justify-center items-center">
                <span className="inline-block py-1 px-4 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-4">Coming Soon</span>
                <h2 className="text-4xl font-bold flex items-center justify-center gap-3 text-stone-900 dark:text-white">
                    NFT Collection Drop 
                    <svg className="w-10 h-10 text-indigo-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16 8l2 2 14 14" />
                    </svg>
                </h2>
             </div>
        )}
      </main>

      {/* 4. FOOTER & EXTRAS */}
      {/* 🔥 Ticker Added Here */}
      <CryptoTicker />
      <Footer />
      <AudioPlayer />
      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </div>
  );
}

export default App;