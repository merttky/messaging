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
  
  // Sunucuya çevrimiçi olduğumuzu bildir
  socket.emit('user-online', currentUser);
  
  // Bildirim izni iste
  requestNotificationPermission();
  
  // Yazıyor göstergesi
  let typingTimer;
  const messageInput = document.getElementById('message');
  
  messageInput.addEventListener('input', () => {
    socket.emit('typing', currentUser);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      socket.emit('stop-typing');
    }, 1000);
  });
  
  // Enter tuşuyla gönder
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
      socket.emit('stop-typing');
    }
  });
}

// Bildirim izni iste
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Geçmiş mesajları yükle
socket.on('message-history', (messages) => {
  messages.forEach(msg => addMessage(msg));
});

// Yeni mesaj geldiğinde
socket.on('new-message', (message) => {
  // Kendi mesajın değilse bildirim göster
  if (message.user !== currentUser) {
    showNotification(message);
  }
  addMessage(message);
});

// Çevrimiçi kullanıcılar
socket.on('online-users', (users) => {
  const otherUsers = users.filter(u => u !== currentUser);
  const statusEl = document.getElementById('online-status');
  if (otherUsers.length > 0) {
    statusEl.textContent = `🟢 ${otherUsers.join(', ')} çevrimiçi`;
    statusEl.style.color = '#4ade80';
  } else {
    statusEl.textContent = '⚪ Kimse çevrimiçi değil';
    statusEl.style.color = '#94a3b8';
  }
});

// Yazıyor göstergesi
socket.on('user-typing', (username) => {
  if (username !== currentUser) {
    const indicator = document.getElementById('typing-indicator');
    indicator.querySelector('.typing-dots').innerHTML = 
      `${username} yazıyor<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
    indicator.style.display = 'block';
  }
});

socket.on('user-stop-typing', () => {
  document.getElementById('typing-indicator').style.display = 'none';
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

// Bildirim göster
function showNotification(message) {
  // Sayfa arka plandaysa ve izin varsa bildirim göster
  if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(`${message.user} mesaj gönderdi 💬`, {
      body: message.text,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💬</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💬</text></svg>',
      tag: 'chat-message',
      requireInteraction: false,
      silent: false
    });
    
    // Bildirime tıklanınca pencereyi öne getir
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    // 5 saniye sonra bildirimi kapat
    setTimeout(() => notification.close(), 5000);
  }
}
