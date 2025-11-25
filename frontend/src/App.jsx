// In App.jsx, remove the Profile import and update the routes
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DonorManagement from './pages/DonorManagement'
import ReceiverManagement from './pages/ReceiverManagement'
import BloodStockManagement from './pages/BloodStockManagement'
import DonationRequestManagement from './pages/DonationRequestManagement'
import HospitalManagement from './pages/HospitalManagement'
import DonationManagement from './pages/DonationManagement'

function App() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)

  const handleLogin = (userData, role) => {
    setUser(userData)
    setUserRole(role)
  }

  const handleLogout = () => {
    setUser(null)
    setUserRole(null)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar user={user} userRole={userRole} onLogout={handleLogout} />}
        <main className={`${user ? 'ml-64' : ''} min-h-screen`}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                user ? <Dashboard userRole={userRole} /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/donors" 
              element={
                user ? <DonorManagement userRole={userRole} /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/receivers" 
              element={
                user ? <ReceiverManagement userRole={userRole} /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/blood-stock" 
              element={
                user ? <BloodStockManagement userRole={userRole} /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/donation-requests" 
              element={
                user ? <DonationRequestManagement userRole={userRole} /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/hospitals" 
              element={
                user && (userRole === 'admin') ? <HospitalManagement /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/donations" 
              element={
                user ? <DonationManagement /> : <Navigate to="/login" replace />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App