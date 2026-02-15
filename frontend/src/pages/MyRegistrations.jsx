import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRegistrationsByUser, cancelRegistration, getEvent } from '../api'
import './MyRegistrations.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString()
}

function StatusBadge({ status }) {
  const cls = status === 'CONFIRMED' ? 'confirmed' : status === 'CANCELLED' ? 'cancelled' : 'pending'
  return <span className={`badge ${cls}`}>{status}</span>
}

export default function MyRegistrations() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    if (!user) return
    getRegistrationsByUser(user.userId)
      .then(async (regs) => {
        setRegistrations(regs)
        const evMap = {}
        for (const r of regs) {
          try {
            evMap[r.eventId] = await getEvent(r.eventId)
          } catch (_) {}
        }
        setEvents(evMap)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  async function handleCancel(id) {
    setCancelling(id)
    try {
      const updated = await cancelRegistration(id)
      setRegistrations((prev) => prev.map((r) => (r.registrationId === id ? updated : r)))
    } catch (err) {
      setError(err.message)
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return (
    <div className="page-loading">
      <div className="loading-spinner" />
      <span className="loading-text">Loading registrations…</span>
    </div>
  )
  if (error) return (
    <div className="registrations-page">
      <div className="page-error">{error}</div>
    </div>
  )

  const myRegs = registrations.filter((r) => r.userId === user?.userId)

  return (
    <div className="registrations-page">
      <h1>My Registrations</h1>
      {myRegs.length === 0 ? (
        <p className="empty">No registrations yet. <Link to="/events">Browse events</Link></p>
      ) : (
        <div className="registrations-list">
          {myRegs.map((r) => (
            <div key={r.registrationId} className="reg-card">
              <div className="reg-header">
                <Link to={`/events/${r.eventId}`} className="reg-title">
                  {events[r.eventId]?.title || `Event #${r.eventId}`}
                </Link>
                <StatusBadge status={r.status} />
              </div>
              <div className="reg-meta">
                <span>Ticket: {r.ticketNumber}</span>
                <span>Registered: {formatDate(r.registeredAt)}</span>
              </div>
              {r.status === 'PENDING' && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => handleCancel(r.registrationId)}
                  disabled={cancelling === r.registrationId}
                >
                  {cancelling === r.registrationId ? 'Cancelling…' : 'Cancel'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
