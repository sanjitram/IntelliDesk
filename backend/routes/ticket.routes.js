const express = require('express');
const router = express.Router();
const { 
  createTicket, 
  getAllTickets, 
  getTicketById, 
  updateTicket, 
  addReplyToTicket, 
  sendDirectEmail 
} = require('../controller/ticket.controller.js');

// GET /api/tickets - Get all tickets
router.get('/', getAllTickets);

// GET /api/tickets/:ticketId - Get single ticket
router.get('/:ticketId', getTicketById);

// POST /api/tickets - Create new ticket
router.post('/', createTicket);

// PUT /api/tickets/:ticketId - Update ticket
router.put('/:ticketId', updateTicket);

// POST /api/tickets/:ticketId/reply - Add reply to thread
router.post('/:ticketId/reply', addReplyToTicket);

// POST /api/tickets/reply - Send direct email (legacy)
router.post('/reply', sendDirectEmail);

module.exports = router;
