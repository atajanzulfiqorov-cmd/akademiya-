const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, addModule, deleteCourse } = require('../controllers/course.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/rbac.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/', authenticateToken, authorizeRoles('instructor', 'admin'), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:id/modules', authenticateToken, authorizeRoles('instructor', 'admin'), upload.single('file'), addModule);
router.delete('/:id', authenticateToken, authorizeRoles('instructor', 'admin'), deleteCourse);

module.exports = router;