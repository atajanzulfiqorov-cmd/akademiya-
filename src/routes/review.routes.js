const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/review.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/courses/:id/reviews', authenticateToken, addReview);
router.get('/courses/:id/reviews', getReviews);

module.exports = router;