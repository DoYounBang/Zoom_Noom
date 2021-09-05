import http from "http";
import SocketIO from "socket.io";
// import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000/');

const httpServer = http.createServer(app); 
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`sockent Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
    /*console.log(socket.id);
    console.log(socket.rooms); // Set { <socket.id> }
    console.log(socket.rooms); // Set { <socket.id>, "room1" }*/
  });//front-end의 코드를 실행시킴.
}); //Jsom object를 보냄

/* function onSocketClose() {
  console.log("Disconnected from the Vrowser 🌑");
} */

/* const wss = new WebSocket.Server({ server }); //ws 서버
const sockets = [];
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "익명"
    console.log("Connected to Browser 🌕");
    socket.on("close", onSocketClose);
    socket.on('message', (msg) => {
      const message = JSON.parse(msg);
      switch(message.type){
        case "new_message":
          sockets.forEach((aSocket) => 
            aSocket.send(`${socket.nickname}: ${message.payload}`)
          );
          break;
        case "nickname":
          socket["nickname"] = message.payload;
      }
    });
  });
 */
httpServer.listen(3000, handleListen);