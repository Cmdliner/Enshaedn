import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    }
})

const Message = model('Message', messageSchema);

export default Message;