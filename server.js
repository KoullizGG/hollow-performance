// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env file
dotenv.config();

app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store conversation state
let conversationHistory = [];

app.post('/api/chatbot', async (req, res) => {
    const userMessage = req.body.message.trim();

    // Add user message to the conversation history
    conversationHistory.push({ role: 'user', content: userMessage });

    try {
        // Define a conversational prompt
        const prompt = `
            You are a friendly and knowledgeable assistant at Hollow Performance, an ECU tuning and car performance upgrade service. 
            Answer user questions with concise and helpful information. When a user asks about tuning, suggest relevant details such as 
            make, model, year, and engine type to provide the best advice. Make the conversation engaging, friendly, and provide short answers. 
            Offer HP estimates if possible and encourage users to contact us for a quote at the end of the conversation.
        `;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: prompt },
                    ...conversationHistory
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

        const aiResponse = response.data.choices[0].message.content.trim();

        // Add AI response to the conversation history
        conversationHistory.push({ role: 'assistant', content: aiResponse });

        // Reset the conversation history if it gets too long or if the user asks for a restart
        if (conversationHistory.length > 20 || /reset|restart/i.test(userMessage)) {
            conversationHistory = [];
        }

        // Send the AI response
        res.json({ response: aiResponse });
    } catch (error) {
        if (error.response) {
            console.error('API error:', error.response.data);
            res.status(500).json({ error: error.response.data });
        } else if (error.request) {
            console.error('No response received:', error.request);
            res.status(500).send('No response from API');
        } else {
            console.error('Error setting up request:', error.message);
            res.status(500).send('Error processing your request');
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
