// const mongoose = require('mongoose');
// const FAQ = require('./models/FAQ');
// const { generateEmbedding } = require('./utils/aiService');
// require('dotenv').config();

// const seedFAQ = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to DB");

//         const topic = "Billing Issue";
//         const content = "To update your billing information, go to Settings > Billing and click 'Update Payment Method'.";

//         // Generate embedding using the external API
//         const vector = await generateEmbedding(topic + " " + content);

//         await FAQ.create({
//             topic,
//             content,
//             category: "Billing",
//             vector_embedding: vector
//         });

//         console.log("FAQ Seeded Successfully");
//         process.exit(0);
//     } catch (error) {
//         console.error("Seeding Failed:", error);
//         process.exit(1);
//     }
// };

// seedFAQ();
