# NapiOnlineGame

Bu proje, **Node.js** ile **C++ (N-API)** kullanarak **gerçek zamanlı** bir mini-oyun yapmak için oluşturulmuştur.  
**WebSocket** üzerinden haberleşerek, **multithreading** ve **N-API** kullanımı basit bir şekilde gösterilmektedir.

## Amaç
- **node-addon-api** kullanarak bazı işlemleri **C++ tarafında** çalıştırıp performans kazanmak.  
- **Multithreading** kullanarak, Node.js ana akışını engellemeden grafik işlemlerini çalıştırmak.  
- **WebSocket (ws)** ile anlık veri iletişimini göstermek.  

## Proje Yapısı
```
.
├── server.js               # WebSocket sunucu
├── client
│   ├── client.js           # İstemci (Node.js, N-API modülü ile iletişim kurar)
│   ├── cppFiles
│   │   ├── main.cpp        # C++ (N-API + Raylib) ana kodu
│   │   └── ...
└── README.md
```

## Kurulum ve Çalıştırma

### 1. N-API Modülünü Derle
C++ dosyalarını `node-gyp` veya `cmake-js` gibi araçlarla derleyerek `.node` dosyasını oluşturun.

Örnek olarak:
```sh
node-gyp configure build
```
Bağlantı başarılı olursa **`build/Release/game_client.node`** dosyası oluşacaktır.

### 2. Sunucuyu Başlat
```sh
node server.js
```
- `3000` portunda WebSocket sunucusu başlatılır.

### 3. İstemciyi Çalıştır
```sh
cd client
node client.js
```
- Sunucuya bağlanır ve **C++ tarafındaki grafik işlemleri** (Raylib vb.) çalıştırılır.  

## Notlar
- Bu proje **öğrenme amacı** ile olarak hazırlanmıştır.  
- **N-API, multithreading ve WebSocket** konularını basit bir şekilde kullanmak için oluşturulmuştur.  
- Daha fazla geliştirme için **Node.js - C++ entegrasyonu** üzerine çalışabilirsiniz.

