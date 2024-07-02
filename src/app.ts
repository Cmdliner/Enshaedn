import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import userRouter from "./routes/user";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authMiddleware";
import cors, { type CorsOptions } from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import type { Request, Response } from "express";

const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN!,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: ["Authorization"] 
}
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: corsOptions
});
const path = "/api/v1";

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${path}/auth`, authRouter);
app.use(`${path}/rooms`, authMiddleware.requireAuth, roomRouter);
app.use(`${path}/user`, authMiddleware.requireAuth, userRouter);
app.get('/healthz', (_req: Request, res: Response) => res.send("The hood is up Commandliner 🚀 🚀 🚀"));


io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('joinRoom', (roomID: string) => {
      socket.join(roomID);
      console.log(`User joined room: ${roomID}`);
    });
  
    socket.on('sendMessage', ({ roomID }) => {
      io.to(roomID).emit('message');
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  
mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        httpServer.listen(process.env.PORT || 4000, () => {
            console.log('Server listening on port 4000');
        });
    })
    .catch((err) => console.error(err));




export { io };
