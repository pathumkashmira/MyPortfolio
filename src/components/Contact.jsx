import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Contact({ openChat }) {
  const [adminOnline, setAdminOnline] = useState(false);

  // Check Online Status to show on button
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'stats', 'status'), (doc) => {
        if (doc.exists()) setAdminOnline(doc.data().online);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent via Email Form! (Check 'Inbox' in Admin Dashboard)");
  };

  return (
    <div id="page-contact" className="page-section">
       <section className="max-w-4xl mx-auto pt-10 reveal">
            
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Get in Touch</h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2">Choose how you want to connect with me.</p>
            </div>

            {/* 🔥 NEW: CHOICE SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                
                {/* 1. LIVE CHAT OPTION */}
                <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                    <div className="mb-4 relative">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-stone-800 border-2 ${adminOnline ? 'border-emerald-500' : 'border-stone-600'}`}>
                            {/* Animated Chat SVG */}
                            <svg className={`w-8 h-8 ${adminOnline ? 'text-emerald-400 animate-pulse' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        {adminOnline && <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-stone-900 rounded-full animate-pulse"></span>}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Live Chat</h3>
                    <p className="text-stone-400 text-sm mb-6">
                        {adminOnline ? "I'm Online! Let's talk right now." : "I'm currently away. Leave a message."}
                    </p>
                    <button 
                        onClick={openChat}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 group-hover:shadow-emerald-500/20"
                    >
                        Start Chatting Now
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>

                {/* 2. EMAIL / INFO OPTION */}
                <div className="bg-white dark:bg-dark-card border border-stone-200 dark:border-stone-700 p-8 rounded-2xl shadow-sm flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg group hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </span>
                            <div>
                                <p className="text-xs text-stone-500 uppercase font-bold">Email</p>
                                <p className="text-sm font-medium dark:text-white">pethumkashmira@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg group hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                            <span className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </span>
                            <div>
                                <p className="text-xs text-stone-500 uppercase font-bold">Location</p>
                                <p className="text-sm font-medium dark:text-white">Polonnaruwa, Sri Lanka</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 🔥 STANDARD FORM (Below) */}
            <div className="glass-panel bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-stone-200 dark:border-dark-border overflow-hidden p-8">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 border-b border-stone-200 dark:border-stone-700 pb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Send a Detailed Message
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Your Name</label>
                        <input type="text" required className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Your Email</label>
                        <input type="email" required className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Message</label>
                        <textarea rows="4" required className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 group">
                            Send Email Message
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

       </section>
    </div>
  );
}