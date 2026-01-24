// 1. Core Database Library
const mongoose = require('mongoose');

// 2. Environment Variables (for DB connection & AI API keys)
require('dotenv').config();

const FAQSchema = new mongoose.Schema({
  topic: { type: String, required: true }, 
  content: { type: String, required: true }, 
  category: { 
    type: String, 
    enum: ['Technical Support', 'Billing', 'Access Request', 'How-To'],
    required: true 
  },
  success_rate: { type: Number, default: 0 },
  last_updated: { type: Date, default: Date.now },

  // The Vector Field
  vector_embedding: { 
    type: [Number], 
    required: true, // You generally want this required for an AI system
    // Note: The index here is purely for Mongoose schema validation. 
    // The actual search index must be created in MongoDB Atlas.
  }
});

const FAQModel = mongoose.model('FAQ', FAQSchema);

module.exports = FAQModel;