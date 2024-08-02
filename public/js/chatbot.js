document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotPopup = document.getElementById('chatbotPopup');
    const chatMessages = document.getElementById('chatMessages');
    const closeBtn = document.querySelector('.close-btn'); // Select the close button
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const contactError = document.getElementById('contact-error');

    // Event listeners
    chatbotButton.addEventListener('click', toggleChatbot);
    closeBtn.addEventListener('click', toggleChatbot); // Add event listener to close button

    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendChat();
        }
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                contactSuccess.style.display = 'block';
                contactError.style.display = 'none';
                contactForm.reset(); // Reset form fields
            } else {
                contactSuccess.style.display = 'none';
                contactError.style.display = 'block';
            }
        }).catch(error => {
            console.error('Form submission error:', error);
            contactSuccess.style.display = 'none';
            contactError.style.display = 'block';
        });
    });

    // Toggle chatbot visibility
    function toggleChatbot() {
        chatbotPopup.style.display = chatbotPopup.style.display === 'none' || chatbotPopup.style.display === '' ? 'block' : 'none';
        if (chatbotPopup.style.display === 'block') {
            chatInput.focus();
        }
    }

    // Send chat message
    function sendChat() {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessageToChat(userMessage, 'user'); // Use 'user' for consistent CSS class naming
            chatInput.value = '';
            fetch('/api/chatbot', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: userMessage})
            })
            .then(response => response.json())
            .then(data => {
                addMessageToChat(data.response, 'mikey'); // Use 'mikey' for Mikey's messages
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat('Error communicating with Mikey.', 'system'); // Added 'system' for error messages
            });
        }
    }

    // Add message to chat window
    function addMessageToChat(message, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `chat-message ${sender}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message';
        messageContent.textContent = message;

        messageContainer.appendChild(messageContent);
        chatMessages.appendChild(messageContainer);

        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight; // Automatically scroll to the latest message
    }
});
