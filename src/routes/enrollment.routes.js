const express = require('express');
const router = express.Router();
const { enrollCourse, getMyCourses, getLessonContent } = require('../controllers/enrollment.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/rbac.middleware');

router.post('/courses/:id/enroll', authenticateToken, authorizeRoles('student'), enrollCourse);
router.get('/students/my-courses', authenticateToken, authorizeRoles('student'), getMyCourses);
router.get('/courses/:id/lessons/:lessonId', authenticateToken, getLessonContent);

module.exports = router;