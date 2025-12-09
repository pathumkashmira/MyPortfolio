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

  // Forms
  const [articleMode, setArticleMode] = useState('link');
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
    
    // 🔥 DATA SIZE CHECK (The Fix for "Content too long")
    const dataSize = new Blob([JSON.stringify(data)]).size;
    if (dataSize > 900000) { // Limit is around 1MB (1,048,576 bytes)
        alert("⚠️ Content is too large! (Over 1MB)\n\nPlease DO NOT copy-paste images directly into the editor.\nUse the 'Image Link' button instead.");
        return;
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
      ['link', 'image'], // Use this image button to paste URL, NOT drag-drop
      ['clean']
    ],
  };

  return (
    <div className={`mb-10 bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-stone-700 sticky top-20 z-40 transition-all duration-500 ease-in-out ${isMinimized ? 'h-20 overflow-hidden' : 'max-h-[85vh] overflow-y-auto'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-700">
          <div className="flex gap-4 items-center">
              <button onClick={() => setIsMinimized(!isMinimized)} className="bg-stone-700 hover:bg-stone-600 p-2 rounded-full">{isMinimized ? '🔽' : '🔼'}</button>
              
              <button onClick={() => setActiveTab('dashboard')} className={`text-lg font-bold ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-stone-400'}`}>
                🔥 {isAdmin ? 'Admin Panel' : 'Creator Dashboard'}
              </button>
              
              {isAdmin && !isMinimized && (
                  <button onClick={() => setActiveTab('chat')} className={`text-lg font-bold flex items-center gap-2 ${activeTab === 'chat' ? 'text-blue-400' : 'text-stone-400'}`}>
                    💬 Chat <span className="text-xs bg-red-600 px-2 rounded-full text-white">{chats.filter(c => c.unread).length}</span>
                  </button>
              )}
          </div>
          <button onClick={handleLogout} className="text-xs bg-red-600 px-3 py-1 rounded">Logout</button>
      </div>

      {!isMinimized && (
        <>
            {/* ADMIN CHAT */}
            {isAdmin && activeTab === 'chat' && (
                <div className="flex h-[60vh] gap-4">
                    <div className="w-1/3 border-r border-stone-700 pr-2 overflow-y-auto custom-scrollbar">
                        {chats.length === 0 && <p className="text-stone-500 text-sm">No chats.</p>}
                        {chats.map(chat => (
                            <div key={chat.id} onClick={() => setSelectedChat(chat)} className={`p-3 rounded cursor-pointer mb-2 ${selectedChat?.id === chat.id ? 'bg-stone-700' : 'bg-stone-800 hover:bg-stone-700'}`}>
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
                                    <button type="submit" className="bg-blue-500 px-4 py-1 rounded font-bold">Send</button>
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
                        <h3 className="font-bold mb-3 flex justify-between items-center">
                            <span>📝 Article Editor</span>
                            <div className="flex bg-stone-700 rounded p-1">
                                <button onClick={() => setArticleMode('link')} className={`px-3 py-1 text-xs rounded ${articleMode==='link' ? 'bg-emerald-600 text-white' : 'text-stone-400'}`}>Link</button>
                                <button onClick={() => setArticleMode('write')} className={`px-3 py-1 text-xs rounded ${articleMode==='write' ? 'bg-emerald-600 text-white' : 'text-stone-400'}`}>Write</button>
                            </div>
                        </h3>
                        <form onSubmit={(e) => handleSubmit(e, 'articles', artForm, { title:'', cat:'', read:'', desc:'', img:'', link:'', content:'' })} className="flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <input value={artForm.title} onChange={e => setArtForm({...artForm, title: e.target.value})} placeholder="Title" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                <input value={artForm.cat} onChange={e => setArtForm({...artForm, cat: e.target.value})} placeholder="Category" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input value={artForm.read} onChange={e => setArtForm({...artForm, read: e.target.value})} placeholder="Time" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                <input value={artForm.img} onChange={e => setArtForm({...artForm, img: e.target.value})} placeholder="Image URL (Not file)" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                            </div>
                            <textarea value={artForm.desc} onChange={e => setArtForm({...artForm, desc: e.target.value})} placeholder="Short Description" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                            
                            {/* EDITOR */}
                            {articleMode === 'link' ? (
                                <input value={artForm.link} onChange={e => setArtForm({...artForm, link: e.target.value})} placeholder="External URL" required className="px-3 py-2 bg-stone-700 rounded text-sm border border-emerald-500/50" />
                            ) : (
                                <div className="bg-white text-black rounded h-64 overflow-hidden mb-2">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={artForm.content || ''} 
                                        onChange={(content) => setArtForm({...artForm, content})} 
                                        modules={modules}
                                        className="h-52"
                                        placeholder="Type here. Don't paste images directly!"
                                    />
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="bg-emerald-600 py-2 rounded font-bold text-sm mt-2">{loading ? 'Saving...' : 'Publish'}</button>
                        </form>
                    </div>

                    {/* ADMIN ONLY FORMS */}
                    {isAdmin && (
                        <div className="space-y-6">
                            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                                <h3 className="font-bold mb-3">💼 Services</h3>
                                <form onSubmit={(e) => handleSubmit(e, 'services', serForm, { title:'', desc:'', price:'', rating:'', img:'', link:'' })} className="flex flex-col gap-2">
                                    <input value={serForm.title} onChange={e => setSerForm({...serForm, title: e.target.value})} placeholder="Title" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    <textarea value={serForm.desc} onChange={e => setSerForm({...serForm, desc: e.target.value})} placeholder="Desc" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    <input value={serForm.price} onChange={e => setSerForm({...serForm, price: e.target.value})} placeholder="$$" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    <button type="submit" className="bg-indigo-600 py-2 rounded font-bold text-sm mt-2">Update Service</button>
                                </form>
                            </div>
                            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                                <h3 className="font-bold mb-3">🚀 Journey</h3>
                                <form onSubmit={(e) => handleSubmit(e, 'journey', journeyForm, { title:'', place:'', date:'', desc:'', type:'edu' })} className="flex flex-col gap-2">
                                    <input value={journeyForm.title} onChange={e => setJourneyForm({...journeyForm, title: e.target.value})} placeholder="Title" required className="px-3 py-2 bg-stone-700 rounded text-sm" />
                                    <button type="submit" className="bg-amber-600 py-2 rounded font-bold text-sm mt-2">Update Journey</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* USER ARTICLES */}
                    {!isAdmin && userArticles.length > 0 && (
                        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 md:col-span-1">
                            <h3 className="font-bold mb-3 text-emerald-400">My Articles</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {userArticles.map(art => (
                                    <div key={art.id} className="flex justify-between items-center bg-stone-700 p-2 rounded">
                                        <span className="text-xs truncate w-24">{art.title}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => setEditItem({...art, type:'articles'})} className="text-xs bg-blue-500 px-2 rounded">Edit</button>
                                            <button onClick={() => handleDeleteArticle(art.id)} className="text-xs bg-red-500 px-2 rounded">Del</button>
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
                    <h3 className="text-xl font-bold text-emerald-400 mb-4">📩 Inbox</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {messages.map(msg => (
                            <div key={msg.id} className="bg-stone-800 p-3 rounded-lg border border-stone-600 flex flex-col gap-2">
                                <div className="flex justify-between"><span className="font-bold text-emerald-400 text-sm">{msg.name}</span><button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500">🗑️</button></div>
                                <p className="text-xs text-stone-300">{msg.message}</p>
                                <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 hover:underline">Reply via Email</a>
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