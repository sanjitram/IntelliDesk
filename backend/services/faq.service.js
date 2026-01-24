const axios = require("axios"); // Import axios for HTTP requests
const FAQ = require("../models/FAQ.js");
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

    // 1. Generate Vector for the Query using External API
    // URL: https://renda-corrodible-unsavorily.ngrok-free.dev/get-embedding
    let queryVector;
    try {
        const response = await axios.post("https://renda-corrodible-unsavorily.ngrok-free.dev/get-embedding", {
            text: queryText
        }, {
            timeout: 5000 // 5s timeout to prevent hanging if ngrok is slow
        });

        // Extract the embedding array from the response
        queryVector = response.data.embedding;

    } catch (error) {
        console.error("Embedding API Error:", error.message);
        throw new ApiError(500, "Failed to fetch embedding from external AI server");
    }

    if (!queryVector || !Array.isArray(queryVector)) {
        throw new ApiError(500, "Invalid embedding format received from server");
    }

    // 2. Fetch ALL FAQs from local DB 
    // (Note: For production with >10k items, switch to Atlas Vector Search)
    const allFaqs = await FAQ.find({});

    // 3. Perform In-Memory Vector Search
    let bestMatch = null;
    let maxScore = -1;

    for (const faq of allFaqs) {
        // Ensure the FAQ has a valid embedding stored
        if (faq.vector_embedding && Array.isArray(faq.vector_embedding)) {
            
            // Safety check: Vectors must be same length
            if (faq.vector_embedding.length === queryVector.length) {
                const score = cosineSimilarity(queryVector, faq.vector_embedding);
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = faq;
                }
            }
        }
    }

    // 4. Logic Thresholds
    let matchType = "NO_MATCH";
    
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