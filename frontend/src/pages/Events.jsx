import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../api'
import './Events.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' })
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-loading">
      <div className="loading-spinner" />
      <span className="loading-text">Loading events…</span>
    </div>
  )
  if (error) return (
    <div className="page-error-block">
      <p className="page-error">{error}</p>
      <p className="page-error-hint">Ensure the backend (API Gateway on port 8080) and event-service are running.</p>
    </div>
  )

  return (
    <div className="events-page">
      <h1>Events</h1>
      {events.length === 0 ? (
        <p className="empty">No events yet.</p>
      ) : (
        <div className="events-grid">
          {events.map((ev) => (
            <Link key={ev.eventId} to={`/events/${ev.eventId}`} className="event-card">
              <h3>{ev.title}</h3>
              <p className="event-meta">{formatDate(ev.date)} · {ev.location}</p>
              <p className="event-desc">{ev.description || 'No description'}</p>
              <div className="event-footer">
                <span className="seats">{ev.availableSeats ?? ev.totalSeats} / {ev.totalSeats} seats</span>
                <span className="price">₹{ev.price}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
