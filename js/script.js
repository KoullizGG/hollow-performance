function getResponse() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    let response = '';
    if (userInput.includes('520d f10') && userInput.includes('stage 1')) {
        response = 'For a 520d F10, Stage 1 tuning can increase your HP by approximately 30-40 HP. The price is $500.';
    } else {
        response = 'Sorry, I don\'t understand that question.';
    }
    document.getElementById('chat-response').innerText = response;
}
