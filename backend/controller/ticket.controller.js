const { asyncHandler } = require("../utils/AsyncHandler.js");
const Ticket = require("../models/Ticket.js");
const { classifyContent } = require("../services/classifier.service.js");
const { findBestFAQMatch } = require("../services/faq.service.js");
const { generateForPartialMatch } = require("../services/llm.service.js");
const { ApiResponse } = require("../utils/apiresponse.js");
const { ApiError } = require("../utils/Apierror.js");

const createTicket = asyncHandler(async (req, res) => {
  const { subject, body, customerEmail, customerDomain } = req.body;

  if (!subject || !body || !customerEmail) {
    throw new ApiError(400, "Subject, Body, and Customer Email are required");
  }

  // Combine text ONLY for the FAQ Vector Search (needs full context)
  const fullText = `Subject: ${subject}. ${body}`;

  // 1. PARALLEL EXECUTION
  const [aiResult, faqResult] = await Promise.all([
    classifyContent(subject, body), // UPDATED: Pass subject/body separately for the new API
    findBestFAQMatch(fullText)      // Keep full text for Vector Search
  ]);

  // 2. PROCESS CLASSIFICATION (Extract new rich data)
  const {
    category = "General Inquiry",
    confidence = 0,
    severity = "P3",   // AI now tells us if it's P1/P2/P3
    sentiment = "Neutral",
    sla,
    flags = {}         // Defaults to empty object if missing
  } = aiResult;

  // 3. PROCESS RESOLUTION LOGIC (FAQ Matching)
  let ticketStatus = "New";
  let resolutionAction = "No_Match";
  let autoResponseText = null;
  let linkedFaqId = null;
  console.log("FAQ Result:", faqResult);

  if (faqResult.matchType === "PERFECT_MATCH") {
    // === CASE A: > 90% (Perfect) ===
    ticketStatus = "Auto-Replied";
    resolutionAction = "Auto_Resolved";
    linkedFaqId = faqResult.bestMatch._id;

    autoResponseText = `
      Hi there,
      Based on your issue regarding "${category}", we found a solution:
      **${faqResult.bestMatch.topic || faqResult.bestMatch.question}**
      
      ${faqResult.bestMatch.content || faqResult.bestMatch.answer} 
      
      (AI Confidence: ${(faqResult.score * 100).toFixed(1)}%)
    `;

  } else if (faqResult.matchType === "PARTIAL_MATCH") {
    // === CASE B: 60% - 90% (Partial) ===
    ticketStatus = "In_Progress";
    resolutionAction = "Suggestion_Sent";
    linkedFaqId = faqResult.bestMatch._id;

    // Call the Generator Service
    autoResponseText = await generateForPartialMatch(fullText, faqResult.bestMatch);
  }

  // 4. PREPARE THREAD
  const threadHistory = [];
  if (autoResponseText) {
    threadHistory.push({
      sender: 'AI_Agent',
      message: autoResponseText,
      timestamp: new Date()
    });
  }

  // 5. DETERMINE ESCALATION
  // Escalate if AI flags yelling OR if severity is critical (P1)
  const shouldEscalate = flags.is_yelling || flags.has_urgent_punctuation || severity === 'P1';

  // 6. SAVE TO DB
  const newTicket = await Ticket.create({
    ticketId: `TKT-${Date.now()}`,
    customer: { email: customerEmail, domain: customerDomain },
    content: { subject, original_body: body },

    // UPDATED: Store the rich AI data
    classification: {
      category: category,
      confidence_score: confidence,
      severity: severity,
      sentiment: sentiment, // New!
      sla: sla,             // New!
      flags: flags          // New! (is_yelling, etc.)
    },

    is_escalated: shouldEscalate,

    resolution: {
      status: resolutionAction,
      linked_faq_id: linkedFaqId
    },
    status: ticketStatus,
    thread: threadHistory
  });

  // 7. SEND RESPONSE
 return res.status(201).json(
  new ApiResponse(201, {
      ticket: newTicket,
      ai_analysis: {
        classified_as: category,
        severity: severity,
        // CRITICAL: Send these details to n8n
        faq_match_found: faqResult.matchType !== "NO_MATCH",
        faq_match_type: faqResult.matchType, // "PERFECT_MATCH" or "PARTIAL_MATCH"
        faq_solution: faqResult.bestMatch ? faqResult.bestMatch.content : null,
        faq_topic: faqResult.bestMatch ? faqResult.bestMatch.topic : null
      }
  }, "Ticket processed")
  ); 
});

module.exports = { createTicket };