const game = require("../build/Release/game_client.node");
const ws = require("ws");


const socket = new ws.WebSocket("ws://localhost:3000");

let player = null; 


let gameState = {
  ball: { x: 400, y: 300 },
  p1y: 200,
  p2y: 200,
  score: { p1: 0, p2: 0 }
};


game.startGame();


socket.on("open", () => {
  console.log("Sunucuya bağlandı");
});

socket.on("message", (rawData) => {
  const msg = JSON.parse(rawData);

  switch (msg.type) {
    case "assign":
      player = msg.player;
      console.log("Oyuncu atandı =", player);
      break;

    case "update":
      gameState.ball.x = msg.ball.x;
      gameState.ball.y = msg.ball.y;
      gameState.p1y = msg.p1y;
      gameState.p2y = msg.p2y;
      gameState.score = msg.score;

      game.setBallPos(gameState.ball.x, gameState.ball.y);
      game.setP1Pos(gameState.p1y);
      game.setP2Pos(gameState.p2y);
      break;

    default:
      console.log("HATA:", msg);
      break;
  }
});


setInterval(() => {
  if (!player) return; 
  
  
  game.moveLocalPlayer(player);

  
  const info = game.getGameInfo();
    if (player === 1) {
    socket.send(JSON.stringify({ type: "move", y: info.P1Y }));
  } else if (player === 2) {
    socket.send(JSON.stringify({ type: "move", y: info.P2Y }));
  }
}, 50);

