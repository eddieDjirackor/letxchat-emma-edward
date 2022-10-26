import mongoose from 'mongoose';
// import bcrypt from "bcrypt";

const RoomSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Can't be blank"]
    },
    members: {
        type: Array
    },
    description: {
        type: String,
      required: [true, "Can't be blank"]
    }
})

const Room = mongoose.model('Room', RoomSchema);

export default Room