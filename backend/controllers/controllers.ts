import Express, {Response, Request} from "express";
// const router = require('express').Router();
// const router =Express.Router();
// const User = require('../models/User');
import {User} from '../models/User'
import Room from '../models/rooms'
require('dotenv').config();
// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer"
// const Otp = require('../models/otp');
// const bcrypt = require('bcrypt');
import bcrypt from "bcrypt";

export const userSignup = async(req: Request, res: Response)=> {
    try {
      const {name, email, password, picture, username, staffId} = req.body;
      // console.log(req.body);
      const user = await User.create({name, email, password, picture, username, staffId});
      res.status(201).json(user);
    } catch (e: any) {
      let msg;
      if(e.code == 11000){
        msg = "User already exists"
      } else {
        msg = e.message;
      }
      console.log(e);
      res.status(400).json(msg)
    }
  }

export const userLogin = async(req: Request, res: Response)=> {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({email});
  if(!user) throw new Error('invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new Error('invalid email or password')
      user.status = 'online';
      await user.save();
      res.status(200).json(user);
    } catch (e: any) {
        res.status(400).json(e.message)
    }
}

export const editProfile = async(req: Request, res: Response)=> {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { 
        // name: req.body.name, 
        // email: req.body.email, 
        picture: req.body.picture,
        // staffId: req.body.staffId,
        username: req.body.username
      }, { new: true });

      if(!user) return res.status(404).send('User with given id not found');
      res.send(user);
  
    } catch(e: any) {
      res.status(400).json(e.message);
    }
  
  }

  export const getUsers = async(req: Request, res: Response)=> {
    try {
      const user = await User
      .find()
      .sort('name')
      .select('name isAdmin')

      res.send(user);
    }catch(e: any) {
      res.status(400).json(e.message);
    }
  }

  export const createRoom = async(req: Request, res: Response)=> {
    try {
      const {name, description} = req.body;
      // console.log(req.body);
      const room = await Room.create({name, description});
      res.status(201).json(room);
    }catch(e: any) {
      res.status(400).json(e.message);
    }
  }

  export const deleteRoom = async(req: Request, res: Response)=> {
    try {
      const room = await Room.deleteOne({_id: req.params.id});
      // console.log(req.body);
      res.status(200).json(room);
    }catch(e: any) {
      console.log(e.message)
      res.status(400).json(e.message);
    }
  }

  export const addMember = async(req: Request, res: Response)=> {
    try {
      const room = await Room.findById(req.params.id);
      const {name} = req.body
      const user = await User.findOne({name});
      const newMember = User.findByIdAndUpdate(user._id, {
        rooms: user.rooms.push(room.name)
      }, { new: true })



    }catch(e: any) {
      res.status(400).json(e.message);
    }
  }

  export const resetPassword = async(req: Request, res: Response)=> {
    try {
      if(req.body.password !== req.body.confirmPassword) return res.status(400).send('Passwords do not match');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
        const user = await User.findByIdAndUpdate(req.params.id, { 
          password: hashedPassword
        }, { new: true });
    
        if(!user) return res.status(404).send('User with given id not found');
        res.send(user);
    } catch(e: any) {
      res.status(400).json(e.message);
    }
  }

//   const generateOTP = () => {
//     return Math.floor(Math.random() * 1000000);
//   }

//   var otp;

  export const getResetLink = async (req: Request, res: Response) => {
    try{
        const { email } = req.body;
  
        if (!email) {
          res.status(400).send("Email is required to get OTP");
        }
      
        const user = await User.findOne({ email });
      
        if (!user) {
          res.status(400).send("User with this email not found");
        }
        const id = user.id;
        // otp = generateOTP();
    
        const mailTransporter = nodemailer.createTransport({
            service: "outlook",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD
            }
        })
    
        const mail = {
            from: "LETXCHAT@outlook.com",
            to: email,
            subject: "Letxchat - Password Change Link",
            text: `Please use the link below to reset your password

            http://localhost:3000/reset/${id}`
        }
    
        mailTransporter.sendMail(mail, (err) => {
            if(err){
                res.status(400).send("Could not send email");
            }else {
                res.status(200).send(user);
            }
        });    
    }catch(e: any) {
        res.status(400).json(e.message);
    }

}

// module.exports = { userSignup, userLogin, editProfile, resetPassword, getResetLink }