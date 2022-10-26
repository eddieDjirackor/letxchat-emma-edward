// const mongoose = require('mongoose');
import mongoose from 'mongoose';

require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.iqtyokk.mongodb.net/letxchat?retryWrites=true&w=majority`, ()=> {
  console.log('connected to mongodb')
})

// mongoose.connect('mongodb://localhost/chatApp')
// .then(() => {console.log('Connected to MongoDB')})
// .catch(err => {console.error('Could not connect to MongoDB', err)})