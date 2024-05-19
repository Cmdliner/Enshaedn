import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);


io.on('connection', (socket: Socket) => {
    console.log('Socket is connected')
    socket.on('joinRoom', () => {
        console.log("Joined Room")
    })

    socket.on('leaveRoom', () => {
        console.log("Somebody left the room")
    })
    
    socket.on('typing', () => {
        socket.to('roomName').emit('typing', 'typing...')
    })
    

})
httpServer.listen(4001, () => console.log("Socket.IO server listening on port 4001"))

