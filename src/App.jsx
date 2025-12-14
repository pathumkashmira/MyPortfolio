import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; 
import { doc, getDoc, setDoc, updateDoc, increment, deleteDoc } from 'firebase/firestore'; 

// --- COMPONENTS IMPORTS ---
import Preloader from './components/Preloader';
import Background from './components/Background';
import MouseGlow from './components/MouseGlow';
import Sidebar from './components/Sidebar';
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
import Airdrops from './components/Airdrops';
import NotificationPopup from './components/NotificationPopup';
//---import TestPoster from './components/TestPoster';---//

// 🔥 YOUR ADMIN EMAIL
const ADMIN_EMAIL = "pethumkashmira@gmail.com"; 

// --- CRYPTO TICKER COMPONENT ---
const CryptoTicker = () => {
  useEffect(() => {
    if (document.getElementById('coingecko-script')) return;
    const script = document.createElement('script');
    script.id = 'coingecko-script';
    script.src = "https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js";
    script.async = true;
    document.body.appendChild(script);
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

// --- 🔥 INTRO COMPONENT (SPACE THEME) ---
const IntroScreen = ({ onEnter, isFading }) => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-0.5 h-0.5'
  }));

  const title = "Welcome to My Universe";
  
  return (
    <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center space-bg overflow-hidden text-white transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Stars */}
      {stars.map(star => (
        <div 
          key={star.id}
          className={`absolute bg-white rounded-full star-twinkle ${star.size}`}
          style={{ top: star.top, left: star.left, animationDelay: star.delay }}
        ></div>
      ))}

      {/* Glowing Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-7xl font-extrabold mb-8 tracking-tight drop-shadow-2xl">
          {title.split("").map((char, index) => (
            <span 
              key={index} 
              className="letter-anim inline-block" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p className="text-stone-400 text-lg mb-12 max-w-lg mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
            Step into a world where Agri-Business meets Financial Strategy & Web3 Innovation.
        </p>

        <button 
            onClick={onEnter}
            className="opacity-0 animate-fade-in-up group relative px-8 py-3 bg-transparent overflow-hidden rounded-full transition-all hover:scale-110"
            style={{ animationDelay: '2s', animationFillMode: 'forwards' }}
        >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 group-hover:opacity-80 transition-opacity duration-500 blur-md"></div>
            <div className="absolute inset-0 w-full h-full border border-emerald-500 rounded-full"></div>
            <span className="relative flex items-center gap-3 text-emerald-400 group-hover:text-white font-bold tracking-widest uppercase text-sm">
                Enter Experience 🚀
            </span>
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [introFading, setIntroFading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // 🔥 SIDEBAR COLLAPSE STATE
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [currentPage, setCurrentPage] = useState('profile');
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [visitors, setVisitors] = useState("Loading...");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null); 
  const [notificationTargetId, setNotificationTargetId] = useState(null);

  // --- Handlers ---
  const handleEnter = () => {
      setIntroFading(true); 
      setTimeout(() => setShowIntro(false), 1000); 
  };

  // 🔥 DISABLE RIGHT CLICK & INSPECT SHORTCUTS
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // 櫨 URL PARAMETER & DOMAIN CHECK
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const id = params.get('id');
    const hostname = window.location.hostname; // e.g. "pethum.dev"

    // 👇 මෙන්න මේ IF condition එකට ඔයාගේ අලුත් ඩොමේන් එක එකතු කරන්න
    if (
        hostname === 'pethum.dev' || 
        hostname === 'www.pethum.dev' ||
        hostname === 'filxy.store' ||  // 🔥 ඔයාගේ SMM Domain එක මෙතනට දාන්න
        hostname === 'www.filxy.store' // 🔥 www එක්කත් දාන්න
    ) {
        setShowIntro(false); // Intro Animation එක පෙන්නන්නෙ නෑ
        setCurrentPage('fiverr-gigs'); // කෙලින්ම Services පිටුවට යනවා
    }
    // 2. URL Params Check (Link එකකින් එන අයට)
    else if (type && id) {
        setShowIntro(false); 
        
        if (type === 'article') {
            const fetchArticle = async () => {
                try {
                    const docRef = doc(db, 'articles', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setSelectedArticle({ id: docSnap.id, ...docSnap.data() });
                        setCurrentPage('articles');
                    }
                } catch(e) { console.error(e); }
            };
            fetchArticle();
        } else if (type === 'airdrop') {
            setNotificationTargetId(id);
            setCurrentPage('airdrops');
        } else if (type === 'service') {
            setCurrentPage('fiverr-gigs');
        }
    }
  }, []);

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

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedArticle(null); 
    window.scrollTo(0, 0);
  };

  const handleNotificationClick = (item) => {
      if (item.type === 'airdrops') {
          setCurrentPage('airdrops');
          setNotificationTargetId(item.id);
      } else if (item.type === 'articles') {
          setCurrentPage('articles');
      } else if (item.type === 'services') {
          setCurrentPage('fiverr-gigs');
      }
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
    <>
      {/* 1. INTRO LAYER (Fades Out) */}
      {showIntro && <IntroScreen onEnter={handleEnter} isFading={introFading} />}

      {/* 2. MAIN APP LAYER (Always Visible Behind) */}
      <div 
        className="flex h-screen bg-stone-50 dark:bg-[#0c0a09] text-stone-800 dark:text-dark-text font-sans overflow-hidden transition-colors duration-300"
      >
        
        <Preloader />
        <Background />
        <MouseGlow />

        {/* SIDEBAR with Collapse Props */}
        <Sidebar 
            onNavigate={handleNavigate} 
            currentPage={currentPage} 
            onSecretClick={() => setIsLoginOpen(true)} 
            user={user} 
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <NotificationPopup onOpen={handleNotificationClick} />

        {/* DYNAMIC MARGIN based on Sidebar State */}
        <div className={`flex-1 flex flex-col h-full overflow-y-auto relative z-10 pt-16 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
            
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
              
              {user && <AdminDashboard editItem={editItem} setEditItem={setEditItem} user={user} isAdmin={isAdmin} />}
              
              {currentPage === 'profile' && <Hero visitorCount={visitors} onNavigate={handleNavigate} />}
              {currentPage === 'about' && <Expertise />}
              {currentPage === 'timeline' && <Journey isAdmin={isAdmin} onEdit={(item) => handleEdit(item, 'journey')} onDelete={(id) => handleDelete('journey', id)} />}
              
              {currentPage === 'articles' && (
                  selectedArticle ? (
                      <ArticleReader article={selectedArticle} onBack={() => { setSelectedArticle(null); window.scrollTo(0,0); }} />
                  ) : (
                      <Articles 
                        isAdmin={isAdmin} 
                        onEdit={(item) => handleEdit(item, 'articles')} 
                        onDelete={(id) => handleDelete('articles', id)} 
                        onRead={(article) => { 
                            if (article.mode === 'link' || (article.link && article.link.length > 5)) { 
                                window.open(article.link, '_blank'); 
                            } else { 
                                setSelectedArticle(article); 
                            } 
                        }} 
                      />
                  )
              )}
              
              {currentPage === 'airdrops' && <Airdrops isAdmin={isAdmin} onEdit={(item) => handleEdit(item, 'airdrops')} onDelete={(id) => handleDelete('airdrops', id)} targetId={notificationTargetId} />}
              
              {currentPage === 'fiverr-gigs' && <Services isAdmin={isAdmin} onEdit={(item) => handleEdit(item, 'services')} onDelete={(id) => handleDelete('services', id)} />}
              
              {currentPage === 'contact' && <Contact openChat={() => setIsChatOpen(true)} />}
              
              {currentPage === 'nft-drop' && (
                  <div className="text-center mt-20 fade-in min-h-[50vh] flex flex-col justify-center items-center">
                      <span className="inline-block py-1 px-4 rounded-full bg-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-4">Coming Soon</span>
                      <h2 className="text-4xl font-bold flex items-center justify-center gap-3 text-stone-900 dark:text-white">NFT Collection Drop 🚀</h2>
                  </div>
              )}
            </main>

            <CryptoTicker />
            <Footer />
        </div>

        <AudioPlayer />
        <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      </div>
    </>
  );
}

export default App;
