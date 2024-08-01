function toggleChatbot() {
    const chatbotPopup = document.getElementById("chatbotPopup");
    chatbotPopup.style.display = chatbotPopup.style.display === "none" ? "block" : "none";
}

function closeChatbot() {
    const chatbotPopup = document.getElementById("chatbotPopup");
    chatbotPopup.style.display = "none";
}

async function sendChat() {
    const chatInput = document.getElementById("chatInput").value;
    const chatResponses = document.getElementById("chatResponses");

    // Append user's message to the chatResponses
    const userMessage = document.createElement("div");
    userMessage.textContent = "You: " + chatInput;
    chatResponses.appendChild(userMessage);

    try {
        // Send the message to the server
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: chatInput })
        });

        const data = await response.json();

        // Append AI's response to the chatResponses
        const aiMessage = document.createElement("div");
        aiMessage.textContent = "AI: " + data.response;
        chatResponses.appendChild(aiMessage);
    } catch (error) {
        console.error('Error sending message to server:', error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "AI: Sorry, there was an error processing your request.";
        chatResponses.appendChild(errorMessage);
    }

    // Clear the chat input
    document.getElementById("chatInput").value = '';
}
