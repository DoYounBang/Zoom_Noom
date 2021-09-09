const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`you: ${value}`);
    });
    input.value = "";
}

  function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}  
    
function showRoom(mes){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgform = room.querySelector("#msg");
    const nameform = room.querySelector("#name");
    msgform.addEventListener("submit", handleMessageSubmit);
    nameform.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value ,showRoom);// 순서 = event name, 내 마음대로 , function
    roomName = input.value;
    input.value = ""; //서버로 부터 실행되는 function을 보냄, emit와 on은 같음 그래서 이름도 같아야 함.
}

form.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${(newCount)})`;
    addMessage(`${user}님이 왔습니다!`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${(newCount)})`;
    addMessage(`${left}님이 떠나갔습니다.`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
}); // socket.on("room_change", (msg) => console.log(msg)); 같은 내용임


/* const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

function handleOpen(){
    console.log ("Connected to Server 🌕");
};

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});


socket.addEventListener("close", () => {
    console.log("Disconnected to Server 🌑");
});

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input")
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit",handleNickSubmit); */