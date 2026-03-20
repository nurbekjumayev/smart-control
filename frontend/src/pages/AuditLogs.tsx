import React from 'react'
import { Shield, Lock, FileText, Activity, AlertCircle, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export function AuditLogs() {
  // Demo logs for now - in real app, these come from backend
  const logs = [
    { id: 'l1', action: 'Tizimga kirish', user: 'Jumayev Nurbek', time: new Date().toISOString(), hash: 'a1b2c3d4...', status: 'Success' },
    { id: 'l2', action: 'Yangi vazifa yaratildi', user: 'Xamrayev Omon', time: new Date(Date.now() - 3600000).toISOString(), hash: 'e5f6g7h8...', status: 'Success' },
    { id: 'l3', action: 'Yordam so\'rovi yuborildi', user: 'Qosimov Elbek', time: new Date(Date.now() - 7200000).toISOString(), hash: 'i9j0k1l2...', status: 'Info' },
    { id: 'l4', action: 'Parol yangilashga urinish', user: 'Noma\'lum', time: new Date(Date.now() - 86400000).toISOString(), hash: 'm3n4o5p6...', status: 'Warning' },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/40 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-500 font-bold uppercase tracking-widest text-xs">
             <Shield className="w-4 h-4" /> Xavfsizlik va Audit
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Immutable Audit Loglari</h1>
          <p className="text-slate-400 font-medium">Barcha harakatlar SHA-256 xeshing orqali o'zgarmas shaklda saqlanadi.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl font-bold text-xs hover:text-white transition-colors">
              <Terminal className="w-4 h-4" /> JSON Export
           </button>
        </div>
      </div>

      <div className="glass-card border-none bg-slate-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <Lock className="w-6 h-6 text-slate-800" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 border-b border-slate-800/80 text-rose-500 font-black uppercase tracking-widest text-[10px]">
               <tr>
                 <th className="px-8 py-5">Sana va Vaqt</th>
                 <th className="px-8 py-5">Foydalanuvchi</th>
                 <th className="px-8 py-5">Amal / Hodisa</th>
                 <th className="px-8 py-5">Xeshlangan Kalit</th>
                 <th className="px-8 py-5">Holat</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/20 transition-all border-l-2 border-transparent hover:border-rose-500/50">
                   <td className="px-8 py-5 text-slate-500 whitespace-nowrap">
                      {format(new Date(log.time), 'yyyy-MM-dd | HH:mm:ss')}
                   </td>
                   <td className="px-8 py-5 text-slate-300 font-bold">
                      {log.user}
                   </td>
                   <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-white font-medium">
                         <Activity className="w-3.5 h-3.5 text-cyan-400" />
                         {log.action}
                      </div>
                   </td>
                   <td className="px-8 py-5">
                      <code className="text-[10px] bg-slate-950/80 px-2 py-1 rounded text-slate-600 border border-slate-800/50">
                         {log.hash}
                      </code>
                   </td>
                   <td className="px-8 py-5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                        log.status === 'Success' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                        log.status === 'Warning' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 
                        'text-cyan-500 border-cyan-500/20 bg-cyan-500/5'
                      }`}>
                         {log.status}
                      </span>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center gap-3 justify-center text-slate-700 font-bold text-xs uppercase tracking-widest py-8 italic">
         <Lock className="w-4 h-4" /> Blockchain-based integrity verification active
      </div>
    </div>
  )
}
