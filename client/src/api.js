let API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  API_URL = import.meta.env.PROD
    ? 'https://pulseboard-saas.onrender.com'
    : 'http://localhost:5000'
}

API_URL = API_URL.replace(/\/$/, '')

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function getToken() {
  return localStorage.getItem('pulseboard_token')
}

function saveToken(token) {
  if (token) {
    localStorage.setItem('pulseboard_token', token)
  }
}

function clearToken() {
  localStorage.removeItem('pulseboard_token')
}

async function requestWithRetry(path, options = {}, retries = 0) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    return await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers
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
    if (response.status === 401) {
      clearToken()
    }

    const error = new Error(data.message || 'Request failed')
    error.status = response.status
    error.errors = data.errors || {}

    throw error
  }

  return data
}

export const api = {
  me: async () => {
    const data = await request('/api/auth/me')

    if (data.token) {
      saveToken(data.token)
    }

    return data
  },

  register: async (body) => {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    if (data.token) {
      saveToken(data.token)
    }

    return data
  },

  login: async (body) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    if (data.token) {
      saveToken(data.token)
    }

    return data
  },

  logout: async () => {
    try {
      return await request('/api/auth/logout', {
        method: 'POST'
      })
    } finally {
      clearToken()
    }
  },

  dashboard: () =>
    request(`/api/dashboard/summary?_=${Date.now()}`),

  projects: (params = {}) =>
    request(`/api/projects?${new URLSearchParams(params)}`),

  createProject: (body) =>
    request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  updateProject: (id, body) =>
    request(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),

  deleteProject: (id) =>
    request(`/api/projects/${id}`, {
      method: 'DELETE'
    })
}