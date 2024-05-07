import { Mongoose, Schema, model } from "mongoose";

const roomSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    participants: {
        type: Schema.Types.Array,
        enum: ["moderator", "user"]
    },
    messages: {
        type: [Schema.Types.ObjectId],
        ref: "Message"
    }
});

const Room = model('Room', roomSchema);

export default Room;