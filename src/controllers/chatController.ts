import type { Request, Response } from "express";
import Chat from "../models/Chat";

class ChatController {
    saveChat = async (req: Request, res: Response) => {
        const chat = req.headers?.["encryptedBody"];
        try {
            if (chat) {
                // !Todo (Decrypt chat into an array of messages)
                const decryptedMssgs = [
                    { sender: (chat as any)?.sender, text: "Some text", _id: (req as any).user?._id},
                    { sender: (chat as any)?.sender, text: "Another text", _id: (req as any).user?._id},
                    { sender: (chat as any)?.sender, text: "A completel different text", _id: (req as any).user?._id }
                ]
                // Add newly decrypted messages to collection
                // const newChat = await Chat.createCollection(...decryptedMssgs)
                // await newChat.save()
                return res.status(200).json("Chat saved!")
            }
            return res.status(404).json("No content!")
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mssg: "Internal server error" })
        }
    }
}

export default ChatController;