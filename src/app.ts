import { createServer } from "http";;
import express from "express";
import { Server } from "socket.io"
import authRouter from "./routes/auth";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();
const server = createServer(app);
const io = new Server(server);
const path = "/api/v1";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${path}/auth`, authRouter);

io.on('connection', (socket) => {
    // socket.on('join', (0));
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