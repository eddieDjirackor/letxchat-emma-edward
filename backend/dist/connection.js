"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.iqtyokk.mongodb.net/letxchat?retryWrites=true&w=majority`, () => {
    console.log('connected to mongodb');
});
// mongoose.connect('mongodb://localhost/chatApp')
// .then(() => {console.log('Connected to MongoDB')})
// .catch(err => {console.error('Could not connect to MongoDB', err)})
