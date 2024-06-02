import type { Request, Response } from "express";
import User from "../models/User";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

interface IUser { username: string, password: string }

const createToken = (payload: Types.ObjectId) => {
    return jwt.sign({ id: payload }, process.env.JWT_SECRET!, { expiresIn: "24h" })
}

class AuthController {
    signUp = async (req: Request, res: Response) => {
        const { username, password }: IUser = req.body;

        try {
            if (!username || !password) {
                return res.status(400).json({errorMssg: "Username or password field is required"});
            }
            const userExists = await User.findOne({ username });
            if (userExists) return res.status(400).json({errorMssg: "Username taken!"});

            const user = await User.create({ username, password });
            user.password = await hash(password, 10);
            user.save();
            const token = createToken(user._id);
            res.cookie('Authorization', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24 // expires in a day
            });
            return res.status(201).json({mssg: "User creation successful"});
        } catch (error) {
            console.error((error as Error))
            res.status(500).json({ errorMssg: "Internal Server error!" })
        }

    }

    signIn = async (req: Request, res: Response) => {
        const { username, password }: IUser = req.body;
        const user = await User.findOne({ username });

        const authToken = req.cookies?.['Authorization'];
        if (authToken) return res.status(400).json({ errorMssg: "Already signed in" });
        if (!user) {
            return res.status(404).json({ errorMssg: "Invalid username or password!" });
        }
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({errorMssg: "Invalid username or password!"});
        }
        const token = createToken(user._id);
        res.cookie('Authorization', token, { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 })
        return res.status(200).json({mssg: "Login successful"});
    }

    logout = async (req: Request, res: Response) => {
        if(!req.cookies?.['Authorization']) { return res.status(401).json({errMssg: 'Redirect to Sign-In'})};
        res.clearCookie('Authorization');
        return res.status(200).json({mssg: "Logged out!"});

    }
}


export default AuthController;
