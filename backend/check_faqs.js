const mongoose = require('mongoose');
const FAQ = require('./models/FAQ');
require('dotenv').config();

const checkFAQs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const faqs = await FAQ.find({});
        console.log(`Found ${faqs.length} FAQs:`);

        faqs.forEach((faq, index) => {
            console.log(`\n--- FAQ #${index + 1} ---`);
            console.log(`Topic: ${faq.topic}`);
            console.log(`Category: ${faq.category}`);
            console.log(`Content: ${faq.content}`);
            console.log(`ID: ${faq._id}`);
            console.log(`Has Vector: ${faq.vector_embedding && faq.vector_embedding.length > 0 ? 'Yes' : 'No'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkFAQs();
