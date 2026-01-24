const axios = require('axios');

async function verifyIntegration() {
    const url = 'http://localhost:5013/api/tickets';
    const randomId = Math.floor(Math.random() * 100000);
    const payload = {
        "subject": `Billing Help ${randomId}`,
        "body": "I need to update my payment method",
        "customerEmail": `test${randomId}@user.com`
    };

    try {
        console.log('Sending request to:', url);
        console.log('Payload:', payload);
        const response = await axios.post(url, payload);
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data.data.ticket.enrichment) {
            console.log('SUCCESS: Enrichment data found in response.');
            console.log('Enrichment Data:', JSON.stringify(response.data.data.ticket.enrichment, null, 2));
        } else {
            console.error('FAILURE: Enrichment data NOT found in response.');
        }
    } catch (error) {
        console.error('Error Message:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

verifyIntegration();
