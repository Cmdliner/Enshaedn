import { Schema, model } from "mongoose";


const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    kind: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
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
    }],
    join_id: {
        type: String,
        required: true
    }
}, { timestamps: true });


const Room = model('Room', roomSchema);

export default Room;