"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const express = require('express');
// import express from "express";
// const userRoutes = require('./routes/userRoutes')
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// const User = require('./models/User');
const User_1 = require("./models/User");
// const Message = require('./models/Message')
const Message_1 = __importDefault(require("./models/Message"));
const rooms = ['general', 'tech', 'finance', 'crypto'];
// const cors = require('cors');
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/users', userRoutes_1.default);
require('./connection');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5001;
const io = require('socket.io')(server, {
    cors: {
        origin: 'https://letxchat--back-end.herokuapp.com/',
        methods: ['GET', 'POST']
    }
});
// const a:string = 1
function getLastMessagesFromRoom(room) {
    return __awaiter(this, void 0, void 0, function* () {
        let roomMessages = yield Message_1.default.aggregate([
            { $match: { to: room } },
            { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } }
        ]);
        return roomMessages;
    });
}
function sortRoomMessagesByDate(messages) {
    return messages.sort(function (a, b) {
        let date1 = a._id.split('/');
        let date2 = b._id.split('/');
        date1 = date1[2] + date1[0] + date1[1];
        date2 = date2[2] + date2[0] + date2[1];
        return date1 < date2 ? -1 : 1;
    });
}
// socket connection
io.on('connection', (socket) => {
    socket.on('new-user', () => __awaiter(void 0, void 0, void 0, function* () {
        const members = yield User_1.User.find();
        io.emit('new-user', members);
    }));
    socket.on('join-room', (newRoom, previousRoom) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMessages = yield getLastMessagesFromRoom(newRoom);
        roomMessages = sortRoomMessagesByDate(roomMessages);
        socket.emit('room-messages', roomMessages);
    }));
    socket.on('message-room', (room, content, sender, time, date, file, type) => __awaiter(void 0, void 0, void 0, function* () {
        const url = yield uploadFile(file, type);
        const newMessage = yield Message_1.default.create({ content, from: sender, time, date, to: room, file: url, type });
        console.log(newMessage);
        let roomMessages = yield getLastMessagesFromRoom(room);
        roomMessages = sortRoomMessagesByDate(roomMessages);
        // sending message to room
        io.to(room).emit('room-messages', roomMessages);
        socket.broadcast.emit('notifications', room);
    }));
    app.delete('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id, newMessages } = req.body;
            const user = yield User_1.User.findById(_id);
            user.status = "offline";
            user.newMessages = newMessages;
            yield user.save();
            const members = yield User_1.User.find();
            socket.broadcast.emit('new-user', members);
            res.status(200).send();
        }
        catch (e) {
            console.log(e);
            res.status(400).send();
        }
    }));
});
if (!fs_1.default.existsSync(path_1.default.resolve(__dirname, "public", "uploads")))
    fs_1.default.mkdirSync(path_1.default.resolve(__dirname, "public", "uploads"));
function uploadFile(file, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (type === "text")
            return null;
        const parts = type.split("/");
        const main_part = Math.random().toString().replace(".", "") + "." + parts[1];
        const paths = process.env.DOMAIN + "/uploads/" + main_part;
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, "public", "uploads", main_part), Buffer.from(file));
        return paths;
    });
}
app.get('/rooms', (req, res) => {
    res.json(rooms);
});
server.listen(PORT, () => {
    console.log('listening to port', PORT);
});
// sharing files to front end
app.get("/uploads/*", (req, res) => {
    res.sendFile(__dirname + "/public/" + req.url);
});
