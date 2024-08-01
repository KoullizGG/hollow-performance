require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve your static files (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to receive chat from frontend
app.post('/api/chatbot', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: `You are a knowledgeable chatbot for a car performance company. A customer asks: "${userMessage}"`,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        // Send back the chatbot's response to the client
        res.json({ response: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Error processing your request');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
