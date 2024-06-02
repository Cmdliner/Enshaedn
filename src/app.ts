import  express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authMiddleware";
import cors, { type CorsOptions } from "cors";

const app = express();
const path = "/api/v1";
const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN!,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/chat', authMiddleware.requireAuth, chatController.handleChatEvents);
app.use(`${path}/auth`, authRouter);
app.use(`${path}/rooms`, authMiddleware.requireAuth, roomRouter);
app.use(`${path}/user`, authMiddleware.requireAuth, )

// io.attach(server, { cors: corsOptions });
// io.on('connection', (_socket) => {
//     console.log('New WebSocket connection')
    
// })



mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        app.listen(4000, () => {
            console.log('Server listening on port 4000');
        });
    })
    .catch((err) => console.error(err));
