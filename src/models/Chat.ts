import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    messages: {
        type: [Schema.ObjectId],
        ref: 'Chat'
    }
});


const Chat = model("Chat", chatSchema);

export default Chat;