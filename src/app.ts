import { createServer } from "http";;
import express from "express";
import { Server } from "socket.io"
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authMiddleware";

const app = express();
const server = createServer(app);
const io = new Server(server);
const path = "/api/v1";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${path}/auth`, authRouter);
app.use(`${path}/rooms`, authMiddleware.requireAuth, roomRouter);
app.get('/protected', authMiddleware.requireAuth, (req: any, res: any) => res.status(200).json("Protected by a Shaed!"));

// Chat functionalities not implemented
io.on('connection', (socket) => {
    // socket.on('join', ());
    // socket.on('sendMessage', () => );
    // socket.on('leave', () => {});
    // socket.on('deleteMssg', () => {});
    // socket.emit('Hello, world!')
});

mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        server.listen(4000, () => {
            console.log('Server listening on port 4000');
        });
    })
    .catch((err) => console.error(err));