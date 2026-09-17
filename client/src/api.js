let API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  if (import.meta.env.PROD) {
    throw new Error('VITE_API_URL environment variable is required in production')
  }
  API_URL = 'http://localhost:5000'
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function requestWithRetry(path, options = {}, retries = 0) {
  try {
    return await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    })
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await sleep(RETRY_DELAY * (retries + 1))
      return requestWithRetry(path, options, retries + 1)
    }
    throw new Error(error?.message || 'Network error')
  }
}

async function request(path, options = {}) {
  const response = await requestWithRetry(path, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }
  return data
}

export const api = {
  me: () => request('/api/auth/me'),
  register: body => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: body => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  dashboard: () => request(`/api/dashboard/summary?_=${Date.now()}`),
  projects: params => request(`/api/projects?${new URLSearchParams(params)}`),
  createProject: body => request('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id, body) => request(`/api/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProject: id => request(`/api/projects/${id}`, { method: 'DELETE' })
}
