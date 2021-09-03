import http from "http";
import WebSocket from "ws";
import express from "express";
import { SocketAddress } from "net";
import { join } from "path";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000/');

const server = http.createServer(app); //http 서버
const wss = new WebSocket.Server({ server }); //ws 서버

function onSocketClose() {
  console.log("Disconnected from the Vrowser 🌑");
}

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
    }); //frontend와 메시지를 주고받음
  });

server.listen(3000, handleListen);