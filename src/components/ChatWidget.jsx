import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';

// 🔥 Receive isOpen and setIsOpen from App.jsx
export default function ChatWidget({ isOpen, setIsOpen }) {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [guestId, setGuestId] = useState('');
  const [adminOnline, setAdminOnline] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let id = localStorage.getItem('chat_guest_id');
    if (!id) {
        id = 'guest_' + Date.now();
        localStorage.setItem('chat_guest_id', id);
    }
    setGuestId(id);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'stats', 'status'), (doc) => {
        if (doc.exists()) setAdminOnline(doc.data().online);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!guestId) return;
    const chatRef = doc(db, 'chats', guestId);
    const unsub = onSnapshot(chatRef, (docSnap) => {
        if (docSnap.exists()) {
            setMessages(docSnap.data().msgs || []);
        }
    });
    return () => unsub();
  }, [guestId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const chatRef = doc(db, 'chats', guestId);
    const newMsg = { text: msg, sender: 'guest', time: new Date().toISOString() };
    try {
        const docSnap = await getDoc(chatRef);
        if (!docSnap.exists()) {
            await setDoc(chatRef, { msgs: [newMsg], lastUpdated: new Date().toISOString(), guestId: guestId, unread: true });
        } else {
            await updateDoc(chatRef, { msgs: arrayUnion(newMsg), lastUpdated: new Date().toISOString(), unread: true });
        }
        setMsg('');
    } catch (e) { console.error("Error sending:", e); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      
      {isOpen && (
          <div className="mb-4 w-80 h-96 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-stone-200 dark:border-dark-border overflow-hidden flex flex-col glass-panel animate-fade-in-up">
            <div className="bg-stone-900 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img src="https://media.licdn.com/dms/image/v2/D4E03AQFdRsgOourY5A/profile-displayphoto-scale_200_200/B4EZqEAUJCJ0Ac-/0/1763151268578?e=1766620800&v=beta&t=YOS3Rs0HxNnuPx3hTa2zkHuHYl7Cf6iLS6WxFU-JD7s" alt="PK" className="w-8 h-8 rounded-full border border-stone-600" />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-stone-900 rounded-full ${adminOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    </div>
                    <div><h4 class="text-white font-bold text-sm">Pethum Kashmira</h4><p class="text-[10px] text-stone-400">{adminOnline ? 'Online Now' : 'Away'}</p></div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">X</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-stone-50 dark:bg-stone-900 space-y-3">
                {messages.length === 0 && <p className="text-center text-xs text-stone-400 mt-10">Hi! 👋 How can I help you today?</p>}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'guest' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg text-sm ${m.sender === 'guest' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-stone-200 dark:bg-stone-700 dark:text-white rounded-bl-none'}`}>{m.text}</div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="p-3 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 text-sm border border-stone-300 dark:border-stone-600 dark:bg-stone-900 dark:text-white rounded-full focus:outline-none focus:border-emerald-500"/>
                    <button type="submit" className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-transform active:scale-95">✈️</button>
                </form>
            </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="group bg-stone-900 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative">
        <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${adminOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
        {isOpen ? <span className="font-bold text-xl">X</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
      </button>
    </div>
  );
}