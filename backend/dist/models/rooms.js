"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import bcrypt from "bcrypt";
const RoomSchema = new mongoose_1.default.Schema({
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
});
const Room = mongoose_1.default.model('Room', RoomSchema);
exports.default = Room;
