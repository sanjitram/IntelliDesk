const { asyncHandler } = require("../utils/AsyncHandler.js");
const axios = require('axios');
const Ticket = require("../models/Ticket.js");
const { classifyContent } = require("../services/classifier.service.js");
const { findBestFAQMatch } = require("../services/faq.service.js");
const { generateForPartialMatch } = require("../services/llm.service.js");
const { findExistingThread } = require("../services/deduplication.service.js");
const { ApiResponse } = require("../utils/apiresponse.js");
const { ApiError } = require("../utils/Apierror.js");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const createTicket = asyncHandler(async (req, res) => {
  const { subject, body, customerEmail, customerDomain } = req.body;

  if (!subject || !body || !customerEmail) {
    throw new ApiError(400, "Subject, Body, and Customer Email are required");
  }

  // --- DEDUPLICATION & THREADING CHECK ---
  const existingThread = await findExistingThread(subject, body, customerEmail);

  if (existingThread.found) {
    // Append message to existing thread
    const updatedTicket = await Ticket.findOneAndUpdate(
      { ticketId: existingThread.ticketId },
      {
        $push: {
          thread: {
            sender: 'Customer',
            message: body,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        { ticket: updatedTicket, reason: existingThread.reason },
        "Message added to existing ticket thread"
      )
    );
  }

  // Combine text ONLY for the FAQ Vector Search (needs full context)
  const fullText = `Subject: ${subject}. ${body}`;

  // 1. PARALLEL EXECUTION
  const [aiResult, faqResult, enrichmentResult] = await Promise.all([
    classifyContent(subject, body), // UPDATED: Pass subject/body separately for the new API
    findBestFAQMatch(fullText),      // Keep full text for Vector Search
    axios.post("https://maurice-clingy-overcivilly.ngrok-free.dev/process-email", {
      email: customerEmail,
      subject: subject,
      body: body
    }).then(res => res.data).catch(err => {
      console.error("Enrichment API failed:", err.message);
      return null;
    })
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

    // ENRICHMENT DATA
    enrichment: enrichmentResult ? {
      domain_mapping: {
        domain: enrichmentResult['1_Domain_Mapping']?.Domain,
        account_id: enrichmentResult['1_Domain_Mapping']?.Account_ID,
        tier: enrichmentResult['1_Domain_Mapping']?.Tier
      },
      user_lookup: {
        role_db: enrichmentResult['2_User_Lookup']?.Role_DB,
        last_login: enrichmentResult['2_User_Lookup']?.Last_Login,
        modules: enrichmentResult['2_User_Lookup']?.Modules
      },
      signature_parsing: {
        extracted_name: enrichmentResult['3_Signature_Parsing']?.Extracted_Name,
        extracted_role: enrichmentResult['3_Signature_Parsing']?.Extracted_Role,
        extracted_phone: enrichmentResult['3_Signature_Parsing']?.Extracted_Phone
      },
      multi_tenant_handling: {
        identified_locations: enrichmentResult['4_Multi_Tenant_Handling']?.Identified_Locations,
        routing: enrichmentResult['4_Multi_Tenant_Handling']?.Routing
      },
      lead_detection: {
        is_new_customer: enrichmentResult['5_Lead_Detection']?.Is_New_Customer,
        intent_detected: enrichmentResult['5_Lead_Detection']?.Intent_Detected,
        action: enrichmentResult['5_Lead_Detection']?.Action
      }
    } : undefined,

    is_escalated: shouldEscalate,

    resolution: {
      status: resolutionAction,
      linked_faq_id: linkedFaqId
    },
    status: ticketStatus,
    thread: threadHistory
  });

  // Update customer domain if available from enrichment
  if (enrichmentResult && enrichmentResult['1_Domain_Mapping']?.Domain) {
    newTicket.customer.domain = enrichmentResult['1_Domain_Mapping'].Domain;
    await newTicket.save();
  }

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
      },
      enrichment: newTicket.enrichment
    }, "Ticket processed")
  );
});

// GET /api/tickets - Get all tickets
const getAllTickets = asyncHandler(async (req, res) => {
  const { status, severity, category, limit = 50, page = 1 } = req.query;
  
  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (severity) filter['classification.severity'] = severity;
  if (category) filter['classification.category'] = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const tickets = await Ticket.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);
    
  const total = await Ticket.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(200, { 
      tickets, 
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    }, "Tickets fetched successfully")
  );
});

// GET /api/tickets/:ticketId - Get single ticket by ID
const getTicketById = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  
  const ticket = await Ticket.findOne({ ticketId }).populate('resolution.linked_faq_id');
  
  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  res.status(200).json(
    new ApiResponse(200, { ticket }, "Ticket fetched successfully")
  );
});

// PUT /api/tickets/:ticketId - Update ticket
const updateTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const updates = req.body;
  
  const ticket = await Ticket.findOneAndUpdate(
    { ticketId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  
  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  res.status(200).json(
    new ApiResponse(200, { ticket }, "Ticket updated successfully")
  );
});

// POST /api/tickets/:ticketId/reply - Add reply to ticket thread
const addReplyToTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { message, sender = 'Human_Agent' } = req.body;
  
  if (!message) {
    throw new ApiError(400, "Message is required");
  }
  
  const ticket = await Ticket.findOneAndUpdate(
    { ticketId },
    { 
      $push: { 
        thread: {
          sender,
          message,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  );
  
  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  res.status(200).json(
    new ApiResponse(200, { ticket }, "Reply added successfully")
  );
});

// POST /api/v1/tickets/quick-reply (No Ticket ID required)
const sendDirectEmail = asyncHandler(async (req, res) => {
  const { customerEmail, question, answer } = req.body;

  if (!customerEmail || !question || !answer) {
    throw new ApiError(400, "Customer email, question, and answer are required");
  }

  // Send Email
  await transporter.sendMail({
    to: customerEmail,
    subject: question,
    text: answer
  });

  res.status(200).json(new ApiResponse(200, { sent: true }, "Manual reply sent!"));
});

module.exports = { createTicket, getAllTickets, getTicketById, updateTicket, addReplyToTicket, sendDirectEmail };