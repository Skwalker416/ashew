const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');
const reviewsController = require('../controllers/reviews');

router.get('/', eventsController.getEvents);

router.get('/search', eventsController.searchEvents);


router.post('/:id/reviews', reviewsController.leaveReview);
router.post('/:id/reviews', reviewsController.getEventReviews);

module.exports = router;