import { Mongoose, Schema, model } from "mongoose";

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: {
        type: String,
        enum: ["moderator", "user"]
    },
    messages: {
        type: [Schema.Types.ObjectId],
        ref: "Message"
    }
}, { timestamps: true });

const Room = model('Room', roomSchema);

export default Room;