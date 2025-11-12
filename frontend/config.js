// API URL: use same origin so frontend works when served from backend (single host/port)
const API_URL = (() => {
  try {
    // Use window.location.origin which includes protocol and port
    const origin = window.location.origin || `${window.location.protocol}//${window.location.hostname}`;
    return `${origin}/api`;
  } catch (e) {
    // Fallback to localhost:3000/api
    return 'http://127.0.0.1:3000/api';
  }
})();

console.log('API URL:', API_URL);
