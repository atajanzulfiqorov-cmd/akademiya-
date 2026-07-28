const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/users/profile', authenticateToken, getProfile);
router.put('/users/profile', authenticateToken, upload.single('avatar'), updateProfile);

module.exports = router;