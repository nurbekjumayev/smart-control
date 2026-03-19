import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User as UserIcon, Lock, ArrowRight, Loader } from 'lucide-react';
import { useSmartStore } from '../store/useSmartStore';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, users } = useSmartStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call for login
    setTimeout(() => {
      // Flexible login: search case-insensitive in user names
      const searchStr = telegramId.toLowerCase();
      const user = users.find(u => u.name.toLowerCase().includes(searchStr));
      
      if (user && password === '123') { 
        login(user);
        navigate('/');
      } else {
        setError('Telegram ID yoki parol xato!');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 border-slate-800/50 shadow-2xl relative overflow-hidden">
          {/* Top border highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-600" />
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-900/30 flex items-center justify-center mb-4 border border-cyan-500/30 neon-glow">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Aqlli Nazorat</h1>
            <p className="text-slate-400 font-medium text-sm mt-2">IT Bo'limi Boshqaruv Tizimi (RBAC)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Foydalanuvchi ID</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="Ismingizni kiriting (masalan: Alisher)" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-600 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Maxfiy Parol</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-600 transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading || !telegramId || !password}
              className="w-full relative group overflow-hidden bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Tizimga kirish</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs font-bold text-slate-500 mt-8 pt-6 border-t border-slate-800/60">
            BARCHA HARAKATLAR IMMUTABLE LOG ORQALI YOZIB OLINADI.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
