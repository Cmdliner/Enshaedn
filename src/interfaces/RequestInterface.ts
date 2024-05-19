import type { Request } from "express";
import type { Types } from "mongoose";

export interface IAppRequest extends Request{
    user?: Types.ObjectId,
}