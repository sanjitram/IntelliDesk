import { asynchandler } from "../utils/AsyncHandler.js";
import { Ticket } from "../models/Ticket.js"; 
import { classifyContent } from "../services/classifier.service.js"; 
import { findBestFAQMatch } from "../utils/faq.service.js";
import { generateForPartialMatch } from "../utils/llm.service.js"; // <--- NEW IMPORT
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/Apierror.js";

const createTicket = asynchandler(async (req, res) => {
  const { subject, body, customerEmail, customerDomain } = req.body;

  if (!subject || !body) {
    throw new ApiError(400, "Subject and Body are required");
  }

  const fullText = `Subject: ${subject}. ${body}`;

  // 1. PARALLEL EXECUTION
  const [classificationResult, faqResult] = await Promise.all([
    classifyContent(fullText), 
    findBestFAQMatch(fullText)
  ]);

  // 2. PROCESS CLASSIFICATION
  const severity = classificationResult.urgent ? "P1" : "P3";
  const category = classificationResult.category || "General";
  const confidence = classificationResult.confidence || 0;

  // 3. PROCESS RESOLUTION LOGIC
  let ticketStatus = "New";
  let resolutionAction = "No_Match";
  let autoResponseText = null;
  let linkedFaqId = null;

  if (faqResult.matchType === "PERFECT_MATCH") {
    // === CASE A: > 90% (Perfect) ===
    // Use Hardcoded template for speed (Trust is high)
    ticketStatus = "Auto-Replied";
    resolutionAction = "Auto_Resolved";
    linkedFaqId = faqResult.bestMatch._id;
    
    autoResponseText = `
      Hi there,
      Based on your issue regarding "${category}", we found a solution:
      **${faqResult.bestMatch.topic}**
      
      ${faqResult.bestMatch.content}
      
      (AI Confidence: ${(faqResult.score * 100).toFixed(1)}%)
    `;

  } else if (faqResult.matchType === "PARTIAL_MATCH") {
    // === CASE B: 60% - 90% (Partial) ===
    // NEW: Use Generative AI to frame the suggestion gently
    ticketStatus = "In_Progress"; 
    resolutionAction = "Suggestion_Sent";
    linkedFaqId = faqResult.bestMatch._id;

    // Call the Generator Service
    autoResponseText = await generateForPartialMatch(fullText, faqResult.bestMatch);
  }
  
  // === CASE C: < 60% (No Match) ===
  // Status stays "New", autoResponseText stays null (Human agent needed)

  // 4. PREPARE THREAD
  const threadHistory = [];
  if (autoResponseText) {
    threadHistory.push({
      sender: 'AI_Agent',
      message: autoResponseText,
      timestamp: new Date()
    });
  }

  // 5. SAVE TO DB
  const newTicket = await Ticket.create({
    ticketId: `TKT-${Date.now()}`,
    customer: { email: customerEmail, domain: customerDomain },
    content: { subject, original_body: body },
    classification: {
      category: category,
      confidence_score: confidence,
      severity: severity,
      is_escalated: classificationResult.urgent
    },
    resolution: {
      status: resolutionAction,
      linked_faq_id: linkedFaqId
    },
    status: ticketStatus,
    thread: threadHistory
  });

  // 6. SEND RESPONSE
  return res.status(201).json(
    new ApiResponse(
      201, 
      {
        ticket: newTicket,
        ai_analysis: {
          classified_as: category,
          faq_match_score: faqResult.score,
          action_taken: resolutionAction
        }
      }, 
      "Ticket created and processed"
    )
  );
});

export { createTicket };