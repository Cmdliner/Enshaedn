import type { Request, Response } from "express";
import User from "../models/User";
import type { IAppRequest } from "../interfaces/RequestInterface";

class UserController {
    editProfile = async (req: IAppRequest, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json("Not enough parameters");
        }
        try {
            const currentUser = await User.findById(req.user);
            if(currentUser?.email !== email) {
                return res.status(401).json({error: "Can not edit this profile!"});
            }
            const user = await User.findOneAndUpdate({ email }, { email, password }, { new: true });
            await user?.save()
            return res.status(200).json("Profile Updated")
        } catch (error) {

        }
    }
    getUser = async(req: IAppRequest, res: Response) => {
        try{
            const userId = req.user;
            const user = await User.findOne({_id: userId});
            if(!user) {
                return res.status(404).json({error: 'No such user!'});
            }
            return res.status(200).json({username: user.email})
        }
        catch(error) {

        }
        
    }
}

export default UserController;