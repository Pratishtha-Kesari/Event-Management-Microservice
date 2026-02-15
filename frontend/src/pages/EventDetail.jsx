import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getEvent, createRegistration, pay } from '../api'
import './EventDetail.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { dateStyle: 'full' }) + ' at ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' })
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registering, setRegistering] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleRegister() {
    if (!user || user.role !== 'USER') {
      setStatus('Please log in as a User to register.')
      return
    }
    if (event.availableSeats < 1) {
      setStatus('No seats available.')
      return
    }
    setRegistering(true)
    setStatus('')
    try {
      const reg = await createRegistration(Number(id))
      const res = await pay(reg.registrationId, event.price, Number(id), true)
      setStatus(res.status === 'COMPLETED' ? 'Registration and payment successful!' : `Payment: ${res.status}`)
      navigate('/registrations')
    } catch (err) {
      setStatus(err.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) return (
    <div className="page-loading">
      <div className="loading-spinner" />
      <span className="loading-text">Loading event…</span>
    </div>
  )
  if (error) return (
    <div className="event-detail">
      <div className="page-error">{error}</div>
    </div>
  )
  if (!event) return null

  const canRegister = user && user.role === 'USER' && event.availableSeats > 0

  return (
    <div className="event-detail">
      <Link to="/events" className="back">← Back to Events</Link>
      <article className="event-article">
        <h1>{event.title}</h1>
        <p className="event-meta">{formatDate(event.date)} · {event.location}</p>
        {event.description && <p className="event-desc">{event.description}</p>}
        <div className="event-stats">
          <span>{event.availableSeats ?? event.totalSeats} / {event.totalSeats} seats</span>
          <span className="price">₹{event.price}</span>
        </div>
        {status && <div className={status.includes('successful') ? 'success' : 'error'}>{status}</div>}
        {canRegister && (
          <button
            type="button"
            className="btn-register"
            onClick={handleRegister}
            disabled={registering}
          >
            {registering ? 'Processing…' : 'Register & Pay'}
          </button>
        )}
        {user && user.role !== 'USER' && (
          <p className="hint">Only users can register for events. Admins can manage events from Admin.</p>
        )}
        {!user && (
          <p className="hint"><Link to="/login">Log in</Link> as a User to register for this event.</p>
        )}
      </article>
    </div>
  )
}
