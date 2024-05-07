import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Message = model('Message', messageSchema);

export default Message;