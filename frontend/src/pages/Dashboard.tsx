import React from 'react'
import { Plus, Users, Clock, AlertCircle, TrendingUp, Zap, HelpCircle, ListTodo } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSmartStore, User, Task } from '../store/useSmartStore'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const statusMap = {
  Backlog: 'Rejadagi',
  Todo: 'Qilishi kerak',
  InProgress: 'Bajarilmoqda',
  Review: 'Tekshiruvda',
  Done: 'Tayyor'
}

export function Dashboard() {
  const { users, tasks, currentUser, findBestHelper, addHelpRequest, addTask } = useSmartStore()
  const [requestHelpForTask, setRequestHelpForTask] = React.useState<string | null>(null)
  const [suggestedHelper, setSuggestedHelper] = React.useState<User | null>(null)
  
  // New Task Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [taskTitle, setTaskTitle] = React.useState('')
  const [taskPriority, setTaskPriority] = React.useState<Task['priority']>('Medium')
  const [taskAssignee, setTaskAssignee] = React.useState('')

  const handleRequestHelp = (taskId: string) => {
    if (!currentUser) return
    const helper = findBestHelper(currentUser.id)
    setRequestHelpForTask(taskId)
    setSuggestedHelper(helper)
  }

  const confirmHelpRequest = () => {
    if (requestHelpForTask && suggestedHelper && currentUser) {
      addHelpRequest({
        id: Math.random().toString(36).substr(2, 9),
        taskId: requestHelpForTask,
        fromUserId: currentUser.id,
        toUserId: suggestedHelper.id,
        status: 'Pending'
      })
      setRequestHelpForTask(null)
      alert(`Yordam so'rovi ${suggestedHelper.name}ga yuborildi!`)
    }
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle || !taskAssignee) return

    addTask({
      id: `t${Date.now()}`,
      title: taskTitle,
      status: 'Todo',
      priority: taskPriority,
      assignedTo: taskAssignee,
      deadline: new Date(Date.now() + 86400000).toISOString(),
      isRisk: false
    })

    setIsModalOpen(false)
    setTaskTitle('')
    setTaskAssignee('')
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-800/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Boshqaruv Paneli</h1>
          <p className="text-slate-400 font-medium">AKT Bo'limi faoliyati va yuklamasi nazorati</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/60 hover:bg-slate-700/80 text-white rounded-xl border border-slate-700/50 transition-all font-semibold">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Xodimlar ({users.length})</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-900/40 neon-glow transition-all font-bold"
          >
            <Plus className="w-5 h-5 text-white/90" />
            <span>Yangi Vazifa</span>
          </button>
        </div>
      </div>

      {/* Energy Bars - Global View */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
          <h2 className="text-xl font-bold text-white tracking-tight">Xodimlar Yuklamasi (Energy Bars)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <motion.div 
              key={user.id}
              whileHover={{ y: -5 }}
              className="glass-card p-6 border-slate-800/40 relative group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/50 overflow-hidden ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-950">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900",
                    user.energyLevel > 80 ? "bg-red-500" : user.energyLevel > 50 ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg leading-tight truncate max-w-[120px]">{user.name}</span>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{user.role}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400">Ish Yuklamasi</span>
                  <span className={user.energyLevel > 80 ? "text-red-400" : user.energyLevel > 50 ? "text-amber-400" : "text-emerald-400"}>
                    {user.energyLevel}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-800/40">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${user.energyLevel}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      user.energyLevel > 80 ? "bg-gradient-to-r from-red-600 to-rose-500" : user.energyLevel > 50 ? "bg-gradient-to-r from-amber-600 to-orange-500" : "bg-gradient-to-r from-emerald-600 to-cyan-500"
                    )}
                  />
                </div>
              </div>

              {user.energyLevel > 80 && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase bg-red-400/5 py-1.5 px-3 rounded-lg border border-red-400/20">
                  <AlertCircle className="w-3 h-3" />
                  <span>Kritik yuklama: Yordam kerak bo'lishi mumkin</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Board (Simplified Kanban) */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <ListTodo className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Vazifalar Joarayoni (Kanban)</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
          {Object.entries(statusMap).map(([key, label]) => {
            const columnTasks = tasks.filter(t => t.status === key)
            return (
              <div key={key} className="flex flex-col gap-5 min-w-0">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-300 uppercase tracking-widest">{label}</span>
                    <span className="text-[11px] font-black text-slate-500 bg-slate-800/60 py-0.5 px-2 rounded-full border border-slate-700/50">{columnTasks.length}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {columnTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="glass-card p-5 group hover:border-cyan-500/30 transition-all border-slate-800/40 bg-slate-900/40 shadow-xl"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-1 rounded-lg border",
                          task.priority === 'High' ? "bg-red-500/10 text-red-500 border-red-500/20" : task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.isRisk && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />}
                      </div>
                      <h3 className="font-bold text-white leading-snug mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2">{task.title}</h3>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                        <div className="flex -space-x-2">
                          <img src={users.find(u => u.id === task.assignedTo)?.avatar} className="w-8 h-8 rounded-lg border-2 border-slate-950 bg-slate-800" title="Asosiy mas'ul" />
                          {task.helperId && (
                            <img src={users.find(u => u.id === task.helperId)?.avatar} className="w-8 h-8 rounded-lg border-2 border-slate-950 bg-slate-800" title="Yordamchi" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>2k</span>
                        </div>
                      </div>
                      
                      {currentUser?.id === task.assignedTo && task.status === 'InProgress' && !task.helperId && (
                        <button 
                          onClick={() => handleRequestHelp(task.id)}
                          className="w-full mt-4 py-2 px-3 bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Yordam so'rash</span>
                        </button>
                      )}

                      {currentUser?.id === task.assignedTo && task.status === 'Todo' && (
                        <button 
                          onClick={() => useSmartStore.getState().updateTaskStatus(task.id, 'InProgress')}
                          className="w-full mt-4 py-2 px-3 bg-cyan-600/15 hover:bg-cyan-600/30 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-600/20 flex items-center justify-center gap-2 transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Vazifani boshlash</span>
                        </button>
                      )}
                      
                      {currentUser?.id === task.assignedTo && task.status === 'InProgress' && (
                        <button 
                          onClick={() => useSmartStore.getState().updateTaskStatus(task.id, 'Done')}
                          className="w-full mt-4 py-2 px-3 bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                        >
                          <ListTodo className="w-3.5 h-3.5" />
                          <span>Tugatish</span>
                        </button>
                      )}
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                     <div className="h-32 rounded-2xl border-2 border-dashed border-slate-800/30 flex items-center justify-center text-slate-600 text-sm font-semibold italic">
                        Bo'sh
                     </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Mutual Aid Modal */}
      <AnimatePresence>
        {requestHelpForTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-md w-full p-8 space-y-6"
            >
              <div className="flex items-center gap-3 text-cyan-400">
                <HelpCircle className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Yordam so'rovini yuborish</h2>
              </div>
              
              <div className="text-slate-400 font-medium">
                Vazifa: <span className="text-white font-bold">{tasks.find(t => t.id === requestHelpForTask)?.title}</span>
              </div>

              {suggestedHelper ? (
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-3">
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tizim tavsiya qilgan yordamchi:</div>
                  <div className="flex items-center gap-4">
                    <img src={suggestedHelper.avatar} className="w-12 h-12 rounded-xl" />
                    <div>
                      <div className="font-bold text-white">{suggestedHelper.name}</div>
                      <div className="text-xs text-emerald-400 font-bold">Yuklama: {suggestedHelper.energyLevel}% (Minimal)</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-amber-400 font-bold italic">Afsuski, hozircha bosh bo'sh xodim topilmadi.</div>
              )}

              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={() => setRequestHelpForTask(null)}
                  className="flex-1 py-3 text-slate-400 hover:text-white font-bold transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  disabled={!suggestedHelper}
                  onClick={confirmHelpRequest}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold transition-all"
                >
                  So'rov yuborish
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Global Task Creation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card p-8 border-slate-800 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-cyan-400" /> Yangi Vazifa Yaratish
              </h2>
              
              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vazifa nomi</label>
                  <input 
                    autoFocus
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Vazifa mavzusini yozing..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ustuvorlik</label>
                    <select 
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold"
                    >
                      <option value="Low">Past (Low)</option>
                      <option value="Medium">O'rta (Medium)</option>
                      <option value="High">Yuqori (High)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mas'ul xodim</label>
                    <select 
                      required
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold"
                    >
                      <option value="">Tanlang...</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                  >
                    Yaratish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Global Task Creation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card p-8 border-slate-800 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-cyan-400" /> Yangi Vazifa Yaratish
              </h2>
              
              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vazifa nomi</label>
                  <input 
                    autoFocus
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Vazifa mavzusini yozing..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ustuvorlik</label>
                    <select 
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold"
                    >
                      <option value="Low">Past (Low)</option>
                      <option value="Medium">O'rta (Medium)</option>
                      <option value="High">Yuqori (High)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mas'ul xodim</label>
                    <select 
                      required
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold"
                    >
                      <option value="">Tanlang...</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                  >
                    Yaratish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

