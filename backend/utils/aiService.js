const axios = require('axios');
const { ApiError } = require('./Apierror.js');

// URL provided by the user
const EMBEDDING_API_URL = "https://renda-corrodible-unsavorily.ngrok-free.dev/get-embedding";

const generateEmbedding = async (text) => {
    try {
        console.log("Generating embedding for:", text);
        const response = await axios.post(EMBEDDING_API_URL, { text });

        if (response.data && response.data.embedding) {
            return response.data.embedding;
        } else {
            throw new Error("Invalid response format from Embedding API");
        }
    } catch (error) {
        console.error("Embedding API Error:", error.message);
        throw new ApiError(500, "Failed to generate embedding via external API");
    }
};

module.exports = { generateEmbedding };
