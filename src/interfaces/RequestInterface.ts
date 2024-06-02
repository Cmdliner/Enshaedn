import type { Request } from "express";
import type { Document, Types } from "mongoose";


export interface IAppRequest extends Request {
    user?: (Document<unknown, {}, {
        username: string;
        password: string;
    }> & {
        username: string;
        password: string;
    } & {
        _id: Types.ObjectId;
    });
}



// Document<unknown, {}, {
//     username: string;
//     password: string;
// }> & {
//     username: string;
//     password: string;
// } & {
//     _id: Types.ObjectId;
// }