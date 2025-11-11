// frontend/auth.js
// Simple auth helper to store/read JWT and attach Authorization header
function getAuthToken() {
  return localStorage.getItem('att_token') || null;
}

function getAuthUser() {
  const u = localStorage.getItem('att_user');
  try { return u ? JSON.parse(u) : null; } catch (e) { return null; }
}

function setAuth(token, user) {
  if (token) localStorage.setItem('att_token', token);
  if (user) localStorage.setItem('att_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('att_token');
  localStorage.removeItem('att_user');
  localStorage.removeItem('currentUser');
}

async function fetchWithAuth(url, opts = {}) {
  opts.headers = opts.headers || {};
  const token = getAuthToken();
  if (token) {
    opts.headers['Authorization'] = 'Bearer ' + token;
  }
  return fetch(url, opts);
}

// Expose globals for non-module usage
window.getAuthToken = getAuthToken;
window.getAuthUser = getAuthUser;
window.setAuth = setAuth;
window.clearAuth = clearAuth;
window.fetchWithAuth = fetchWithAuth;
