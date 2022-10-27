import express, {Express, Response, Request} from "express";
// const express = require('express');
// import express from "express";
// const userRoutes = require('./routes/userRoutes')
import userRoutes from "./routes/userRoutes";

// const User = require('./models/User');
import {User} from './models/User'
// const Message = require('./models/Message')
import Message from './models/Message'
const rooms: Array<string> = ['general', 'tech', 'finance', 'crypto'];
// const cors = require('cors');
import cors from "cors"
const app: Express = express();

import fs from 'fs';
import path from "path";

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes)
require('./connection')

const server = require('http').createServer(app);
const PORT = process.env.PORT || 5001;
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://letxchat.herokuapp.com/',
    methods: ['GET', 'POST']
  }
})

// const a:string = 1
async function getLastMessagesFromRoom(room: any){
  let roomMessages = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMessages;
}

function sortRoomMessagesByDate(messages: any){
  return messages.sort(function(a: any, b: any){
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1]
    date2 =  date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1
  })
}

// socket connection
io.on('connection', (socket: any)=> {

  socket.on('new-user', async ()=> {
    const members = await User.find();
    io.emit('new-user', members)
  })

  socket.on('join-room', async(newRoom: any, previousRoom: any)=> {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit('room-messages', roomMessages)
  })

  socket.on('message-room', async(room: any, content: any, sender: any, time: any, date: any,file:any,type:any) => {
    const url = await uploadFile(file,type);
    const newMessage = await Message.create({content, from: sender, time, date, to: room,file:url,type});
    console.log(newMessage);
    
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit('room-messages', roomMessages);
    socket.broadcast.emit('notifications', room)
  })

  app.delete('/logout', async(req: Request, res: Response)=> {
    try {
      const {_id, newMessages} = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit('new-user', members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send()
    }
  })

})

if(!fs.existsSync(path.resolve(__dirname,"public","uploads"))) fs.mkdirSync(path.resolve(__dirname,"public","uploads"));
  
async function uploadFile(file:any,type:any) {
  if(type === "text") return null;
  const parts = type.split("/");
  const main_part = Math.random().toString().replace(".","")+"."+parts[1]
  const paths = process.env.DOMAIN+"/uploads/"+main_part;
  fs.writeFileSync(path.resolve(__dirname,"public","uploads",main_part),Buffer.from(file));
  return paths;
}

app.get('/rooms', (req, res)=> {
  res.json(rooms)
})

server.listen(PORT, ()=> {
  console.log('listening to port', PORT)
})

// sharing files to front end
app.get("/uploads/*",(req,res)=>{
  res.sendFile(__dirname+"/public/"+req.url)
});