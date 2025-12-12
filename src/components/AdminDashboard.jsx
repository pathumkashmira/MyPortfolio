import React, { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, orderBy, onSnapshot, arrayUnion, where, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  
  // 🔥 UPDATED: Journey Form State (Added category & image)
  const [journeyForm, setJourneyForm] = useState({ title:'', place:'', date:'', desc:'', category:'Professional', image:'' });
  
  // Airdrop & Timeline States
  const [airdropForm, setAirdropForm] = useState({ title:'', platform:'', value:'', description:'', image:'', link:'' });
  const [timelineUpdate, setTimelineUpdate] = useState({ id: '', date: new Date().toISOString().split('T')[0], title: '', desc: '' });
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

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
      // 🔥 Journey Edit
      if (editItem.type === 'journey') setJourneyForm(editItem);
      if (editItem.type === 'airdrops') setAirdropForm(editItem);
    }
  }, [editItem]);

  const handleLogout = () => { auth.signOut(); window.location.reload(); };
  
  const handleCancelEdit = () => { 
      setEditItem(null); 
      setArtForm({ title:'', cat:'', read:'', desc:'', img:'', link:'', content:'' }); 
      setSerForm({ title:'', desc:'', price:'', rating:'', img:'', link:'' }); 
      // 🔥 Reset Journey Form
      setJourneyForm({ title:'', place:'', date:'', desc:'', category:'Professional', image:'' });
      setAirdropForm({ title:'', platform:'', value:'', description:'', image:'', link:'' });
      setTimelineUpdate({ id: '', date: new Date().toISOString().split('T')[0], title: '', desc: '' });
      setIsEditingTimeline(false);
  };

  // 🔥 IMAGE UPLOAD FUNCTION (USING IMGBB)
  const handleImageUpload = async (e, formSetter, currentForm) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
        const API_KEY = "8cc6c29b5eec4e44b4fc02f4df17fa94"; 
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.success) {
            const url = data.data.url; 
            formSetter({ ...currentForm, image: url, img: url }); 
            alert("Image Uploaded! 📸");
        } else {
            throw new Error("ImgBB Upload Failed");
        }
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Upload Failed: " + error.message);
    }
    setUploadingImg(false);
  };

  // 🔥 TIMELINE HANDLERS
  const handleSaveTimelineUpdate = async () => {
      if(!editItem || editItem.type !== 'airdrops' || !timelineUpdate.title) return alert("Fill required fields!");
      setLoading(true);
      try {
          const docRef = doc(db, 'airdrops', editItem.id);
          const docSnap = await getDoc(docRef);
          let currentTimeline = docSnap.data().timeline || [];

          if (isEditingTimeline) {
              const updatedTimeline = currentTimeline.map(item => item.id === timelineUpdate.id ? timelineUpdate : item);
              await updateDoc(docRef, { timeline: updatedTimeline });
              alert("Timeline Updated! 🔄");
          } else {
              const newUpdate = { ...timelineUpdate, id: Date.now().toString() };
              await updateDoc(docRef, { timeline: [...currentTimeline, newUpdate] });
              alert("New Update Added! 🚀");
          }
          
          setTimelineUpdate({ id: '', date: new Date().toISOString().split('T')[0], title: '', desc: '' });
          setIsEditingTimeline(false);
          const updatedDoc = await getDoc(docRef);
          setEditItem({ ...updatedDoc.data(), id: editItem.id, type: 'airdrops' });
      } catch (e) { alert("Error: " + e.message); }
      setLoading(false);
  };

  const handleDeleteTimelineItem = async (itemId) => {
      if(!confirm("Delete this update?")) return;
      setLoading(true);
      try {
          const docRef = doc(db, 'airdrops', editItem.id);
          const docSnap = await getDoc(docRef);
          const currentTimeline = docSnap.data().timeline || [];
          const newTimeline = currentTimeline.filter(item => item.id !== itemId);
          await updateDoc(docRef, { timeline: newTimeline });
          const updatedDoc = await getDoc(docRef);
          setEditItem({ ...updatedDoc.data(), id: editItem.id, type: 'airdrops' });
      } catch (e) { alert("Error: " + e.message); }
      setLoading(false);
  };

  const handleEditTimelineItem = (item) => {
      setTimelineUpdate(item);
      setIsEditingTimeline(true);
      document.getElementById('timeline-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e, collectionName, data, formResetInfo) => {
    e.preventDefault(); 
    if (collectionName === 'articles') {
        const dataSize = new Blob([JSON.stringify(data)]).size;
        if (dataSize > 900000) { alert("⚠️ Content too large!"); return; }
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
            if(collectionName === 'airdrops') setAirdropForm(formResetInfo);
        }
        if(!isAdmin) window.location.reload(); 
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  };

  const handleDeleteMessage = async (id) => { if(confirm("Delete?")) { try { await deleteDoc(doc(db, "messages", id)); setMessages(messages.filter(m => m.id !== id)); } catch (e) { alert(e.message); } } };
  const handleDeleteArticle = async (id) => { if(confirm("Delete?")) { try { await deleteDoc(doc(db, "articles", id)); setUserArticles(userArticles.filter(a => a.id !== id)); } catch (e) { alert(e.message); } } };

  const modules = { toolbar: [[{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{'list': 'ordered'}, {'list': 'bullet'}], ['link', 'image', 'code-block'], ['clean']] };

  return (
    <div className={`mb-10 bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-stone-700 sticky top-20 z-40 transition-all duration-500 ease-in-out ${isMinimized ? 'h-20 overflow-hidden' : 'max-h-[85vh] overflow-y-auto'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-700">
          <div className="flex gap-4 items-center">
              <button onClick={() => setIsMinimized(!isMinimized)} className="bg-stone-700 hover:bg-stone-600 p-2 rounded-full transition-colors">
                  {isMinimized ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>}
              </button>
              <button onClick={() => setActiveTab('dashboard')} className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-stone-400'}`}>
                {isAdmin ? 'Admin Panel' : 'Creator Dashboard'}
              </button>
              {isAdmin && !isMinimized && <button onClick={() => setActiveTab('chat')} className={`text-lg font-bold flex items-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-blue-400' : 'text-stone-400'}`}>Chat <span className="text-xs bg-red-600 px-2 rounded-full text-white">{chats.filter(c => c.unread).length}</span></button>}
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
                <div className="flex flex-col gap-12 mb-12 max-w-5xl mx-auto">
                    
                    {/* ARTICLES FORM */}
                    <div className={`bg-stone-800 p-6 rounded-2xl border ${editItem?.type === 'articles' ? 'border-emerald-500' : 'border-stone-700'} shadow-lg`}>
                        <h3 className="text-xl font-bold mb-4 flex justify-between items-center text-emerald-400">
                            <span className="flex items-center gap-2">📝 Article Editor</span>
                            <div className="flex bg-stone-700 rounded p-1">
                                <button onClick={() => setArticleMode('link')} className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${articleMode==='link' ? 'bg-emerald-600 text-white' : 'text-stone-400'}`}>Link</button>
                                <button onClick={() => setArticleMode('write')} className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${articleMode==='write' ? 'bg-emerald-600 text-white' : 'text-stone-400'}`}>Write</button>
                            </div>
                        </h3>
                        <form onSubmit={(e) => handleSubmit(e, 'articles', artForm, { title:'', cat:'', read:'', desc:'', img:'', link:'', content:'' })} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={artForm.title} onChange={e => setArtForm({...artForm, title: e.target.value})} placeholder="Article Title" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                <input value={artForm.cat} onChange={e => setArtForm({...artForm, cat: e.target.value})} placeholder="Category" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={artForm.read} onChange={e => setArtForm({...artForm, read: e.target.value})} placeholder="Read Time" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                <div className="flex items-center gap-2 bg-stone-700 rounded-lg px-2">
                                    <input type="file" onChange={(e) => handleImageUpload(e, setArtForm, artForm)} className="text-xs text-stone-400 w-full" />
                                    {uploadingImg && <span className="text-xs text-emerald-500 animate-pulse whitespace-nowrap">Uploading...</span>}
                                    <input value={artForm.img} disabled placeholder="Cover Image URL" className="bg-transparent text-white text-sm w-full p-2 outline-none" />
                                </div>
                            </div>
                            <textarea value={artForm.desc} onChange={e => setArtForm({...artForm, desc: e.target.value})} placeholder="Short Description..." required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none h-24" />
                            {articleMode === 'link' ? (
                                <input value={artForm.link} onChange={e => setArtForm({...artForm, link: e.target.value})} placeholder="External Link URL" className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                            ) : (
                                <div className="bg-white text-black rounded-lg h-96 overflow-hidden">
                                    <ReactQuill theme="snow" value={artForm.content || ''} onChange={(content) => setArtForm({...artForm, content})} modules={modules} className="h-80" placeholder="Write here..." />
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-bold text-lg mt-2 transition-all">
                                {editItem && editItem.type === 'articles' ? 'Update Article' : 'Publish Article'}
                            </button>
                        </form>
                    </div>

                    {/* ADMIN ONLY FORMS */}
                    {isAdmin && (
                        <>
                            {/* 🔥 AIRDROP FORM */}
                            <div className={`bg-stone-800 p-6 rounded-2xl border ${editItem?.type === 'airdrops' ? 'border-purple-500' : 'border-stone-700'} shadow-lg`}>
                                <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                                    🚀 Manage Airdrops
                                </h3>
                                <form onSubmit={(e) => handleSubmit(e, 'airdrops', airdropForm, { title:'', platform:'', value:'', description:'', image:'', link:'' })} className="flex flex-col gap-4">
                                    <input value={airdropForm.title} onChange={e => setAirdropForm({...airdropForm, title: e.target.value})} placeholder="Airdrop Title" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input value={airdropForm.platform} onChange={e => setAirdropForm({...airdropForm, platform: e.target.value})} placeholder="Platform" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                        <input value={airdropForm.value} onChange={e => setAirdropForm({...airdropForm, value: e.target.value})} placeholder="Estimated Value ($)" className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                    </div>
                                    <div className="flex items-center gap-2 bg-stone-700 rounded-lg px-2">
                                        <input type="file" onChange={(e) => handleImageUpload(e, setAirdropForm, airdropForm)} className="text-xs text-stone-400 w-full py-3" />
                                        {uploadingImg && <span className="text-xs text-purple-500 animate-pulse whitespace-nowrap">Uploading...</span>}
                                        <input value={airdropForm.image} disabled placeholder="Image URL" className="bg-transparent text-white text-sm w-full p-2 outline-none" />
                                    </div>
                                    <input value={airdropForm.link} onChange={e => setAirdropForm({...airdropForm, link: e.target.value})} placeholder="Airdrop Link" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                    <div className="bg-white text-black rounded-lg h-80 overflow-hidden">
                                        <ReactQuill theme="snow" value={airdropForm.description || ''} onChange={(content) => setAirdropForm({...airdropForm, description: content})} modules={modules} className="h-64" placeholder="Guide..." />
                                    </div>
                                    <button type="submit" className="bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold text-lg mt-2 transition-all">
                                        {editItem && editItem.type === 'airdrops' ? 'Update Airdrop' : 'Publish Airdrop'}
                                    </button>
                                </form>

                                {/* Timeline Updates Manager */}
                                {editItem && editItem.type === 'airdrops' && (
                                    <div id="timeline-form" className="mt-8 pt-6 border-t-2 border-stone-600">
                                        <h4 className="text-lg font-bold text-white mb-4 bg-stone-700 p-3 rounded-lg">📅 Manage Timeline Updates</h4>
                                        <div className="max-h-60 overflow-y-auto mb-6 space-y-3 bg-stone-900/50 p-4 rounded-xl custom-scrollbar border border-stone-700">
                                            {editItem.timeline && editItem.timeline.length > 0 ? (
                                                editItem.timeline.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-stone-800 p-3 rounded-lg border border-stone-700">
                                                        <div className="flex flex-col"><span className="text-emerald-400 font-mono text-xs">{item.date}</span><span className="font-bold text-white">{item.title}</span></div>
                                                        <div className="flex gap-3">
                                                            <button onClick={() => handleEditTimelineItem(item)} className="p-2 bg-blue-900/50 text-blue-400 rounded">✏️</button>
                                                            <button onClick={() => handleDeleteTimelineItem(item.id)} className="p-2 bg-red-900/50 text-red-400 rounded">🗑️</button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : <p className="text-stone-500 text-center py-4">No updates yet.</p>}
                                        </div>
                                        <div className="flex flex-col gap-4 bg-stone-900 p-6 rounded-xl border border-stone-600">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <input value={timelineUpdate.date} onChange={e => setTimelineUpdate({...timelineUpdate, date: e.target.value})} type="date" className="px-4 py-3 bg-stone-800 rounded-lg text-white w-full md:w-1/3 outline-none" />
                                                <input value={timelineUpdate.title} onChange={e => setTimelineUpdate({...timelineUpdate, title: e.target.value})} placeholder="Update Title" className="px-4 py-3 bg-stone-800 rounded-lg text-white w-full md:w-2/3 outline-none" />
                                            </div>
                                            <div className="bg-white text-black rounded-lg h-60 overflow-hidden">
                                                <ReactQuill theme="snow" value={timelineUpdate.desc || ''} onChange={(content) => setTimelineUpdate({...timelineUpdate, desc: content})} modules={modules} className="h-44" placeholder="Details..." />
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleSaveTimelineUpdate} type="button" className={`flex-1 text-white text-lg py-3 rounded-lg font-bold transition-all ${isEditingTimeline ? 'bg-amber-600' : 'bg-blue-600'}`}>{isEditingTimeline ? 'Save Changes' : '+ Add Update'}</button>
                                                {isEditingTimeline && <button onClick={() => { setIsEditingTimeline(false); setTimelineUpdate({ id: '', date: '', title: '', desc: '' }); }} className="bg-stone-700 px-6 rounded-lg font-bold">Cancel</button>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 🔥 JOURNEY FORM (UPDATED WITH CATEGORY & IMAGE & RICH TEXT) */}
                            <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    🎓 Manage Journey (Timeline)
                                </h3>
                                <form onSubmit={(e) => handleSubmit(e, 'journey', journeyForm, { title:'', place:'', date:'', desc:'', category:'Professional', image:'' })} className="flex flex-col gap-4">
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input value={journeyForm.title} onChange={e => setJourneyForm({...journeyForm, title: e.target.value})} placeholder="Title (e.g. BSc Degree)" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500" />
                                        <select value={journeyForm.category} onChange={e => setJourneyForm({...journeyForm, category: e.target.value})} className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500">
                                            <option value="Professional">Professional 💼</option>
                                            <option value="Academic">Academic 🎓</option>
                                            <option value="Non-Academic">Non-Academic 🏅</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input value={journeyForm.place} onChange={e => setJourneyForm({...journeyForm, place: e.target.value})} placeholder="Place / Institution" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500" />
                                        <input value={journeyForm.date} onChange={e => setJourneyForm({...journeyForm, date: e.target.value})} placeholder="Year Range (e.g. 2020 - 2024)" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500" />
                                    </div>

                                    {/* Journey Image Upload */}
                                    <div className="flex items-center gap-2 bg-stone-700 rounded-lg px-2">
                                        <span className="text-stone-400 text-xs px-2">IMG:</span>
                                        <input type="file" onChange={(e) => handleImageUpload(e, setJourneyForm, journeyForm)} className="text-xs text-stone-400 w-full py-3" />
                                        {uploadingImg && <span className="text-xs text-amber-500 animate-pulse whitespace-nowrap">Uploading...</span>}
                                        <input value={journeyForm.image} disabled placeholder="Image URL (Optional)" className="bg-transparent text-white text-sm w-full p-2 outline-none" />
                                    </div>

                                    {/* Rich Text for Journey Description */}
                                    <div className="bg-white text-black rounded-lg h-60 overflow-hidden">
                                        <ReactQuill theme="snow" value={journeyForm.desc || ''} onChange={(content) => setJourneyForm({...journeyForm, desc: content})} modules={modules} className="h-44" placeholder="Detailed Description..." />
                                    </div>

                                    <button type="submit" className="bg-amber-600 hover:bg-amber-500 py-3 rounded-lg font-bold text-lg mt-2 transition-all shadow-lg hover:shadow-amber-500/20">
                                        {editItem && editItem.type === 'journey' ? 'Update Journey Item' : 'Add to Journey'}
                                    </button>
                                </form>
                            </div>

                            {/* SERVICES FORM */}
                            <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-indigo-400">💼 Manage Services</h3>
                                <form onSubmit={(e) => handleSubmit(e, 'services', serForm, { title:'', desc:'', price:'', rating:'', img:'', link:'' })} className="flex flex-col gap-4">
                                    <input value={serForm.title} onChange={e => setSerForm({...serForm, title: e.target.value})} placeholder="Gig Title" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                    <textarea value={serForm.desc} onChange={e => setSerForm({...serForm, desc: e.target.value})} placeholder="Service Description" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none h-32" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input value={serForm.price} onChange={e => setSerForm({...serForm, price: e.target.value})} placeholder="Price ($)" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                        <input value={serForm.rating} onChange={e => setSerForm({...serForm, rating: e.target.value})} placeholder="Rating (e.g. 5.0)" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                    </div>
                                    <div className="flex items-center gap-2 bg-stone-700 rounded-lg px-2">
                                        <input type="file" onChange={(e) => handleImageUpload(e, setSerForm, serForm)} className="text-xs text-stone-400 w-full py-3" />
                                        {uploadingImg && <span className="text-xs text-indigo-500 animate-pulse whitespace-nowrap">Uploading...</span>}
                                        <input value={serForm.img} disabled placeholder="Image URL" className="bg-transparent text-white text-sm w-full p-2 outline-none" />
                                    </div>
                                    <input value={serForm.link} onChange={e => setSerForm({...serForm, link: e.target.value})} placeholder="Fiverr Link" required className="px-4 py-3 bg-stone-700 rounded-lg text-white outline-none" />
                                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold text-lg mt-2 transition-all">
                                        {editItem && editItem.type === 'services' ? 'Update Service' : 'Add New Service'}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {/* USER ARTICLES LIST */}
                    {!isAdmin && userArticles.length > 0 && (
                        <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700 shadow-lg">
                            <h3 className="text-xl font-bold mb-4 text-emerald-400">📄 My Articles</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {userArticles.map(art => (
                                    <div key={art.id} className="flex justify-between items-center bg-stone-700 p-4 rounded-xl border border-stone-600">
                                        <span className="font-bold text-white truncate w-2/3">{art.title}</span>
                                        <div className="flex gap-3">
                                            <button onClick={() => setEditItem({...art, type:'articles'})} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                                            <button onClick={() => handleDeleteArticle(art.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* INBOX (Full Width) */}
            {isAdmin && activeTab === 'dashboard' && (
                <div className="border-t border-stone-700 pt-10 pb-10 max-w-5xl mx-auto">
                    <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        📬 Inbox Messages
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {messages.length === 0 ? <p className="text-stone-500 text-lg">No new messages yet.</p> : messages.map(msg => (
                            <div key={msg.id} className="bg-stone-800 p-5 rounded-2xl border border-stone-600 flex flex-col gap-3 hover:bg-stone-750 transition-colors shadow-md">
                                <div className="flex justify-between items-center border-b border-stone-700 pb-2">
                                    <span className="font-bold text-emerald-400 text-lg flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {msg.name}
                                    </span>
                                    <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-400 bg-red-900/20 p-2 rounded-full transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                                <p className="text-stone-300 italic bg-stone-900/50 p-3 rounded-lg">"{msg.message}"</p>
                                <a href={`mailto:${msg.email}`} className="text-sm text-blue-400 hover:underline flex items-center gap-1 mt-auto">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Reply to: {msg.email}
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