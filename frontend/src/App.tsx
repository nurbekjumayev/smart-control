import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Sidebar } from './components/Sidebar'
import { Navbar } from './components/Navbar'
import { useSmartStore } from './store/useSmartStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSmartStore()
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  const { currentUser } = useSmartStore()
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Area */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-950 text-slate-200">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<div>Vazifalar Sahifasi (Tez orada...)</div>} />
                    <Route path="/audit" element={<div>Audit Loglar (Tez orada...)</div>} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
