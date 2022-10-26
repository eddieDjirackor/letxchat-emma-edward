// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const MessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  socketid: String,
  time: String,
  date: String,
  to: String,
  file:String,
  type:String
})

const Message = mongoose.model('Message', MessageSchema);

export default Message;
