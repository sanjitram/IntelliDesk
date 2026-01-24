const express = require('express');
const router = express.Router();
const { createTicket, sendDirectEmail } = require('../controller/ticket.controller.js');

router.post('/', createTicket);
router.post('/reply', sendDirectEmail);

module.exports = router;
