import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function LoginModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false); // Toggle Login/Register
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState(''); // For new users
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // --- SIGN UP ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        // Add Display Name
        await updateProfile(userCredential.user, { displayName: name });
        alert("Account Created! Welcome");
      } else {
        // --- LOGIN ---
        await signInWithEmailAndPassword(auth, email, pass);
        alert("Welcome Back!");
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div className="glass-panel rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-fade-in-up bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        
        {/* Close Button (SVG) */}
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-transform hover:rotate-90 duration-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h3 className="text-2xl font-bold mb-1 text-stone-900 dark:text-white flex items-center gap-2">
            {isRegister ? (
                <>
                    Join Community 
                    <svg className="w-6 h-6 text-emerald-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </>
            ) : (
                <>
                    Welcome Back 
                    <svg className="w-6 h-6 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </>
            )}
        </h3>
        <p className="text-xs text-stone-500 mb-6">
            {isRegister ? 'Create an account to publish articles.' : 'Login to manage your content.'}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isRegister && (
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </span>
                    <input type="text" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required className="pl-10 w-full px-4 py-2 border rounded-lg dark:bg-stone-800 dark:border-stone-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>
            )}
            
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="pl-10 w-full px-4 py-2 border rounded-lg dark:bg-stone-800 dark:border-stone-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>

            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} required className="pl-10 w-full px-4 py-2 border rounded-lg dark:bg-stone-800 dark:border-stone-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
            
            {error && (
                <p className="text-red-500 text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </p>
            )}
            
            <button type="submit" disabled={loading} className="w-full bg-stone-900 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold transition-all mt-2 flex items-center justify-center gap-2">
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                    </>
                ) : (
                    isRegister ? 'Sign Up' : 'Login'
                )}
            </button>
        </form>

        <div className="mt-4 text-center text-xs text-stone-500">
            {isRegister ? "Already have an account?" : "Don't have an account?"} 
            <button onClick={() => setIsRegister(!isRegister)} className="ml-1 text-emerald-600 font-bold hover:underline">
                {isRegister ? "Login" : "Register"}
            </button>
        </div>

      </div>
    </div>
  );
}