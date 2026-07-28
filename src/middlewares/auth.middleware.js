const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Avtorizatsiyadan o‘tilmagan token yo‘q' });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Yaroqsiz yoki muddati o‘tgan token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };