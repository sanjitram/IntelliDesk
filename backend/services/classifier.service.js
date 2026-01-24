const axios = require("axios");
const { ApiError } = require("../utils/Apierror.js");

// UPDATED: New Endpoint
const CLASSIFIER_URL = "https://hasteful-sophia-cardiologic.ngrok-free.dev/process_email";

const classifyContent = async (subject, body) => {
    try {
        // UPDATED: Payload now matches your curl exactly
        const payload = {
            subject: subject,
            body: body
        };

        console.log("Sending to AI:", payload);

        const response = await axios.post(CLASSIFIER_URL, payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 8000 // Increased timeout slightly for heavier analysis
        });

        // Returns: { category, confidence, severity, sla, sentiment, flags: {...} }
        return response.data;

    } catch (error) {
        console.error("Classifier API Failed:", error.message);

        // Fail-safe Default
        return {
            category: "General Inquiry",
            confidence: 0,
            severity: "P3",
            sla: "24 Hours",
            sentiment: "Neutral",
            flags: { is_yelling: false, has_urgent_punctuation: false }
        };
    }
};

module.exports = { classifyContent };