import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000/');

const server = http.createServer(app); //http 서버
const wss = new WebSocket.Server({ server }); //ws 서버
//서버에서 http, webSocket 둘다 작동시킴

wss.on("connection", (socket) => {
    console.log("Connected to Browser 🌕");
    socket.on("close", () => console.log("Disconnected from the Browser 🌑"));
    socket.on('message', message => {
        const translatedMessageData = message.toString('utf8'); // 정수형으로 바꿔줌
        console.log(translatedMessageData);
      }); // frontend와 메시지를 주고받음
    socket.send("hello!!!");
  });

server.listen(3000, handleListen);