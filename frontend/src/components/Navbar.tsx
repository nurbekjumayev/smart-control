import React from 'react'
import { Bell, Search, LogOut, ChevronDown } from 'lucide-react'
import { useSmartStore } from '../store/useSmartStore'

export function Navbar() {
  const { currentUser } = useSmartStore()

  if (!currentUser) return null

  return (
    <header className="h-16 border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md sticky top-0 z-10 px-6 lg:px-10 flex items-center justify-between">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Vazifalarni qidirish..." 
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-slate-500 transition-all focus:bg-slate-900 border-none bg-slate-800/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        <button className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-slate-950" />
        </button>

        <div className="h-8 w-px bg-slate-800/60 mx-1" />

        <div className="flex items-center gap-3 group cursor-pointer hover:bg-slate-800/40 p-1.5 rounded-2xl transition-all">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white leading-none capitalize">{currentUser.name}</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-1.5 py-0.5 px-2 bg-cyan-400/10 rounded-full border border-cyan-400/20">
              {currentUser.role}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center overflow-hidden">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  )
}
