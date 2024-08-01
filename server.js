// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env file
dotenv.config();

app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

app.post('/api/chatbot', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a knowledgeable chatbot for a car performance company.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ response: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Error processing your request');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
