import type { Response } from "express";
import User from "../models/User";
import type { IAppRequest } from "../interfaces/RequestInterface";
import { Types } from "mongoose";
import Room from "../models/Room";

const ObjectId = Types.ObjectId;

class UserController {
    editProfile = async (req: IAppRequest, res: Response) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ errMssg: "Not enough parameters" });
        }
        try {
            const currentUser = await User.findById(req.user);
            if (currentUser?.username !== username) {
                return res.status(401).json({ errMssg: "Unauthorized! Can not edit this profile!" });
            }
            const user = await User.findOneAndUpdate({ username }, { username, password }, { new: true });
            await user?.save()
            return res.status(200).json({mssg: "Profile Updated"})
        } catch (error) {
            res.status(500).json({ errMssg: error });
        }
    }
    getUser = async (req: IAppRequest, res: Response) => {
        try {
            const userId = req.user;
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(404).json({ error: 'No such user!' });
            }
            return res.status(200).json({ username: user.username })
        }
        catch (error) {
            return res.status(500).json({ errMssg: error })
        }

    }
    getAllUserRooms = async (req: IAppRequest, res: Response) => {

        try {
            const hostRooms = await Room.find({ host: new ObjectId(req.user?._id!) }).select(['_id', 'name']).exec();
            const participantRooms = await Room.find({ participants: new ObjectId(req.user?._id) }).select(['_id', 'name']).exec();
            return res.status(200).json({ rooms: [...hostRooms, ...participantRooms] });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ errMssg: error });
        }
    }
    
}

export default UserController;
