// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// const {isEmail} = require('validator');
import isEmail from 'validator';
// const bcrypt = require('bcrypt');
import bcrypt from "bcrypt";

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Can't be blank"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    index: true,
    // validate: [isEmail, "invalid email"]
  },
  password: {
    type: String,
    required: [true, "Can't be blank"]
  },
  picture: {
    type: String,
  },
  newMessages: {
    type: Object,
    default: {}
  },
  staffId: {
    type: Number,
    required: [true, "Can't be blank"]
  },
  username: {
    type: String,
    required: [true, "Can't be blank"]
  },
  status: {
    type: String,
    default: 'online'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  rooms: {
    type: Array,
    default: ['General']
  }
}, {minimize: false});

UserSchema.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);

      user.password = hash
      next();
    })

  })

})


UserSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

// export const credentials = UserSchema.statics.findByCredentials = async function(email, password) {
//   const user = await User.findOne({email});
//   if(!user) throw new Error('invalid email or password');

//   const isMatch = await bcrypt.compare(password, user.password);
//   if(!isMatch) throw new Error('invalid email or password')
//   return user
// }


export const User = mongoose.model('User', UserSchema);

// export default User