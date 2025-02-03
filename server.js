const ws = require("ws");

class GameLogic {
  constructor() {
    this.resetGame();
  }

  resetGame() {
    this.score = { p1: 0, p2: 0 };
    this.P1IsOnline = false;
    this.P2IsOnline = false;
    this.p1y = 250;
    this.p2y = 250;
    this.ballX = 400;
    this.ballY = 300;
    this.dX = 5;  
    this.dY = 5;  
  }

  update() {
    
    this.ballX += this.dX;
    this.ballY += this.dY;
    this.checkCollisions();
  }

  checkCollisions() {
    
    if (this.ballY <= 0 || this.ballY >= 600) {
      this.dY *= -1;
    }


    if (
      this.ballX <= 30 &&  
      this.ballX >= 20 &&
      this.ballY >= this.p1y &&
      this.ballY <= this.p1y + 100
    ) {
      this.dX = Math.abs(this.dX);
    }

    
    if (
      this.ballX >= 750 && 
      this.ballX <= 780 &&
      this.ballY >= this.p2y &&
      this.ballY <= this.p2y + 100
    ) {
      this.dX = -Math.abs(this.dX);
      const hitPos = (this.ballY - this.p2y) / 100;
      this.dY = (hitPos - 0.5) * 10;
    }

    
    if (this.ballX > 800) {
      this.score.p1++;
      this.resetBall(-5); 
    } else if (this.ballX < 0) {
      this.score.p2++;
      this.resetBall(5); 
    }
  }

  resetBall(direction) {
    this.ballX = 400;
    this.ballY = 300;
    this.dX = direction;
    this.dY = 5 * (Math.random() > 0.5 ? 1 : -1);
  }

  getGameState() {
    return {
      ball: { x: this.ballX, y: this.ballY },
      p1y: this.p1y,
      p2y: this.p2y,
      score: this.score
    };
  }
}

const game = new GameLogic();


const wss = new ws.WebSocketServer({ port: 3000 });


setInterval(() => {
  if (game.P1IsOnline && game.P2IsOnline) {
    
    game.update();
    
    const state = JSON.stringify({
      type: "update",
      ...game.getGameState()
    });
    wss.clients.forEach(client => {
      if (client.readyState === ws.WebSocket.OPEN) {
        client.send(state);
      }
    });
  }
}, 1000 / 60);

wss.on("connection", (socket) => {
  console.log("Yeni bağlantı!");

  
  if (!game.P1IsOnline) {
    game.P1IsOnline = true;
    socket.player = 1;
    socket.send(JSON.stringify({ type: "assign", player: 1 }));
  } else if (!game.P2IsOnline) {
    game.P2IsOnline = true;
    socket.player = 2;
    socket.send(JSON.stringify({ type: "assign", player: 2 }));
  } else {
    
    socket.close();
    return;
  }

  
  socket.on("message", (rawData) => {
    const msg = JSON.parse(rawData.toString());
    if (msg.type === "move") {
      
      if (socket.player === 1) {
        game.p1y = Math.max(0, Math.min(500, msg.y));
      } else if (socket.player === 2) {
        game.p2y = Math.max(0, Math.min(500, msg.y));
      }
    }
  });

  
  socket.on("close", () => {
    console.log(`Oyuncu ${socket.player} ayrıldı.`);
    if (socket.player === 1) {
      game.P1IsOnline = false;
    } else if (socket.player === 2) {
      game.P2IsOnline = false;
    }
  });
});

wss.on("listening", () => {
  console.log("Sunucu 3000 portunda dinleniyor...");
});
