const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ticketId: String,
    customer: { email: String, domain: String }, // User Data is HERE
    problem_statement: String,

    // Did we find an FAQ?
    resolution: {
        status: String,
        // Store which FAQ solved it (Optional reference)
        linked_faq_id: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeBase' }
    }
});

module.exports = mongoose.model('Ticket', TicketSchema);
