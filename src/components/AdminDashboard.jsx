import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, orderBy, onSnapshot, arrayUnion, where } from 'firebase/firestore';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function AdminDashboard({ editItem, setEditItem, user, isAdmin }) {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => { if (!isMinimized) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [isMinimized]);

  // --- 1. CHAT LOGIC ---
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if(!isAdmin) return;
    const q = query(collection(db, 'chats'), orderBy('lastUpdated', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
        const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatList);
        if (selectedChat) {
            const updated = chatList.find(c => c.id === selectedChat.id);
            if (updated) setSelectedChat(updated);
        }
    });
    return () => unsub();
  }, [selectedChat, isAdmin]);

  useEffect(() => { if(activeTab === 'chat' && !isMinimized) chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedChat, activeTab, isMinimized]);

  const handleSendReply = async (e) => {
      e.preventDefault();
      if(!replyMsg.trim() || !selectedChat) return;
      const chatRef = doc(db, 'chats', selectedChat.id);
      const newMsg = { text: replyMsg, sender: 'admin', time: new Date().toISOString() };
      await updateDoc(chatRef, { msgs: arrayUnion(newMsg), lastUpdated: new Date().toISOString(), unread: false });
      setReplyMsg('');
  };

  // --- 2. DASHBOARD LOGIC ---
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [userArticles, setUserArticles] = useState([]); 

  // Forms State
  const [articleMode, setArticleMode] = useState('link');
  
  // 🔥 INITIAL STATES
  const [artForm, setArtForm] = useState({ title:'', cat:'', read:'', desc:'', img:'', link:'', content:'' });
  const [serForm, setSerForm] = useState({ title:'', desc:'', price:'', rating:'', img:'', link:'' });
  const [journeyForm, setJourneyForm] = useState({ title:'', place:'', date:'', desc:'', type:'edu' });

  // Load Data
  useEffect(() => {
    if(isAdmin) {
        const fetchMessages = async () => {
            try {
                const q = query(collection(db, "messages"), orderBy("date", "desc"));
                const snapshot = await getDocs(q);
                setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (e) { console.error(e); }
        };
        fetchMessages();
    } else {
        const fetchUserArticles = async () => {
            if(!user) return;
            try {
                const q = query(collection(db, "articles"), where("authorEmail", "==", user.email));
                const snapshot = await getDocs(q);
                setUserArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (e) { console.error(e); }
        };
        fetchUserArticles();
    }
  }, [loading, isAdmin, user]);

  // Populate Forms on Edit
  useEffect(() => {
    if (editItem) {
      setIsMinimized(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (editItem.type === 'articles') {
          setArtForm(editItem);
          setArticleMode(editItem.content ? 'write' : 'link');
      }
      if (editItem.type === 'services') setSerForm(editItem);
      if (editItem.type === 'journey') setJourneyForm(editItem);
    }
  }, [editItem]);

  const handleLogout = () => { auth.signOut(); window.location.reload(); };
  
  const handleCancelEdit = () => { 
      setEditItem(null); 
      setArtForm({ title:'', cat:'', read:'', desc:'', img:'', link:'', content:'' }); 
      setSerForm({ title:'', desc:'', price:'', rating:'', img:'', link:'' }); 
      setJourneyForm({ title:'', place:'', date:'', desc:'', type:'edu' }); 
  };

  const handleSubmit = async (e, collectionName, data, formResetInfo) => {
    e.preventDefault(); 
    
    // Size check for articles
    if (collectionName === 'articles') {
        const dataSize = new Blob([JSON.stringify(data)]).size;
        if (dataSize > 900000) { 
            alert("⚠️ Image/Content too large! Please use image links instead of pasting.");
            return;
        }
    }

    setLoading(true);
    try {
        let finalData = { ...data };
        if(collectionName === 'articles') {
            finalData.authorName = user.displayName || user.email.split('@')[0];
            finalData.authorEmail = user.email;
            finalData.authorId = user.uid;
            finalData.mode = articleMode;
            finalData.date = new Date().toISOString(); 
            
            if(articleMode === 'write') finalData.link = '';
            if(articleMode === 'link') finalData.content = '';
        }

        if (editItem && editItem.type === collectionName) {
            await updateDoc(doc(db, collectionName, editItem.id), finalData);
            alert("Updated! ✅"); handleCancelEdit();
        } else {
            await addDoc(collection(db, collectionName), { ...finalData, dateAdded: new Date().toISOString() });
            alert("Added! ✅");
            if(collectionName === 'articles') setArtForm(formResetInfo);
            if(collectionName === 'services') setSerForm(formResetInfo);
            if(collectionName === 'journey') setJourneyForm(formResetInfo);
        }
        if(!isAdmin) window.location.reload(); 
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  };

  const handleDeleteMessage = async (id) => {
      if(confirm("Delete?")) { try { await deleteDoc(doc(db, "messages", id)); setMessages(messages.filter(m => m.id !== id)); } catch (e) { alert(e.message); } }
  };

  const handleDeleteArticle = async (id) => {
      if(confirm("Delete?")) { try { await deleteDoc(doc(db, "articles", id)); setUserArticles(userArticles.filter(a => a.id !== id)); } catch (e) { alert(e.message); } }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className={`mb-10 bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-stone-700 sticky top-20 z-40 transition-all duration-500 ease-in-out ${isMinimized ? 'h-20 overflow-hidden' : 'max-h-[85vh] overflow-y-auto'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-700">
          <div className="flex gap-4 items-center">
              <button onClick={() => setIsMinimized(!isMinimized)} className="bg-stone-700 hover:bg-stone-600 p-2 rounded-full transition-colors">
                  {isMinimized ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                  )}
              </button>
              
              <button onClick={() => setActiveTab('dashboard')} className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-stone-400'}`}>
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                {isAdmin ? 'Admin Panel' : 'Creator Dashboard'}
              </button>
              
              {isAdmin && !isMinimized && (
                  <button onClick={() => setActiveTab('chat')} className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-blue-400' : 'text-stone-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    Chat <span className="text-xs bg-red-600 px-2 rounded-full text-white">{chats.filter(c => c.unread).length}</span>
                  </button>
              )}
          </div>
          <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
          </button>
      </div>

      {!isMinimized && (
        <>
            {/* ADMIN CHAT */}
            {isAdmin && activeTab === 'chat' && (
                <div className="flex h-[60vh] gap-4">
                    <div className="w-1/3 border-r border-stone-700 pr-2 overflow-y-auto custom-scrollbar">
                        {chats.length === 0 && <p className="text-stone-500 text-sm">No chats.</p>}
                        {chats.map(chat => (
                            <div key={chat.id} onClick={() => setSelectedChat(chat)} className={`p-3 rounded cursor-pointer mb-2 transition-colors ${selectedChat?.id === chat.id ? 'bg-stone-700' : 'bg-stone-800 hover:bg-stone-700'}`}>
                                <div className="flex justify-between"><span className="font-bold text-sm text-emerald-400">Guest</span>{chat.unread && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</div>
                                <p className="text-xs text-stone-400 truncate">{chat.msgs?.[chat.msgs.length-1]?.text || 'Msg'}</p>
                            </div>
                        ))}
                    </div>
                    <div className="w-2/3 flex flex-col bg-stone-800 rounded-lg overflow-hidden">
                        {selectedChat ? (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {selectedChat.msgs?.map((m, i) => (
                                        <div key={i} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-2 rounded-lg text-sm ${m.sender === 'admin' ? 'bg-blue-600' : 'bg-stone-600'}`}>{m.text}</div>
                                        </div>
                                    ))}
                                    <div ref={chatBottomRef} />
                                </div>
                                <form onSubmit={handleSendReply} className="p-2 bg-stone-700 flex gap-2">
                                    <input value={replyMsg} onChange={e=>setReplyMsg(e.target.value)} placeholder="Reply..." className="flex-1 px-3 py-2 bg-stone-900 rounded text-sm text-white outline-none" />
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded font-bold transition-colors">Send</button>
                                </form>
                            </>
                        ) : <div className="flex items-center justify-center h-full text-stone-500">Select Chat</div>}
                    </div>
                </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* ARTICLES FORM */}
                    <div className={`bg-stone-800 p-4 rounded-xl border ${editItem?.type === 'articles' ? 'border-emerald-500' : 'border-stone-700'} md:col-span-2`}>
                        <h3 className="font-bold mb-3 flex justify-between items-center text-emerald-400">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Article Editor
                            </span>
                            <div className="flex bg-stone-700 rounded p-1">
                                <button onClick={() => setArticleMode('link')} className={`px-3 py-1 text-xs rounded transition-colors ${articleMode==='link' ? 'bg-emerald-600 text-white' : 'text-stone-400'}`}>Link</button>
                                <button onClick={() => setArticleMode('write')} className={`px-3 py-1 text-xs rounded transition-colors ${articleMode==='write' ? 'bg-emerald-600 text-white' : 'text-stone-400'}`}>Write</button>
                            </div>
                        </h3>
                        <form onSubmit={(e) => handleSubmit(e, 'articles', artForm, { title:'', cat:'', read:'', desc:'', img:'', link:'', content:'' })} className="flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <input value={artForm.title} onChange={e => setArtForm({...artForm, title: e.target.value})} placeholder="Title" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                <input value={artForm.cat} onChange={e => setArtForm({...artForm, cat: e.target.value})} placeholder="Category" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input value={artForm.read} onChange={e => setArtForm({...artForm, read: e.target.value})} placeholder="Time (e.g 5 min)" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                <input value={artForm.img} onChange={e => setArtForm({...artForm, img: e.target.value})} placeholder="Cover Image URL" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                            </div>
                            <textarea value={artForm.desc} onChange={e => setArtForm({...artForm, desc: e.target.value})} placeholder="Short Description" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                            
                            {articleMode === 'link' ? (
                                <input value={artForm.link} onChange={e => setArtForm({...artForm, link: e.target.value})} placeholder="External Link (Medium/LinkedIn)" required className="px-3 py-2 bg-stone-700 rounded text-sm border border-emerald-500/50" />
                            ) : (
                                <div className="bg-white text-black rounded h-64 overflow-hidden mb-2">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={artForm.content || ''} 
                                        onChange={(content) => setArtForm({...artForm, content})} 
                                        modules={modules}
                                        className="h-52"
                                        placeholder="Write your article here..."
                                    />
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 py-2 rounded font-bold text-sm mt-2 transition-colors">{loading ? 'Saving...' : 'Publish Article'}</button>
                        </form>
                    </div>

                    {/* ADMIN ONLY FORMS (SERVICES & JOURNEY) */}
                    {isAdmin && (
                        <div className="space-y-6">
                            
                            {/* 🔥 SERVICES FORM */}
                            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                                <h3 className="font-bold mb-3 text-indigo-400 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Services (Fiverr)
                                </h3>
                                <form onSubmit={(e) => handleSubmit(e, 'services', serForm, { title:'', desc:'', price:'', rating:'', img:'', link:'' })} className="flex flex-col gap-2">
                                    <input value={serForm.title} onChange={e => setSerForm({...serForm, title: e.target.value})} placeholder="Gig Title" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    <textarea value={serForm.desc} onChange={e => setSerForm({...serForm, desc: e.target.value})} placeholder="Service Description" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <input value={serForm.price} onChange={e => setSerForm({...serForm, price: e.target.value})} placeholder="Price ($)" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                        <input value={serForm.rating} onChange={e => setSerForm({...serForm, rating: e.target.value})} placeholder="Rating (e.g 5.0)" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    </div>
                                    
                                    <input value={serForm.img} onChange={e => setSerForm({...serForm, img: e.target.value})} placeholder="Gig Image URL" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    <input value={serForm.link} onChange={e => setSerForm({...serForm, link: e.target.value})} placeholder="Fiverr Link URL" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    
                                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-bold text-sm mt-2 transition-colors">Update Service</button>
                                </form>
                            </div>

                            {/* 🔥 JOURNEY FORM */}
                            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                                <h3 className="font-bold mb-3 text-amber-400 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Journey (Timeline)
                                </h3>
                                <form onSubmit={(e) => handleSubmit(e, 'journey', journeyForm, { title:'', place:'', date:'', desc:'', type:'edu' })} className="flex flex-col gap-2">
                                    <input value={journeyForm.title} onChange={e => setJourneyForm({...journeyForm, title: e.target.value})} placeholder="Title (e.g BSc Degree)" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    <input value={journeyForm.place} onChange={e => setJourneyForm({...journeyForm, place: e.target.value})} placeholder="Place (e.g University of Ruhuna)" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <input value={journeyForm.date} onChange={e => setJourneyForm({...journeyForm, date: e.target.value})} placeholder="Year (e.g 2024)" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                        <select value={journeyForm.type} onChange={e => setJourneyForm({...journeyForm, type: e.target.value})} className="px-3 py-2 bg-stone-700 rounded text-sm">
                                            <option value="edu">Education 🎓</option>
                                            <option value="work">Work 💼</option>
                                        </select>
                                    </div>

                                    <textarea value={journeyForm.desc} onChange={e => setJourneyForm({...journeyForm, desc: e.target.value})} placeholder="Short Description" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    
                                    <button type="submit" className="bg-amber-600 hover:bg-amber-500 py-2 rounded font-bold text-sm mt-2 transition-colors">Update Timeline</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* USER ARTICLES LIST */}
                    {!isAdmin && userArticles.length > 0 && (
                        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 md:col-span-1">
                            <h3 className="font-bold mb-3 text-emerald-400">My Articles</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {userArticles.map(art => (
                                    <div key={art.id} className="flex justify-between items-center bg-stone-700 p-2 rounded">
                                        <span className="text-xs truncate w-24">{art.title}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => setEditItem({...art, type:'articles'})} className="text-xs bg-blue-500 px-2 rounded hover:bg-blue-600 transition-colors">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteArticle(art.id)} className="text-xs bg-red-500 px-2 rounded hover:bg-red-600 transition-colors">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* INBOX */}
            {isAdmin && activeTab === 'dashboard' && (
                <div className="border-t border-stone-700 pt-6 pb-6">
                    <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Inbox
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {messages.length === 0 ? <p className="text-stone-500">No new messages.</p> : messages.map(msg => (
                            <div key={msg.id} className="bg-stone-800 p-3 rounded-lg border border-stone-600 flex flex-col gap-2 hover:bg-stone-700 transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {msg.name}
                                    </span>
                                    <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                                <p className="text-xs text-stone-300">{msg.message}</p>
                                <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Reply via Email
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
      )}
    </div>
  );
}