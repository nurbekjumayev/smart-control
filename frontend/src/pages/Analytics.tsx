import React from 'react'
import { TrendingUp, Users, CheckCircle2, HelpingHand, Award, Zap } from 'lucide-react'
import { useSmartStore } from '../store/useSmartStore'
import { motion } from 'framer-motion'

export function Analytics() {
  const { users, tasks, helpRequests } = useSmartStore()
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'Done').length
  const inProgressTasks = tasks.filter(t => t.status === 'InProgress').length
  const totalHelpTransfers = helpRequests.filter(h => h.status === 'Accepted').length

  const topHelpers = users.map(user => ({
    name: user.name,
    helpGiven: helpRequests.filter(h => h.toUserId === user.id && h.status === 'Accepted').length,
    avatar: user.avatar
  })).sort((a, b) => b.helpGiven - a.helpGiven).slice(0, 3)

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs">
             <TrendingUp className="w-4 h-4" /> Unumdorlik Analitikasi
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AKT Bo'limi Statistikasi</h1>
          <p className="text-slate-400 font-medium">Jamoa unumdorligi va yordam resurslari tahlili</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner shadow-slate-950/40">
           <button className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold text-xs shadow-lg uppercase tracking-wide">Bugun</button>
           <button className="px-4 py-2 text-slate-500 hover:text-white rounded-lg font-bold text-xs transition-colors uppercase tracking-wide">Hafta</button>
           <button className="px-4 py-2 text-slate-500 hover:text-white rounded-lg font-bold text-xs transition-colors uppercase tracking-wide">Oy</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jami Vazifalar', value: totalTasks, icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Bajarilmoqda', value: inProgressTasks, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { label: 'Tugallangan', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'O\'zaro Yordam', value: totalHelpTransfers, icon: HelpingHand, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            key={stat.label} className="glass-card p-6 border-slate-800/50 shadow-lg relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} -mr-12 -mt-12 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700 opacity-60`} />
            <div className="flex items-center gap-4 relative">
              <div className={`p-4 ${stat.bg} rounded-2xl border border-white/5`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Helpers */}
        <section className="glass-card p-8 border-slate-800/40 relative">
          <h3 className="text-lg font-bold text-white mb-8 border-l-2 border-emerald-500 pl-4">Eng faol yordamchilar (Top)</h3>
          <div className="space-y-6">
            {topHelpers.map((helper, idx) => (
              <div key={helper.name} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all hover:bg-slate-800/40">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={helper.avatar} className="w-12 h-12 rounded-full border-2 border-slate-700 p-0.5" />
                    <div className="absolute -top-2 -left-2 bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-slate-950">
                       {idx + 1}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white">{helper.name}</div>
                    <div className="text-xs text-slate-500 font-bold tracking-tight">Mutaxassis</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-400">{helper.helpGiven}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Yordam bergan</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Workload Chart Map */}
        <section className="glass-card p-8 border-slate-800/40 opacity-80 flex flex-col items-center justify-center space-y-4">
           <TrendingUp className="w-16 h-16 text-slate-800 mb-2" />
           <div className="text-center">
             <div className="text-slate-400 font-bold text-sm">Grafiklar tizimi Render servisi orqali real vaqtda yangilanadi.</div>
             <div className="text-xs text-slate-600 font-bold mt-1 uppercase tracking-tighter italic">Vizuallashmoqda...</div>
           </div>
        </section>
      </div>
    </div>
  )
}
