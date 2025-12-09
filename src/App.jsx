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
                <h2 className="text-4xl font-bold">NFT Collection Drop 🚀</h2>
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