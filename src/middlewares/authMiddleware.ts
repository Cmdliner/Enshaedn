import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/User";
import type { Types } from "mongoose";
import type { IAppRequest } from "../interfaces/RequestInterface";

const authMiddleware = {
    requireAuth: async (req: IAppRequest, res: Response, next: NextFunction) => {
        const authToken = req.headers?.authorization?.split(' ')?.[1];
        if (!authToken) {
            return res.status(401).json({errMssg: 'Unauthorized!'});
        }

        try {
            const decodedToken = verify(authToken, process.env.JWT_SECRET!);
            const { id } = decodedToken as any as Types.ObjectId;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({errMssg: "User does not exist!"});
            }
            req.user = user;
            next();
        } catch (err) {
	    console.error(err);
	    if((err as Error).message === "jwt expired") {
		return res.status(401).json({"errMssg": "Login session expired :("})
	    }
            return res.status(401).json({ "errMssg": "Error in decoding", "err": (err as Error).message })
        }
    }
}

export default authMiddleware;
