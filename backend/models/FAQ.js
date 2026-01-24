const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    // The "Question" or "Problem Statement"
    topic: { type: String, required: true },

    // The generic solution (e.g., "Reset router", "Check invoice in portal")
    content: { type: String, required: true },

    // Category helps filter search (e.g., only search "Billing" FAQs)
    category: {
        type: String,
        enum: ['Technical Support', 'Billing', 'Access Request', 'How-To'],
        required: true
    },

    // Metadata for AI Trust
    success_rate: { type: Number, default: 0 }, // How often this answer worked
    last_updated: { type: Date, default: Date.now },

    // --- THE SEARCH KEY ---
    // Vector embedding of the 'topic' + 'content'
    vector_embedding: {
        type: [Number],
        index: 'vector'
    }
});

// Using 'KnowledgeBase' as the model name to match usage in TicketSchema
module.exports = mongoose.model('KnowledgeBase', FAQSchema);
