import { create } from 'zustand'

export type UserRole = 'Manager' | 'Senior' | 'Junior'

export interface User {
  id: string
  name: string
  role: UserRole
  energyLevel: number // 0-100 (Workload %)
  avatar: string
}

export interface Task {
  id: string
  title: string
  status: 'Backlog' | 'Todo' | 'InProgress' | 'Review' | 'Done'
  priority: 'High' | 'Medium' | 'Low'
  assignedTo: string // userId
  helperId?: string // userId
  deadline: string
  isRisk: boolean
}

export interface HelpRequest {
  id: string
  taskId: string
  fromUserId: string
  toUserId: string
  status: 'Pending' | 'Accepted' | 'Declined'
}

interface SmartState {
  currentUser: User | null
  users: User[]
  tasks: Task[]
  helpRequests: HelpRequest[]
  
  // Actions
  login: (user: User) => void
  updateTaskStatus: (taskId: string, status: Task['status']) => void
  addHelpRequest: (request: HelpRequest) => void
  acceptHelpRequest: (requestId: string) => void
  findBestHelper: (excludeId: string) => User | null
}

export const useSmartStore = create<SmartState>((set, get) => ({
  currentUser: null,
  users: [
    { id: 'u1', name: 'Xamrayev Omon', role: 'Manager', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omon' },
    { id: 'u2', name: 'Jumayev Nurbek', role: 'Manager', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nurbek' },
    { id: 'u3', name: 'Qosimov Elbek', role: 'Senior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elbek' },
    { id: 'u4', name: 'Xojibayev Javoxit', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Javoxit' },
    { id: 'u5', name: 'Ismoilov Xasan', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xasan' },
    { id: 'u6', name: 'Xo\'jamqulov Baxtiyor', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Baxtiyor' },
    { id: 'u7', name: 'Ismatov Temur', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Temur' }
  ],
  tasks: [
    { id: 't1', title: 'Ildiz server sozlamalari', status: 'InProgress', priority: 'High', assignedTo: 'u2', deadline: '2026-03-20T10:00:00Z', isRisk: false },
    { id: 't2', title: 'Firewall qoidalari yangilash', status: 'Todo', priority: 'Medium', assignedTo: 'u3', deadline: '2026-03-21T18:00:00Z', isRisk: false }
  ],
  helpRequests: [],
  
  login: (user: User) => set({ currentUser: user }),
  updateTaskStatus: (taskId: string, status: Task['status']) => set((state) => {
    const updatedTasks = state.tasks.map((t: Task) => {
      if (t.id === taskId) {
        // Priority Lock: If moving to InProgress and task is High priority,
        // we might need to pause others later.
        return { ...t, status }
      }
      return t
    })

    // If the updated task is now InProgress and High priority, auto-pause other InProgress tasks for this user
    const task = updatedTasks.find(t => t.id === taskId)
    if (status === 'InProgress' && task?.priority === 'High') {
      return {
        tasks: updatedTasks.map(t => 
          (t.id !== taskId && t.assignedTo === task.assignedTo && t.status === 'InProgress')
            ? { ...t, status: 'Todo' as const } // Simulation of pause
            : t
        )
      }
    }

    // Update user energy levels based on current tasks
    const finalTasks = (status === 'InProgress' && task?.priority === 'High') 
      ? updatedTasks.map(t => (t.id !== taskId && t.assignedTo === task.assignedTo && t.status === 'InProgress') ? { ...t, status: 'Todo' as const } : t)
      : updatedTasks

    const newUserEnergy = state.users.map(user => {
      const userTasks = finalTasks.filter(t => t.assignedTo === user.id && t.status === 'InProgress')
      const helperTasks = finalTasks.filter(t => t.helperId === user.id && t.status === 'InProgress')
      // Simple formula: 20% per main task, 10% per help task
      const newEnergy = Math.min(100, (userTasks.length * 25) + (helperTasks.length * 15))
      return { ...user, energyLevel: newEnergy }
    })

    return { tasks: finalTasks, users: newUserEnergy }
  }),
  addHelpRequest: (req: HelpRequest) => set((state) => ({ helpRequests: [...state.helpRequests, req] })),
  acceptHelpRequest: (reqId: string) => set((state) => {
    const req = state.helpRequests.find((r: HelpRequest) => r.id === reqId)
    if (!req) return state
    return {
      helpRequests: state.helpRequests.map((r: HelpRequest) => r.id === reqId ? { ...r, status: 'Accepted' } : r),
      tasks: state.tasks.map((t: Task) => t.id === req.taskId ? { ...t, helperId: req.toUserId } : t)
    }
  }),
  findBestHelper: (excludeId: string) => {
    const state = get()
    const eligibleSpecialists = state.users.filter((u: User) => u.id !== excludeId && u.role !== 'Manager')
    if (eligibleSpecialists.length === 0) return null
    return eligibleSpecialists.reduce((min: User, user: User) => 
      user.energyLevel < min.energyLevel ? user : min
    , eligibleSpecialists[0])
  }
}))
