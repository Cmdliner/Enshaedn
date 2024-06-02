import type { IAppRequest } from "../interfaces/RequestInterface";
import type { NextFunction, Response } from "express";
import Room from "../models/Room";
import User from "../models/User";

const roomMiddleware = {
    isHost: async (req: IAppRequest, res: Response, next: NextFunction) => {
        const { roomID } = req.params;
        const user = req.user!;
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

        try {
            if (!userId) return res.status(400).json({ errMssg: "Auth required!" });
            if (!roomID) res.status(400).json({ errMssg: "Room not specified" });

            const room = await Room.findById(roomID);
            const user = await User.findById(userId);

            if (!room) return res.status(404).json({ errMssg: "Cannot find that room" });
            if (!user) return res.status(404).json({ errMssg: "User not found!" });
            const userInRoom = room.participants.includes(userId);
            if (!userInRoom) return res.status(401).json({ errMssg: `${req.user?.username} is not a participant of this room`});
            next();
        } catch (error) {
            console.error(error)
            return res.status(500).json({ errMssg: "Internal server error!" })
        }
    }
}

export default roomMiddleware;