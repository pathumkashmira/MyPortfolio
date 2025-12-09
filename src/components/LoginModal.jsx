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
        alert("Account Created! Welcome 🎉");
      } else {
        // --- LOGIN ---
        await signInWithEmailAndPassword(auth, email, pass);
        alert("Welcome Back! 🚀");
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div className="glass-panel rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-fade-in-up">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-red-500 font-bold">X</button>

        <h3 className="text-2xl font-bold mb-1 text-stone-900 dark:text-white">
            {isRegister ? 'Join Community 🚀' : 'Welcome Back 👋'}
        </h3>
        <p className="text-xs text-stone-500 mb-6">
            {isRegister ? 'Create an account to publish articles.' : 'Login to manage your content.'}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isRegister && (
                <input type="text" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required className="px-4 py-2 border rounded-lg dark:bg-stone-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
            )}
            
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="px-4 py-2 border rounded-lg dark:bg-stone-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} required className="px-4 py-2 border rounded-lg dark:bg-stone-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
            
            {error && <p className="text-red-500 text-xs bg-red-100 p-2 rounded">{error}</p>}
            
            <button type="submit" disabled={loading} className="w-full bg-stone-900 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold transition-all mt-2">
                {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Login')}
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