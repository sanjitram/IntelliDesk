
const Ticket = require("../models/Ticket.js");

/**
 * 1. HEADER & PATTERN PARSING
 * Extracts ticket IDs from the subject line.
 * Supports patterns like: [Ticket #123], #123, TKT-123, INC000123
 */
const extractTicketId = (subject) => {
    // Regex for various ticket ID formats
    // Matches: [TKT-123], (INC000123), #12345, Ticket #123
    const ticketIdPattern = /\[?(?:Ticket|TKT|INC)?\s?#?[-]?(\w+\-\d+|\d+)\]?/i;
    
    // Specifically looking for our generated IDs like TKT-173873...
    const internalIdPattern = /TKT-\d{13}/;
    
    const internalMatch = subject.match(internalIdPattern);
    if (internalMatch) return internalMatch[0];

    // Fallback to generic capture
    const match = subject.match(ticketIdPattern);
    return match ? match[1] : null;
};

/**
 * 2. FUZZY MATCHING
 * simple normalization to remove "Re:", "Fwd:", timestamps etc.
 */
const normalizeSubject = (subject) => {
    return subject
        .replace(/^(Re|Fwd|Fw):\s*/i, "") // Remove Re:, Fwd:
        .replace(/\[.*?\]/g, "")          // Remove things in brackets like [External]
        .replace(/\s+/g, " ")             // Collapse whitespace
        .trim()
        .toLowerCase();
};

/**
 * 3. MAIN DEDUPLICATION LOGIC
 */
const findExistingThread = async (subject, body, senderEmail) => {
    
    // --- STRATEGY A: Explicit Ticket ID Match (100% Confidence) ---
    const extractedId = extractTicketId(subject);
    if (extractedId) {
        const ticket = await Ticket.findOne({ ticketId: extractedId });
        if (ticket) {
            return {
                found: true,
                ticketId: ticket.ticketId,
                reason: "Explicit Ticket ID detected in subject",
                method: "ID_MATCH"
            };
        }
    }

    // --- STRATEGY C: Time-Window Based Subject Matching (Aggressive Grouping) ---
    // Look for tickets from SAME SENDER with SIMILAR SUBJECT within 48 HOURS
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const cleanSubject = normalizeSubject(subject);

    // Find recent tickets from this user
    const recentTickets = await Ticket.find({
        "customer.email": senderEmail,
        createdAt: { $gte: fortyEightHoursAgo },
        status: { $ne: 'Closed' } // Only group valid active threads
    }).select('ticketId content createdAt');

    for (const ticket of recentTickets) {
        const existingCleanSubject = normalizeSubject(ticket.content.subject);
        
        // Exact String Match (ignoring "Re:")
        if (cleanSubject === existingCleanSubject) {
            return {
                found: true,
                ticketId: ticket.ticketId,
                reason: "Same sender + Same subject (ignoring Re:) within 48h",
                method: "SUBJECT_EXACT_MATCH"
            };
        }
    }

    // --- STRATEGY D: Semantic Similarity (AI Embeddings) ---
    // (Skipped for now to ensure stability without external dependencies)

    return { found: false };
};

module.exports = { findExistingThread };
