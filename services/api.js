const defaultHost = 'http://localhost:3030';
const host = (typeof window !== 'undefined' && window.API_HOST) ? window.API_HOST : defaultHost;
const jsonHeaders = { 'Content-Type': 'application/json' };
let authToken = sessionStorage.getItem('authToken') || '';

function withAuthHeaders(headers = {}) {
  const result = { ...headers };
  if (authToken) {
    result['X-Authorization'] = authToken;
  }
  return result;
}

export function setAuthToken(token) {
  authToken = token || '';
  if (authToken) {
    sessionStorage.setItem('authToken', authToken);
  } else {
    sessionStorage.removeItem('authToken');
  }
}

export function getAuthToken() {
  return authToken;
}

export function clearAuthToken() {
  setAuthToken('');
}

async function request(url, options = {}) {
  try {
    const headers = withAuthHeaders(options.headers);
    const res = await fetch(host + url, { ...options, headers });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
      }
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Request failed: ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  } catch (err) {
    alert(err.message);
    throw err;
  }
}

function handleUnauthorized() {
  clearAuthToken();
  sessionStorage.removeItem('userData');
  if (window.location.hash !== '#/login') {
    window.location.hash = '#/login';
  }
}

export const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, { method: 'POST', headers: withAuthHeaders(jsonHeaders), body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', headers: withAuthHeaders(jsonHeaders), body: JSON.stringify(data) }),
  del: (url) => request(url, { method: 'DELETE' })
};

export const carService = {
  all: () => api.get('/data/cars?sortBy=_createdOn%20desc'),
  search: (query) => api.get(`/data/cars?where=model%20LIKE%20%22${query}%22`),
  byId: (id) => api.get(`/data/cars/${id}`),
  create: (payload) => api.post('/data/cars', payload),
  update: (id, payload) => api.put(`/data/cars/${id}`, payload),
  remove: (id) => api.del(`/data/cars/${id}`)
};

export const userService = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (credentials) => api.post('/users/register', credentials),
  logout: () => api.get('/users/logout')
};
