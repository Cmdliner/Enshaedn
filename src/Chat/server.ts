import { Server, Socket } from "socket.io";

const io = new Server({
    cors: {
        origin: ['http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['set-cookie']
    }
});

io.on('connection', (socket: Socket) => {

})

io.listen(4001);