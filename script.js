const messages = document.getElementById('messages');
const inputMessage = document.getElementById('inputMessage');
const sendButton = document.getElementById('sendButton');

function appendMessage(text, sender, message=null) {
  if (!message) {
    message = document.createElement('div');
    message.className = sender;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

  if (sender === 'user') {
    message.textContent = text;
  } else {

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        message.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }
}

async function sendMessage(text) {
  appendMessage(text, 'user');
  inputMessage.value = '';

  const gptMessage = document.createElement('div');
  gptMessage.className = 'gpt';
  messages.appendChild(gptMessage);
  
  const loadingContainer = document.createElement('div');
  loadingContainer.className = 'loading-container';
  gptMessage.appendChild(loadingContainer);
  
  const loading = document.getElementById('loading').cloneNode(true);
  loading.style.visibility = 'visible';
  loadingContainer.appendChild(loading);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ "role": "user", "content": text }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const gptResponse = data.choices[0].message.content;
    loadingContainer.remove()
    appendMessage(gptResponse, 'gpt', gptMessage);
  } catch (error) {
    console.error('Error:', error);
    appendMessage('Error occurred while communicating with GPT-4 API', 'error');
  }
}

sendButton.addEventListener('click', () => {
  const text = inputMessage.value.trim();
  if (text) {
    sendMessage(text);
  }
});

inputMessage.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const text = inputMessage.value.trim();
    if (text) {
      sendMessage(text);
    }
  }
});