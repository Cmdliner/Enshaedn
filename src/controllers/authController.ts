import type { Request, Response } from "express";
import User from "../models/User";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

interface IUser { email: string, password: string }

const createToken = (payload: Types.ObjectId) => {
    return jwt.sign({ id: payload }, process.env.JWT_SECRET!, { expiresIn: "24h" })
}

class AuthController {
    signUp = async (req: Request, res: Response) => {
        const { email, password }: IUser = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json('Email or password field is required');
            }
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json("User exists!");

            const user = await User.create({ email, password });
            user.password = await hash(password, 10);
            user.save();
            const token = createToken(user._id);
            res.cookie('Authorization', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24 // expires in a day
            });
            return res.status(201).json('User creation successful');
        } catch (error) {
            console.error((error as Error).message)
            res.status(500).json({ err: "Internal Server error" })
        }

    }

    signIn = async (req: Request, res: Response) => {
        const { email, password }: IUser = req.body;
        const user = await User.findOne({ email });

        const authToken = req.cookies?.['Authorization'];
        if (authToken) return res.status(400).json("Already signed in");
        if (!user) {
            return res.status(404).json("Invalid email or password!");
        }
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json("Invalid email or password!");
        }
        const token = createToken(user._id);
        res.cookie('Authorization', token, { httpOnly: true, sameSite: 'lax',  maxAge: 1000 * 60 * 60 * 24 })
        return res.status(200).json("Login successful");
    }

    logout = async (_: Request, res: Response) => {
        res.clearCookie('Authorization');
        return res.status(200).json("Logged out!");

    }
}


export default AuthController;
