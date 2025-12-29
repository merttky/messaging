const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let messages = []; // Basit mesaj geçmişi
let onlineUsers = {}; // Çevrimiçi kullanıcılar

io.on('connection', (socket) => {
  console.log('Kullanıcı bağlandı');
  
  // Kullanıcı giriş yaptı
  socket.on('user-online', (username) => {
    socket.username = username;
    onlineUsers[socket.id] = username;
    io.emit('online-users', Object.values(onlineUsers));
  });
  
  // Geçmiş mesajları gönder
  socket.emit('message-history', messages);
  socket.emit('online-users', Object.values(onlineUsers));
  
  // Yazıyor durumu
  socket.on('typing', (username) => {
    socket.broadcast.emit('user-typing', username);
  });
  
  socket.on('stop-typing', () => {
    socket.broadcast.emit('user-stop-typing');
  });
  
  // Yeni mesaj
  socket.on('send-message', (data) => {
    const message = {
      user: data.user,
      text: data.text,
      time: new Date().toLocaleTimeString('tr-TR')
    };
    messages.push(message);
    io.emit('new-message', message); // Herkese gönder
  });
  
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı');
    if (socket.username) {
      delete onlineUsers[socket.id];
      io.emit('online-users', Object.values(onlineUsers));
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
