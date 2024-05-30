const express = require('express');
const router = express.Router();

const eventOrganizersController = require('../controllers/eventOrganizer/eventOrganizers');

const eventsController = require('../controllers/eventOrganizer/events');


//controller/eventOrganizer/events
router.get('/events', eventsController.getEvents); //admin needs a specific version view 
router.post('/events', eventsController.addEvent);
router.put('/events/:id', eventsController.editEvent);

//controller/eventOrganizers/eventOrganizers
router.get('/eventOrganizers', eventOrganizersController.getEventOrganizers);
router.get('/eventOrganizers/:id', eventOrganizersController.getEventOrganizerById);
router.put('/eventOrganizers/:id', eventOrganizersController.updateEventOrganizer);
router.put('/eventOrganizers/:id', eventOrganizersController.addEventOrganizerEvent); // Work in theory to add eventOrganizer Event towards controller's eventOrganizer

module.exports = router;