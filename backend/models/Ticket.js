const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  // --- IDENTITY ---
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  customer: {
    email: { type: String, required: true },
    domain: String, // e.g., "gmail.com" or "tatasteel.com"
  },

  // --- CONTENT ---
  content: {
    subject: { type: String, required: true },
    original_body: { type: String, required: true },
    // You can add 'attachments' here later if needed
  },

  // --- AI CLASSIFICATION (From your Python/Ngrok Service) ---
  classification: {
    category: { type: String, default: 'General Inquiry' },
    confidence_score: { type: Number, default: 0 },

    // Auto-filled by AI
    severity: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      default: 'P3'
    },
    sla: String,       // e.g., "24 Hours"
    sentiment: String, // e.g., "Angry", "Neutral", "Happy"

    // Warning Flags
    flags: {
      is_yelling: { type: Boolean, default: false },
      is_followup: { type: Boolean, default: false },
      has_urgent_punctuation: { type: Boolean, default: false }
    }
  },

  // --- ENRICHMENT (From External API) ---
  enrichment: {
    domain_mapping: {
      domain: String,
      account_id: String,
      tier: String
    },
    user_lookup: {
      role_db: String,
      last_login: String,
      modules: [String]
    },
    signature_parsing: {
      extracted_name: String,
      extracted_role: String,
      extracted_phone: String
    },
    multi_tenant_handling: {
      identified_locations: [String],
      routing: String
    },
    lead_detection: {
      is_new_customer: Boolean,
      intent_detected: Boolean,
      action: String
    }
  },

  // --- RESOLUTION (From your FAQ Vector Search) ---
  resolution: {
    status: {
      type: String,
      enum: ['No_Match', 'Suggestion_Sent', 'Auto_Resolved', 'Manual_Intervention'],
      default: 'No_Match'
    },
    // Reference to the FAQ that solved/helped
    linked_faq_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }
  },

  // --- CONVERSATION HISTORY ---
  thread: [{
    sender: { type: String, enum: ['Customer', 'AI_Agent', 'Human_Agent'] },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],

  // --- GLOBAL STATUS ---
  status: {
    type: String,
    enum: ['New', 'In_Progress', 'Auto-Replied', 'Resolved', 'Closed'],
    default: 'New'
  },

  is_escalated: { type: Boolean, default: false } // Triggered by 'is_yelling' or P1 severity

}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);