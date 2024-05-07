import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/User";

const authMiddleware = {
    requireAuth: async (req: Request, res: Response, next: NextFunction) => {
        const authToken = req.cookies?.['Authorization'];
        if (!authToken) {
            return res.status(401).json('Unauthorized!');
        }

        try {
            const decodedToken = verify(authToken, process.env.JWT_SECRET!);
            const { id } = decodedToken as any;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json("User does not exist!");
            }
            (req as any).user = user;
            next();
        } catch (err) {
            return res.status(401).json({ "mssg": "Error in decoding", "err": (err as Error).message })
        }
    }
}

export default authMiddleware;