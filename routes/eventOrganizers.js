const express = require('express');
const router = express.Router();

const eventOrganizersController = require('../controllers/eventOrganizers');

router.get('/', eventOrganizersController.getEventOrganizers);
router.get('/:id', eventOrganizersController.getEventOrganizerById);
router.put('/:id', eventOrganizersController.updateEventOrganizer);
router.put('/:id', eventOrganizersController.addEventOrganizerEvent); // Work in theory to add eventOrganizer Event towards controller's eventOrganizer

module.exports = router;