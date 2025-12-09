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
    // Here you would connect the 'handleContactMessage' logic from previous steps if needed
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
                            💬
                        </div>
                        {adminOnline && <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-stone-900 rounded-full animate-pulse"></span>}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Live Chat</h3>
                    <p className="text-stone-400 text-sm mb-6">
                        {adminOnline ? "I'm Online! Let's talk right now." : "I'm currently away. Leave a message."}
                    </p>
                    <button 
                        onClick={openChat}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        Start Chatting Now 🚀
                    </button>
                </div>

                {/* 2. EMAIL / INFO OPTION */}
                <div className="bg-white dark:bg-dark-card border border-stone-200 dark:border-stone-700 p-8 rounded-2xl shadow-sm flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                            <span className="text-2xl">📧</span>
                            <div>
                                <p className="text-xs text-stone-500 uppercase font-bold">Email</p>
                                <p className="text-sm font-medium dark:text-white">pethumkashmira@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                            <span className="text-2xl">📍</span>
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
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 border-b border-stone-200 dark:border-stone-700 pb-2">Send a Detailed Message</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Your Name</label>
                        <input type="text" required className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Your Email</label>
                        <input type="email" required className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Message</label>
                        <textarea rows="4" required className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                            Send Email Message
                        </button>
                    </div>
                </form>
            </div>

       </section>
    </div>
  );
}