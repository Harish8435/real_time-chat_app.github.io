const socket = io('http://localhost:8000');

// Get DOM elements in respective JavaScript Variables....
const form = document.getElementById('send-Msg');
const messageInput = document.getElementById('msgInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving messages....
var audio = new Audio('tune.mp3');

// Function Which Will Append Event info to the Container....
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left')
    {
        audio.play();
    }
}

// Ask new user for his/her name and let the server know.... 
const name = prompt("Enter Your Name to Join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the Server....
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right');
})

// If server sends a message, receive it....
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
})

// If a user leaves the Chat, Append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right');
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value=''
})