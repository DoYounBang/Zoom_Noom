const socket = new WebSocket(`ws://${window.location.host}/`);

socket.addEventListener("open", () => {
    console.log ("Connected to Server 🌕");
});

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected to Server 🌑");
});

setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000); // backend와 메시지를 주고받음 