const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const messages = [];

class User {
    constructor(name) {
        this.name = name;
    }

    sendMessage(content) {
        const message = new Message(this.name, content);
        messages.push(message);
        appendMessage(message);
    }
}

class AI extends User {
    constructor() {
        super('UTSmartBot');
    }

    sendMessage(content) {
        sendMessageToAI(content);
    }
}

class Message {
    constructor(sender, content) {
        this.sender = sender;
        this.content = content;
    }
}

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-box', message.sender === 'You' ? 'user-message' : 'ai-message');

    const senderLabel = document.createElement('strong');
    senderLabel.textContent = `${message.sender}: `;
    messageElement.appendChild(senderLabel);
    String(message.content).split('\n').forEach((line, index) => {
        if (index > 0) messageElement.appendChild(document.createElement('br'));
        messageElement.appendChild(document.createTextNode(line));
    });
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessageToAI(message) {
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        if (!response.ok) throw new Error('Chat request failed');

        const data = await response.json();
        const reply = message.toLowerCase() === 'hi'
            ? 'Hello! I am UTSmartBot, your friendly assistant for all things University of Technology Sarawak. How can i help you? :D'
            : data.response;
        const aiMessage = new Message('UTSmartBot', reply);
        messages.push(aiMessage);
        appendMessage(aiMessage);
    } catch (error) {
        console.error('Error fetching response:', error);
        const errorMessage = new Message('UTSmartBot', 'Oops! Something went wrong. Please try again later.');
        messages.push(errorMessage);
        appendMessage(errorMessage);
    }
}

document.querySelectorAll('.sidebar ul li').forEach((item) => {
    item.addEventListener('click', () => {
        userInput.value = item.textContent;
    });
});

const model = new AI();
function submitMessage() {
    const userMessage = userInput.value;
    if (!userMessage.trim()) return;

    model.sendMessage(userMessage);
    const userMessageObj = new Message('You', userMessage);
    messages.push(userMessageObj);
    appendMessage(userMessageObj);
    userInput.value = '';
}

sendBtn.addEventListener('click', submitMessage);
userInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') submitMessage();
});
