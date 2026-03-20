import React from 'react'
import { Search, Filter, Calendar, Zap, AlertCircle } from 'lucide-react'
import { useSmartStore } from '../store/useSmartStore'
import { motion } from 'framer-motion'

export function Tasks() {
  const { tasks, users } = useSmartStore()
  
  const getAssigneeName = (id: string) => users.find(u => u.id === id)?.name || 'Noma\'lum'

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Vazifalar</h1>
          <p className="text-slate-400 font-medium">Barcha topshiriqlar tafsiloti</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input 
               type="text" 
               placeholder="Qidirish..." 
               className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
             />
           </div>
        </div>
      </div>

      <div className="glass-card border-slate-800/40 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 border-b border-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Vazifa</th>
              <th className="px-6 py-4">Mas'ul</th>
              <th className="px-6 py-4">Uluvtorlik</th>
              <th className="px-6 py-4">Holat</th>
              <th className="px-6 py-4">Muddati</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {tasks.map((task) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={task.id} 
                className="hover:bg-slate-800/20 transition-colors"
              >
                <td className="px-6 py-5">
                   <div className="font-bold text-slate-200">{task.title}</div>
                   <div className="text-xs text-slate-500 mt-1">ID: {task.id}</div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-cyan-400 border border-slate-700">
                        {getAssigneeName(task.assignedTo).substring(0, 2).toUpperCase()}
                     </div>
                     <span className="text-sm font-semibold text-slate-300">{getAssigneeName(task.assignedTo)}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                     task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                     task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'
                   }`}>
                     {task.priority === 'High' ? 'Kritik' : task.priority === 'Medium' ? 'O\'rta' : 'Past'}
                   </span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'Done' ? 'bg-emerald-500' : 
                        task.status === 'InProgress' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-600'
                      }`} />
                      <span className="text-xs font-bold text-slate-400">{task.status}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                   {new Date(task.deadline).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
