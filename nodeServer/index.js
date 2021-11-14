// Node Server Which will Handle io Connections..
const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket =>{
    // If Any New User Joins, Let Other Users Connected to the Server know....
    socket.on('new-user-joined', name =>{
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