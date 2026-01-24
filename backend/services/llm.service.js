// Placeholder for LLM service
const generateForPartialMatch = async (fullText, bestMatch) => {
    console.log("Generating response for partial match:", fullText);
    return `Suggested solution based on: ${bestMatch.topic}\n\n${bestMatch.content}`;
};

module.exports = { generateForPartialMatch };
