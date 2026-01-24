const express = require('express');
const router = express.Router();
const { createTicket } = require('../controller/ticket.controller.js');

router.post('/', createTicket);

module.exports = router;
