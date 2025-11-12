const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_please_change';

function signToken(user) {
  const payload = { id: user.id, username: user.username, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyTokenMiddleware(req, res, next) {
  const auth = req.get('authorization') || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, username, role }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (Array.isArray(role)) {
      if (role.includes(req.user.role)) return next();
    } else {
      if (req.user.role === role) return next();
    }
    return res.status(403).json({ error: 'Forbidden - insufficient role' });
  };
}

async function hashPassword(plain) {
  return Promise.resolve(bcrypt.hashSync(plain, 10));
}

async function comparePassword(plain, hash) {
  return Promise.resolve(bcrypt.compareSync(plain, hash));
}

module.exports = {
  signToken,
  verifyTokenMiddleware,
  requireRole,
  hashPassword,
  comparePassword
};
