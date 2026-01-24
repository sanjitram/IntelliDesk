const FAQ = require("../models/FAQ.js");
const { generateEmbedding } = require("../utils/aiService.js");
const { ApiError } = require("../utils/Apierror.js");

// Helper function to calculate Cosine Similarity
const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const findBestFAQMatch = async (queryText) => {
    if (!queryText) {
        throw new ApiError(400, "Query text is required for FAQ search");
    }

    // 1. Generate Vector for the Query
    const queryVector = await generateEmbedding(queryText);

    if (!queryVector) {
        throw new ApiError(500, "Failed to generate AI embedding for query");
    }

    // 2. Fetch ALL FAQs from local DB (Inefficient for huge DBs, but fine for local testing)
    // We need the 'vector_embedding' field which might not be selected by default if we don't ask
    const allFaqs = await FAQ.find({});

    // 3. Perform In-Memory Vector Search
    let bestMatch = null;
    let maxScore = -1;

    for (const faq of allFaqs) {
        if (faq.vector_embedding && Array.isArray(faq.vector_embedding)) {
            const score = cosineSimilarity(queryVector, faq.vector_embedding);
            if (score > maxScore) {
                maxScore = score;
                bestMatch = faq;
            }
        }
    }

    // 4. Logic Thresholds
    let matchType = "NO_MATCH";
    // Using the same thresholds as before
    if (maxScore >= 0.90) {
        matchType = "PERFECT_MATCH";
    } else if (maxScore >= 0.60) {
        matchType = "PARTIAL_MATCH";
    }

    return {
        matchType,
        score: maxScore > 0 ? maxScore : 0,
        bestMatch
    };
};

module.exports = { findBestFAQMatch };
