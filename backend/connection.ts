// const mongoose = require('mongoose');
import mongoose from 'mongoose';

require('dotenv').config();

mongoose.connect(`mongodb+srv://letxchat:auQFt4ymnh3DsnSe@cluster0.iqtyokk.mongodb.net/letxchat?retryWrites=true&w=majority`, (v)=> {
  console.log('connected to mongodb', v)
})

// mongoose.connect('mongodb://localhost/chatApp')
// .then(() => {console.log('Connected to MongoDB')})
// .catch(err => {console.error('Could not connect to MongoDB', err)})