import { Schema, model } from "mongoose";

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        reqauired: false,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }]
}, { timestamps: true });


const Room = model('Room', roomSchema);

export default Room;