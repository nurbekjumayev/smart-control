import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiService } from '../services/api'

export type UserRole = 'Manager' | 'Senior' | 'Junior'

export interface User {
  id: string
  name: string
  role: UserRole
  energyLevel: number
  avatar: string
}

export interface Task {
  id: string
  title: string
  status: 'Backlog' | 'Todo' | 'InProgress' | 'Review' | 'Done'
  priority: 'High' | 'Medium' | 'Low'
  assignedTo: string
  helperId?: string
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
  login: (user: User) => void
  fetchTasks: () => Promise<void>
  addTask: (task: Task) => Promise<void>
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>
  addHelpRequest: (request: HelpRequest) => void
  acceptHelpRequest: (requestId: string) => void
  findBestHelper: (excludeId: string) => User | null
}

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Xamrayev Omon', role: 'Manager', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Omon&gender=male' },
  { id: 'u2', name: 'Jumayev Nurbek', role: 'Manager', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Nurbek&gender=male' },
  { id: 'u3', name: 'Qosimov Elbek', role: 'Senior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Elbek&gender=male' },
  { id: 'u4', name: 'Xojibayev Javoxit', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Javoxit&gender=male' },
  { id: 'u5', name: 'Ismoilov Xasan', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Xasan&gender=male' },
  { id: 'u6', name: 'Xo\'jamqulov Baxtiyor', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Baxtiyor&gender=male' },
  { id: 'u7', name: 'Ismatov Temur', role: 'Junior', energyLevel: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Temur&gender=male' }
]

export const useSmartStore = create<SmartState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: INITIAL_USERS,
      tasks: [],
      helpRequests: [],

      login: (user: User) => set({ currentUser: user }),

      fetchTasks: async () => {
        try {
          const apiTasks = await apiService.getTasks()
          const mappedTasks: Task[] = apiTasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            priority: t.priority,
            assignedTo: t.assigned_to,
            deadline: t.deadline,
            isRisk: t.is_risk,
            helperId: t.helper_id
          }))
          set({ tasks: mappedTasks })
        } catch (err) { console.error(err) }
      },

      addTask: async (task: Task) => {
        try {
          await apiService.createTask(task)
          set(state => ({ tasks: [...state.tasks, task] }))
        } catch (err) { console.error(err) }
      },

      updateTaskStatus: async (taskId: string, status: Task['status']) => {
        try {
          const { currentUser } = get()
          if (!currentUser) return
          await apiService.updateTaskStatus(taskId, status, currentUser.id)
          set(state => ({
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
          }))
        } catch (err) { console.error(err) }
      },

      addHelpRequest: (req: HelpRequest) => set(state => ({ helpRequests: [...state.helpRequests, req] })),
      
      acceptHelpRequest: (reqId: string) => set(state => {
        const req = state.helpRequests.find(r => r.id === reqId)
        if (!req) return state
        return {
          helpRequests: state.helpRequests.map(r => r.id === reqId ? { ...r, status: 'Accepted' } : r),
          tasks: state.tasks.map(t => t.id === req.taskId ? { ...t, helperId: req.toUserId } : t)
        }
      }),

      findBestHelper: (excludeId: string) => {
        const specialists = get().users.filter(u => u.id !== excludeId && u.role !== 'Manager')
        return specialists.length > 0 ? specialists[0] : null
      }
    }),
    {
      name: 'smart-auth-storage',
      partialize: (state) => ({ currentUser: state.currentUser })
    }
  )
)
