const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/:restaurantId',    ctrl.getRestaurantReviews);
router.post('/',                protect, authorize('customer'), ctrl.createReview);
router.post('/:id/reply',       protect, authorize('owner'), ctrl.replyToReview);
router.delete('/:id',           protect, ctrl.deleteReview);

module.exports = router;