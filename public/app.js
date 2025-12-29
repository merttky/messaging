const socket = io();
let currentUser = localStorage.getItem('selectedUser');

// Sayfa yüklendiğinde kullanıcı kontrolü
window.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    showChatScreen();
  }
});

// Kullanıcı seçimi
function selectUser(username) {
  currentUser = username;
  localStorage.setItem('selectedUser', username);
  showChatScreen();
}

function showChatScreen() {
  document.getElementById('user-selection').style.display = 'none';
  document.getElementById('chat-container').style.display = 'flex';
  document.getElementById('current-user').textContent = `Kullanıcı: ${currentUser}`;
  
  // Enter tuşuyla gönder
  document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

// Geçmiş mesajları yükle
socket.on('message-history', (messages) => {
  messages.forEach(msg => addMessage(msg));
});

// Yeni mesaj geldiğinde
socket.on('new-message', (message) => {
  addMessage(message);
});

function sendMessage() {
  const messageText = document.getElementById('message').value.trim();
  
  if (messageText && currentUser) {
    socket.emit('send-message', {
      user: currentUser,
      text: messageText
    });
    document.getElementById('message').value = '';
  }
}

function addMessage(message) {
  const messagesDiv = document.getElementById('messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message';
  
  // Kendi mesajımızsa farklı stil
  if (message.user === currentUser) {
    msgDiv.classList.add('own-message');
  }
  
  msgDiv.innerHTML = `
    <strong>${message.user}</strong>
    <span class="time">${message.time}</span>
    <p>${message.text}</p>
  `;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
