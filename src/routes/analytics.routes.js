const express = require('express');
const router = express.Router();
const { getInstructorAnalytics, getAdminAnalytics } = require('../controllers/analytics.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/rbac.middleware');

router.get('/analytics/instructor', authenticateToken, authorizeRoles('instructor'), getInstructorAnalytics);
router.get('/analytics/admin', authenticateToken, authorizeRoles('admin'), getAdminAnalytics);

module.exports = router;