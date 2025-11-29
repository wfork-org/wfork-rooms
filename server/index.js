const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this prototype
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Store room users: { roomId: [socketId, ...] }
const rooms = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].push(socket.id);
        } else {
            rooms[roomId] = [socket.id];
        }

        // Join the socket to the room
        socket.join(roomId);

        // Notify other users in the room that a new user has joined
        // We send the socketId of the new user so others can initiate connection
        const otherUsers = rooms[roomId].filter(id => id !== socket.id);
        socket.emit('all-users', otherUsers);
    });

    socket.on('sending-signal', (payload) => {
        io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returning-signal', (payload) => {
        io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('send-signal', (payload) => {
        io.to(payload.to).emit('signal', { from: socket.id, signal: payload.signal });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove user from rooms
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            } else {
                // Notify others in the room
                io.to(roomId).emit('user-left', socket.id);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
