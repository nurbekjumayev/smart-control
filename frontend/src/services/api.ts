import axios from 'axios'

const API_URL = 'https://smart-backend-6ch8.onrender.com'

const api = axios.create({
  baseURL: API_URL,
})

export const apiService = {
  getTasks: () => api.get('/tasks/').then(r => r.data),
  createTask: (task: any) => api.post('/tasks/', task).then(r => r.data),
  updateTaskStatus: (taskId: string, status: string, userId: string) =>
    api.patch(`/tasks/${taskId}/status?status=${status}&user_id=${userId}`).then(r => r.data),
  getLogs: () => api.get('/audit/logs').then(r => r.data),
}

api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api
