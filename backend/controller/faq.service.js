import { FAQ } from "../models/KnowledgeBase.js"; 
import { generateEmbedding } from "../utils/aiService.js"; 
import { ApiError } from "../utils/Apierror.js"; // Import your custom error

export const findBestFAQMatch = async (queryText) => {
  if (!queryText) {
    throw new ApiError(400, "Query text is required for FAQ search");
  }

  // 1. Generate Vector
  const queryVector = await generateEmbedding(queryText);
  
  if (!queryVector) {
    throw new ApiError(500, "Failed to generate AI embedding for query");
  }

  // 2. Run Vector Search
  const results = await FAQ.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",       
        path: "vector_embedding",    
        queryVector: queryVector,
        numCandidates: 100,          
        limit: 1                     
      }
    },
    {
      $project: {
        _id: 1,
        topic: 1,
        content: 1,
        score: { $meta: "vectorSearchScore" } 
      }
    }
  ]);

  // 3. Analyze Result
  const bestMatch = results.length > 0 ? results[0] : null;
  const score = bestMatch ? bestMatch.score : 0;

  // 4. Logic Thresholds
  let matchType = "NO_MATCH";

  if (score >= 0.90) {
    matchType = "PERFECT_MATCH"; 
  } else if (score >= 0.60) {
    matchType = "PARTIAL_MATCH"; 
  }

  return {
    matchType,      
    score,          
    bestMatch       
  };
};