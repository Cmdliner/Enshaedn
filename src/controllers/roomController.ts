import type { Response } from "express";
import Room from "../models/Room";
import type { IAppRequest } from "../interfaces/RequestInterface";
import { isValidObjectId, Types } from "mongoose";
import Message from "../models/Message";

interface RoomInit {
    kind: string;
    name: string;
    host: Types.ObjectId | undefined;
    description?: string;
}
class RoomController {
    createRoom = async (req: IAppRequest, res: Response) => {
        const { name, description, kind } = req.body;


        const host = req.user?._id;
        let roomInitOpts: Partial<RoomInit> = { name, host };
        if(description) roomInitOpts.description = description;
        if(kind) roomInitOpts.kind = kind;
        if (!name) {
            return res.status(400).json("Room needs a name!")
        }
        try {
            const room = await Room.create(roomInitOpts);
            await room.save();
            return res.status(201).json({
                mssg: "Room created successfully!", 
                username: req.user?.username, room_name: room.name, 
                join_id: room.join_id, id: room._id 
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ errMssg: "Internal server error!" });
        }

    }

    joinRoom = async (req: IAppRequest, res: Response) => {
        const { joinID } = req.params;
        try {

            const room = await Room.findOne({ join_id: joinID });
            if (!room) {
                return res.status(404).json({ errMssg: "Room not found!" })
            }

            const isParticipant = room.participants?.find(member => member.toString() === req.user?._id.toString()) || room.host.toString() === req.user?._id.toString();
            if(isParticipant) return res.status(400).json({errMssg: "Already a room participant!"});
            room?.participants?.push(req.user?._id!);
            room.save();
            return res.status(200).json({ mssg: "Room joined Successfully!", username: req.user?.username, room_id: room._id })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ errMssg: "Internal server error!" });
        }
    }

    leaveRoom = async (req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        try {
            if (!isValidObjectId(roomID)) {
                return res.status(400).json({ errMssg: "Invalid Room ID!" })
            }
            const room = await Room.findById(roomID);
            if (!room) {
                return res.status(404).json({ errMssg: "Room not found!" })
            }
            if (room.host.toString() === req.user?._id.toString()) {
                return res.status(400).json({ errMssg: "Host cannot leave room, only delete!" });
            }
            room.participants = room.participants.filter((participant) => participant.toString() !== req.user?._id.toString());
            room.save();
            return res.status(200).json({ mssg: "Left room Successfully!", username: req.user?.username })
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
            return res.status(200).json({mssg: "Room deleted!"});

        } catch (error) {
            return res.status(500).json({errMssg: "Internal server error!"});
        }
    }

    sendMssg = async (req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        const { content } = req.body;
        const room = await Room.findById(roomID);
        if (!room) {
            return res.status(404).json({ errMssg: "Room not found!" })
        }
        const message = await Message.create({ sender: req.user?._id, text: content });
        room.messages.push(message._id);
        await room.save();
        await message.save();
        return res.status(200).json({ mssg: "Message saved correctly!" });

    }

    deleteMssg = async (req: IAppRequest, res: Response) => {
        const { roomID, messageID } = req.params;
        if (!messageID) return res.status(400).json({ errMssg: "Invalid Chat ID!" });
        try {
            const room = await Room.findByIdAndUpdate(roomID, {
                $pull: { messages: messageID }
            }, { new: true });
            if (!room) return res.status(404).json({ errMssg: "Room not found" });
            const message = await Message.findByIdAndDelete(messageID);
            if (!message) return res.status(404).json({ errMssg: "Message not found!" })

            return res.status(200).json({ mssg: `Deleted chat ${messageID} successfully` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errMssg: "Internal Server error!" });
        }

    }

    getRoomMessages = async (req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        try {
            const room = await Room.findById(roomID);
            if (!room) {
                return res.status(400).json({ errMssg: "No such room" });
            }
            const roomObj = await Room.findById(roomID).populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'username'
                }
            }).select(['messages', 'name', 'host', 'description']).exec();
            return res.status(200).json({room_name: roomObj?.name, host: roomObj?.host, description: roomObj?.description, currentUser: req.user?.username, messages: roomObj?.messages });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errMssg: "Internal server error" });
        }

    }
    
    getRoomInfo = async (req: IAppRequest, res: Response) => {
        const { roomID } = req.params;
        try {
            const room = await Room.findById(roomID).populate(['host', 'participants']);
            
            if (!room) {
                return res.status(404).json({ errMssg: "Room not found" });
            }
            return res.status(200).json({
                host: (room.host as any).username, 
                participants: room.participants.map((participant: any) => participant.username),
                name: room.name, description: room.description,
                createdAt: room.createdAt
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errMssg: "Internal server error!" })
        }
    }
    
    getJoinRoomInfo = async (req: IAppRequest, res: Response) => {
        const { joinID } = req.params;
        try {
            const room = await Room.findOne({join_id: joinID}).populate(['host', 'participants']);
            
            if (!room) {
                return res.status(404).json({ errMssg: "Room not found" });
            }
            return res.status(200).json({
                host: (room.host as any).username, 
                participants: room.participants.map((participant: any) => participant.username),
                name: room.name, description: room.description,
                createdAt: room.createdAt,
                join_id: room.join_id,
                room_id: room._id
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errMssg: "Internal server error!" })
        }
    }

    queryRoomsOrGetAll = async(req: IAppRequest, res: Response) => {
        const { name } = req.query;
        try{
            if(name && name.toString().trim()) {
                const rooms = await Room.find({name: new RegExp(`${name}`, 'i')}).populate('host').exec();
                return res.status(200).json({rooms});
            }
            const rooms = await Room.find().populate('host').exec();
            return res.status(200).json({rooms});
        }
        catch(error) {
            console.error(error);
            return res.status(500).json("Internal Server Error!");
        }
    }
}

export default RoomController;
