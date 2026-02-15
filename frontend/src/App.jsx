import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import MyRegistrations from './pages/MyRegistrations'
import Admin from './pages/Admin'

function LoadingScreen() {
  return (
    <div style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading-spinner" />
      <span className="loading-text">Loading…</span>
    </div>
  )
}

function PrivateRoute({ children, requireAdmin }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/events" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/events" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Layout><Login /></Layout></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Layout><Register /></Layout></PublicRoute>} />
      <Route path="/events" element={<Layout><Events /></Layout>} />
      <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
      <Route path="/registrations" element={<PrivateRoute><Layout><MyRegistrations /></Layout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute requireAdmin><Layout><Admin /></Layout></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  )
}
