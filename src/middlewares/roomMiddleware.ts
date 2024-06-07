import type { IAppRequest } from "../interfaces/RequestInterface";
import type { NextFunction, Response } from "express";
import Room from "../models/Room";
import User from "../models/User";
import { isValidObjectId } from "mongoose";
import Message from "../models/Message";

const roomMiddleware = {
    isHost: async (req: IAppRequest, res: Response, next: NextFunction) => {
        const { roomID } = req.params;
        const user = req.user!;
        if (!isValidObjectId(roomID)) return res.status(400).json({ erMssg: "Room not found!" });
        try {
            const room = await Room.findById(roomID);
            const isHost = room?.host.toString() === user?._id.toString();
            if (!isHost) {
                return res.status(200).json({ errMssg: "Unauthorized! Only host is permitted that action" });
            }
            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json("Internal Server error!")
        }
    },
    isMember: async (req: IAppRequest, res: Response, next: NextFunction) => {
        const { roomID } = req.params;
        const userId = req.user?._id;
        if (!isValidObjectId(roomID)) return res.status(400).json({ errMssg: "Room not found" });
        try {

            if (!userId) return res.status(400).json({ errMssg: "Auth required!" });
            if (!roomID) res.status(400).json({ errMssg: "Room not specified" });

            const room = await Room.findById(roomID);
            const user = await User.findById(userId);

            if (!room) return res.status(404).json({ errMssg: "Cannot find that room" });
            if (!user) return res.status(404).json({ errMssg: "User not found!" });
            const isParticipant = room.participants.includes(userId);
            const isRoomHost = room.host.toString() === userId.toString();
            if (!(isParticipant || isRoomHost)) return res.status(401).json({ errMssg: `${req.user?.username} is not a room participant` });
            next();
        } catch (error) {
            console.error(error)
            return res.status(500).json({ errMssg: "Internal server error!" })
        }
    },
    isHostOrSender: async (req: IAppRequest, res: Response, next: NextFunction) => {
        const { roomID, messageID } = req.params;

        try {
            const room = await Room.findById(roomID);
            if (!room) return res.status(404).json({ errMssg: "Room not found" });

            const message = await Message.findById(messageID);
            if (!message) return res.status(404).json({ errMssg: "Message not found" });
            const isSender = req.user?._id.toString() === message.sender.toString();
            const isHost = req.user?._id.toString() === room.host.toString();
            if (isSender || isHost) {
                next();
            }
            return res.status(403).json({ errMssg: "Forbidden" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errMssg: "Internal" })
        }
    }
}

export default roomMiddleware;