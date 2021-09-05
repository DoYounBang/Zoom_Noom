const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")

function backendDone(mes){
    console.log(`The backend says: `, mes);//front-end 에서 코드를 만들어 back-end에서 코드를 실행함
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", { payload: input.value },backendDone);// 순서 = event name, 내 마음대로 , function
    input.value = ""; //서버로 부터 실행되는 function을 보냄, emit와 on은 같음 그래서 이름도 같아야 함.
}

form.addEventListener("submit", handleRoomSubmit);


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