import React from 'react'
import { LayoutDashboard, ListTodo, Activity, Bell, Settings, HelpCircle, ShieldCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ListTodo, label: 'Vazifalar', path: '/tasks' },
  { icon: Activity, label: 'Analitika', path: '/analytics' },
  { icon: ShieldCheck, label: 'Audit Loglari', path: '/audit' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r border-slate-800/50 bg-slate-900/10 backdrop-blur-xl flex flex-col items-stretch pt-8 pb-6 px-4 shrink-0 transition-transform duration-300 lg:translate-x-0 -translate-x-full fixed lg:static z-20">
      <div className="flex items-center gap-3 px-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center border border-cyan-500/30">
          <Activity className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold font-sans tracking-tight text-white leading-none">Aqlli Nazorat</span>
          <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-semibold mt-1">Smart Control</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative",
                isActive 
                  ? "bg-cyan-600/15 text-cyan-400 border border-cyan-500/20 neon-glow" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-200")} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Sozlamalar</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Yordam</span>
        </button>
      </div>
    </aside>
  )
}
