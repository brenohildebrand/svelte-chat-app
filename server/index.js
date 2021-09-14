const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Database
const database = {}

// Colors
const colors = ['yellow', 'orange', 'blue', 'green', 'purple', 'pink', 'cyan', 'navy', 'burlywood', 'aquamarine'];

// Express should also look for files at ${dirname}/../dist/
app.use(express.static('/mnt/c/Users/55679/Projects/svelte-chat-app/app/dist/'))

// Default GET
app.get('/', (req, res) => {
    res.sendFile('/app/dist/index.html', { root: '/mnt/c/Users/55679/Projects/svelte-chat-app/' })
})

// Socket
io.on('connection', (socket) => {
    console.log('[SERVER] New connection!');

    socket.on('chat-nickname', (nickname) => {
        // Store New User
        database[socket.id] = {
            nickname,
            messages: [],
            color: colors[Math.round(Math.random() * colors.length)],
        }

        // Return Success
        socket.emit('chat-nickname');
        console.log(`[SERVER] ${nickname} was registered successfully!.`)
    })

    socket.on('chat-message', ( msg ) => {
        // Save the message
        database[socket.id].messages.push(msg);

        // Send the message to everyone
        io.emit('chat-message', {
            nickname: database[socket.id].nickname,
            message: msg,
            color: database[socket.id].color,
        });
        console.log(`[SERVER] Sending message from ${database[socket.id].nickname} to everyone!`)
    });

    socket.on('disconnect', () => {
        console.log(`[SERVER] ${database[socket.id]?.nickname} disconnected.`)
    }) 
});

// Listen
server.listen(3000, () => {
    console.log('listening on *:3000')
});
