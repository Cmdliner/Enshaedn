import type { Request, Response } from "express";
import Room from "../models/Room";
import type { IAppRequest } from "../interfaces/AppRequest";

class RoomController {
    createRoom = async (req: IAppRequest, res: Response) => {
        const { name } = req.body;
        const host = req.user;
        if (!name) {
            return res.status(400).json("Room needs a name!")
        }

        try {
            const room = await Room.create({ name, host });
            await room.save();
            return res.status(201).json("Room created successfully!");
        } catch (err) {
            console.error(err);
            return res.status(500).json("Internal server error!");
        }

    }
    deleteRoom = async (req: Request, res: Response) => {
        const { _id } = req.params;
        try {
            const room = await Room.findOne({ _id });
            if (!room) {
                return res.status(404).json("Room not found");
            }
            const canDelete = room.host.toString() === (req as any).user._id.toString();
            if (!canDelete) {
                return res.status(401).json("Unauthorized! can't delete room");
            }
            await Room.findOneAndDelete({ host: room.host });
            return res.status(200).json("Room deleted!");

        } catch (error) {
            return res.status(500).json("Internal server error!");
        }
    }
}

export default RoomController;