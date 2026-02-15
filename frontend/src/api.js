const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function sanitizeError(text, status) {
  if (!text || typeof text !== 'string') return `Request failed: ${status}`;
  if (text.trim().startsWith('<')) {
    return status === 404
      ? 'Backend not reachable. Ensure API Gateway is running on port 8080.'
      : `Request failed: ${status}`;
  }
  try {
    const json = JSON.parse(text);
    return json.message || json.error || `Request failed: ${status}`;
  } catch (_) {
    return text.length > 200 ? `Request failed: ${status}` : text;
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    const msg = sanitizeError(text, res.status);
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Auth
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function register(email, password, role = 'USER') {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  return handleResponse(res);
}

// Events
export async function getEvents() {
  const res = await fetch(`${API_BASE}/events`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createEvent(data) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Registrations
export async function getRegistrations() {
  const res = await fetch(`${API_BASE}/register`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getRegistration(id) {
  const res = await fetch(`${API_BASE}/register/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getRegistrationsByUser(userId) {
  const res = await fetch(`${API_BASE}/register/user/${userId}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createRegistration(eventId) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ eventId }),
  });
  return handleResponse(res);
}

export async function cancelRegistration(id) {
  const res = await fetch(`${API_BASE}/register/${id}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function confirmRegistration(id) {
  const res = await fetch(`${API_BASE}/register/${id}/confirm`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Payment
export async function pay(registrationId, amount, eventId, success = true) {
  const res = await fetch(`${API_BASE}/payment/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ registrationId, amount, eventId, success }),
  });
  return handleResponse(res);
}

// Users (Admin only)
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createUser(data) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (res.status === 204) return;
  return handleResponse(res);
}
