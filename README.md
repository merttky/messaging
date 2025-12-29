# Anlık Mesajlaşma Uygulaması

WebSocket tabanlı basit ve hızlı mesajlaşma uygulaması.

## Kurulum

1. **Node.js yükleyin** (https://nodejs.org)

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

## Çalıştırma

```bash
npm start
```

veya

```bash
node server.js
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

## İnternetten Erişim

### Ngrok ile (Önerilen)

1. Ngrok yükleyin: `brew install ngrok`
2. Çalıştırın: `ngrok http 3000`
3. Verilen URL'i paylaşın (örn: `https://abc123.ngrok.io`)

### Cloudflare Tunnel ile

1. Cloudflare Tunnel yükleyin
2. `cloudflared tunnel --url http://localhost:3000`

## Özellikler

✅ Anlık mesajlaşma (WebSocket)
✅ Mesaj geçmişi
✅ Mobil uyumlu
✅ Kullanıcı adı desteği
✅ Zaman damgası

## Teknolojiler

- Node.js
- Express.js
- Socket.IO
- HTML/CSS/JavaScript
