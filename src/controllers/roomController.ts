import type { Response } from "express";
import Room from "../models/Room";
import type { IAppRequest } from "../interfaces/RequestInterface";
import { isValidObjectId, type ObjectId } from "mongoose";
import Message from "../models/Message";

class RoomController {
    createRoom = async (req: IAppRequest, res: Response) => {
        const { name } = req.body;
        const host = req.user?._id;
        if (!name) {
            return res.status(400).json("Room needs a name!")
        }

        try {
            const room = await Room.create({ name, host });
            await room.save();
            return res.status(201).json("Room created successfully!");
        } catch (err) {
            console.error(err);
            return res.status(500).json({ errMssg: "Internal server error!" });
        }

    }
    joinRoom = async (req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        try {
            if (!isValidObjectId(roomID)) {
                return res.status(400).json({ errMssg: "Invalid room ID!" });
            }
            const room = await Room.findById(roomID);
            if (!room) {
                return res.status(404).json({ errMssg: "Room not found!" })
            }
            room?.participants?.push(req.user?._id!);
            room.save();
            return res.status(200).json({ mssg: "Room joined Successfully!" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ errMssg: "Internal server error!" });
        }
    }
    leaveRoom = async (req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        try {
            if (!req.user) {
                return res.status(200).json({ errMssg: "No authenticated user" })
            }
            const room = await Room.findById(roomID);
            if (!room) {
                return res.status(404).json({ errMssg: "Room not found!" })
            }
            room.participants = room.participants.filter((participant) => participant.toString() !== req.user?._id.toString());
            room.save();
            return res.status(200).json({ mssg: "Left room Successfully!" })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ errMssg: "Internal server error!" })
        }
    }
    deleteRoom = async (req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        try {
            const room = await Room.findOne({ _id: roomID });
            await Room.findOneAndDelete({ host: room?.host });
            return res.status(200).json("Room deleted!");

        } catch (error) {
            return res.status(500).json("Internal server error!");
        }
    }
    sendMssg = async (req: IAppRequest, res: Response) => {
        const sender = req.user?._id;
        const { roomID } = req.params;
        const { content } = req.body;
        const room = await Room.findById(roomID);
        if(!room) {
            return res.status(404).json({errMssg: "Room not found!"})
        }
        const message = new Message({sender: req.user?._id, text: content});
        room.messages.push(message._id);
        await room.save();
        await message.save();
        return res.status(200).json({mssg: "Message saved correctly"});

    }
    getRoomMessages =  async(req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        try {
            const room = await Room.findById(roomID);
            if (!room) {
                return res.status(400).json({ errMssg: "No such room" });
            }
            const roomObj = await Room.findById(roomID).populate('messages').select('messages').exec();
            return res.status(200).json({ messages: roomObj?.messages });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errMssg: "Internal server error" });
        }

    }
}

export default RoomController;