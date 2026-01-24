import axios from "axios";
import { ApiError } from "../utils/Apierror.js";

const CLASSIFIER_URL = "https://hasteful-sophia-cardiologic.ngrok-free.dev/classify";

export const classifyContent = async (text) => {
  try {
    // 1. Construct the exact payload your API expects
    const payload = {
      text: text 
    };

    console.log("Sending to Classifier:", payload);

    // 2. Make the POST request
    const response = await axios.post(CLASSIFIER_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000 // 5s timeout to prevent hanging
    });

    // 3. Return the exact data structure: { category, confidence, urgent }
    return response.data;

  } catch (error) {
    console.error("Classifier API Failed:", error.message);
    
    // Fallback if API is down (Prevents backend crash)
    return {
      category: "General Inquiry",
      confidence: 0,
      urgent: false
    };
  }
};