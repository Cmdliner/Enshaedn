import { io } from "../app";
import Room from "../models/Room";

io.on('connection', (socket) => {
    // Join Room
    socket.on('joinRoom', async ({ roomID, userID }) => {
        try {
            const room = await Room.findById(roomID);
            if (!room) {
                socket.emit('error', 'Room not found');
                return;
            }
            socket.join(roomID);
            io.to(roomID).emit('userJoined', { userID });
            console.log(`User ${userID} joined room ${roomID}`);
        } catch (error) {
            console.error(error);
            socket.emit('error', 'Internal Server error');
        }
    });

    // Leave room
    socket.on('leaveRoom', ({ roomID, userID }) => {
        socket.leave(roomID);
        io.to(roomID).emit('userLeft', { userID });
        console.log(`User ${userID} left room ${roomID}`);
    });

})