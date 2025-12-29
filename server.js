const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let messages = []; // Basit mesaj geçmişi

io.on('connection', (socket) => {
  console.log('Kullanıcı bağlandı');
  
  // Geçmiş mesajları gönder
  socket.emit('message-history', messages);
  
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
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
