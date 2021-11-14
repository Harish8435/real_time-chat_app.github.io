// Node Server Which will Handle io Connections..
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');

const io = require('socket.io')(8000);

const users = {};
const port = 3010;

app.use('/static', express.static('static')) // For serving static files

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    res.sendFile('/home/ChatApp/nodeServer/views/index.html')
})

io.on('connection', socket =>{
    // If Any New User Joins, Let Other Users Connected to the Server know....
    socket.on('new-user-joined', name =>{
        console.log("New User", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If Someone sends a message, broadcast it to other peoples....
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If Someone leaves the chat, Let others know....
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });
});

app.listen(port, ()=>{
    console.log(`The Aplication Started Sccessfully on Port ${port}`);
});