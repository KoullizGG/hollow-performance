document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    // Send message when the send button is clicked
    sendButton.addEventListener('click', sendChat);

    // Enable sending message with Enter key, avoiding form submission
    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission
            sendChat();
        }
    });
});

function sendChat() {
    const chatInput = document.getElementById('chatInput');
    const userMessage = chatInput.value.trim();
    if (userMessage) {
        addMessageToChat(userMessage, 'You');
        chatInput.value = ''; // Clear the input after sending

        // Send message to server and handle response
        fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received from server:', data);
            addMessageToChat(data.response, 'Mikey');
        })
        .catch(error => {
            console.error('Error during fetch operation:', error.message);
            addMessageToChat("Error communicating with Mikey.", 'System');
        });
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.textContent = `${sender}: ${message}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

function toggleChatbot() {
    const chatbotPopup = document.getElementById('chatbotPopup');
    chatbotPopup.style.display = chatbotPopup.style.display === 'none' ? 'block' : 'none';
}

function closeChatbot() {
    document.getElementById('chatbotPopup').style.display = 'none';
}
