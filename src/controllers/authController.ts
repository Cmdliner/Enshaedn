import type { Request, Response } from "express";
import User from "../models/User";
import { compare, hash } from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import type { Types } from "mongoose";
import type { IAppRequest } from "../interfaces/RequestInterface";

interface IUser { username: string, password: string }
const jwtExpires = 60 * 60 * 24 * 14;
const createToken = (payload: Types.ObjectId) => {
    return jwt.sign({ id: payload }, process.env.JWT_SECRET, { expiresIn: jwtExpires })
}

class AuthController {
    signUp = async (req: Request, res: Response) => {
        const { username, password }: IUser = req.body;


        try {
            if (!username || !password) {
                return res.status(400).json({ errMssg: `${!username ? 'username': 'password'} field is required` });
            }
            const userExists = await User.findOne({ username });
            if (userExists) return res.status(400).json({ errMssg: "Username taken!" });

            const user = await User.create({ username, password });
            user.password = await hash(password, 10);
            user.save();
            const token = createToken(user._id);
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.status(201).json({ mssg: "User creation successful" });
        } catch (error) {
            console.error((error as Error))
            res.status(500).json({ errMssg: "Error registering user!" })
        }

    }

    signIn = async (req: Request, res: Response) => {
        const { username, password }: IUser = req.body;

        const user = await User.findOne({ username });

        const authToken = req.headers.authorization?.toString().split(' ')[1];
        if (authToken) return res.status(400).json({ errMssg: "Already signed in" });
        if (!user) {
            return res.status(404).json({ errMssg: "Invalid username or password!" });
        }
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ errMssg: "Invalid username or password!" });
        }
        const token = createToken(user._id);
        res.setHeader('Authorization', `Bearer ${token}`);
        
        /* 
            jwtExpires is conmverted into milliseconds -> (jwtExpires * 1000)
            This is added to the current date converted into numbers -> new Date.valueOf() + (1000 * jwt expires)
            The entire expression returns a unix timestamp of the expiry date of the jwt token
         */
        const authExpiry = (new Date().valueOf() + (1000 * jwtExpires));
        return res.status(200).json({ mssg: "Login successful", exp:  authExpiry});
    }


    getAuthState = async (req: IAppRequest, res: Response) => {
        const authToken = req.headers.authorization?.toString().split(' ')[1];
        if (!authToken) return res.status(401).json({ authenticated: false});
        try {
            const decodedToken = verify(authToken, process.env.JWT_SECRET);
            const { id } = decodedToken as any as Types.ObjectId;
            const user = await User.findById(id);
            if (!user) return res.status(400).json({ authenticated: false });
            return res.status(200).json({ authenticated: true });
        } catch(error) {console.error((error as Error).message);
            return res.status(500).json({errMssg: "Internal Server Error!"});
        }
    }

}


export default AuthController;
