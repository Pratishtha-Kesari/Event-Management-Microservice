import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const loc = useLocation()

  return (
    <div className="layout">
      <header className="header">
        <Link to="/events" className="logo">Event Management</Link>
        <nav>
          <Link to="/events" className={loc.pathname === '/events' ? 'active' : ''}>Events</Link>
          {user && (
            <>
              <Link to="/registrations" className={loc.pathname === '/registrations' ? 'active' : ''}>My Registrations</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className={loc.pathname === '/admin' ? 'active' : ''}>Admin</Link>
              )}
            </>
          )}
          {user ? (
            <span className="user-info">
              {user.email}
              <button type="button" className="btn-logout" onClick={logout}>Logout</button>
            </span>
          ) : (
            <>
              <Link to="/login" className={loc.pathname === '/login' ? 'active' : ''}>Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  )
}
