import { useState, useEffect } from 'react'
import { getUsers, getEvents, createEvent } from '../api'
import './Admin.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString()
}

export default function Admin() {
  const [tab, setTab] = useState('events')
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    totalSeats: '',
    price: '',
  })

  useEffect(() => {
    load()
  }, [tab])

  function load() {
    setLoading(true)
    setError('')
    if (tab === 'events') {
      getEvents().then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false))
    } else {
      getUsers().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false))
    }
  }

  async function handleCreateEvent(e) {
    e.preventDefault()
    setError('')
    try {
      await createEvent({
        title: form.title,
        description: form.description || null,
        location: form.location,
        date: form.date ? new Date(form.date).toISOString() : null,
        totalSeats: Number(form.totalSeats) || 0,
        price: Number(form.price) || 0,
      })
      setForm({ title: '', description: '', location: '', date: '', totalSeats: '', price: '' })
      load()
    } catch (err) {
      setError(err.message || 'Failed to create event')
    }
  }

  return (
    <div className="admin-page">
      <h1>Admin</h1>
      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'events' ? 'active' : ''}
          onClick={() => setTab('events')}
        >
          Events
        </button>
        <button
          type="button"
          className={tab === 'users' ? 'active' : ''}
          onClick={() => setTab('users')}
        >
          Users
        </button>
      </div>

      {tab === 'events' && (
        <>
          <section className="admin-section">
            <h2>Create Event</h2>
            <form onSubmit={handleCreateEvent} className="admin-form">
              {error && <div className="error">{error}</div>}
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="Event title"
              />
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description (optional)"
                rows={3}
              />
              <label>Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
                placeholder="Location"
              />
              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
              <label>Total Seats</label>
              <input
                type="number"
                min={1}
                value={form.totalSeats}
                onChange={(e) => setForm((f) => ({ ...f, totalSeats: e.target.value }))}
                required
                placeholder="100"
              />
              <label>Price</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
                placeholder="0.00"
              />
              <button type="submit">Create Event</button>
            </form>
          </section>

          <section className="admin-section">
            <h2>All Events</h2>
            {loading ? (
              <p className="empty">Loading…</p>
            ) : events.length === 0 ? (
              <p className="empty">No events.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.eventId}>
                      <td>{ev.eventId}</td>
                      <td>{ev.title}</td>
                      <td>{ev.location}</td>
                      <td>{formatDate(ev.date)}</td>
                      <td>{ev.availableSeats ?? ev.totalSeats} / {ev.totalSeats}</td>
                      <td>₹{ev.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}

      {tab === 'users' && (
        <section className="admin-section">
          <h2>All Users</h2>
          {loading ? (
            <p className="empty">Loading…</p>
          ) : users.length === 0 ? (
            <p className="empty">No users.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId}>
                    <td>{u.userId}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.role}</td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  )
}
