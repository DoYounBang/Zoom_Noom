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

function publicRooms(){
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if(sids.get(key) === undefined){
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "익명";
  socket.onAny((event) => {
    console.log(`sockent Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
    wsServer.sockets.emit("room_change", publicRooms());//모두에게 메시지를 보냄
    /*console.log(socket.id);
    console.log(socket.rooms); // Set { <socket.id> }
    console.log(socket.rooms); // Set { <socket.id>, "room1" }*/
  });//front-end의 코드를 실행시킴.
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => 
      socket.to(room).emit("bye", socket.nickname)
      );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();//백앤드에서 실행하지 않음
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

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