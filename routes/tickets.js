const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/tickets');

router.get('/users/:userId', ticketController.getUserTickets);
router.get('/:id', ticketController.getTicketById);

module.exports = router;