// Auto-detect API URL based on current host
const API_URL = (() => {
  const hostname = window.location.hostname;
  
  // If accessing via localhost or 127.0.0.1, use localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:3002/api';
  }
  
  // Otherwise, use the same hostname (for mobile access)
  return `http://${hostname}:3002/api`;
})();

console.log('API URL:', API_URL);
