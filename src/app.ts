import { createServer } from "http";;
import express from "express";
import { Server, Socket } from "socket.io"
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authMiddleware";
import cors, { type CorsOptions } from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server);
const path = "/api/v1";
const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN!,
    credentials: true,
    methods: ['GET', 'POST']
}


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/chat', authMiddleware.requireAuth, chatController.handleChatEvents);
app.use(`${path}/auth`, authRouter);
app.use(`${path}/rooms`, authMiddleware.requireAuth, roomRouter);
app.get('/protected', authMiddleware.requireAuth, (req: any, res: any) => res.status(200).json("Protected by a Shaed!"));

io.attach(server, { cors: corsOptions });
io.on('connection', (socket: Socket) => {
    console.log('\nNew one ');
    console.log(`Socket Connected => ${socket.id} \n`);
})


mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        server.listen(4000, () => {
            console.log('Server listening on port 4000');
        });
    })
    .catch((err) => console.error(err));
