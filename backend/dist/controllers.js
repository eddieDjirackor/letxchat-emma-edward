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
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
// const router =Express.Router();
const User = require('../models/User');
require('dotenv').config();
const nodemailer = require("nodemailer");
const Otp = require('../models/otp');
const bcrypt = require('bcrypt');
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, picture, username, staffId } = req.body;
        console.log(req.body);
        const user = yield User.create({ name, email, password, picture, username, staffId });
        res.status(201).json(user);
    }
    catch (e) {
        let msg;
        if (e.code == 11000) {
            msg = "User already exists";
        }
        else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User.findByCredentials(email, password);
        user.status = 'online';
        yield user.save();
        res.status(200).json(user);
    }
    catch (e) {
        res.status(400).json(e.message);
    }
});
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findByIdAndUpdate(req.params.id, {
            // name: req.body.name, 
            // email: req.body.email, 
            picture: req.body.picture,
            // staffId: req.body.staffId,
            username: req.body.username
        }, { new: true });
        if (!user)
            return res.status(404).send('User with given id not found');
        res.send(user);
    }
    catch (e) {
        res.status(400).json(e.message);
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.password !== req.body.confirmPassword)
            return res.status(400).send('Passwords do not match');
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(req.body.password, salt);
        const user = yield User.findByIdAndUpdate(req.params.id, {
            password: hashedPassword
        }, { new: true });
        if (!user)
            return res.status(404).send('User with given id not found');
        res.send(user);
    }
    catch (e) {
        res.status(400).json(e.message);
    }
});
//   const generateOTP = () => {
//     return Math.floor(Math.random() * 1000000);
//   }
//   var otp;
const getResetLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).send("Email is required to get OTP");
        }
        const user = yield User.findOne({ email });
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
        });
        const mail = {
            from: "LETXCHAT@outlook.com",
            to: email,
            subject: "Letxchat - Password Change Link",
            text: `Please use the link below to reset your password

            http://localhost:3000/reset/${id}`
        };
        mailTransporter.sendMail(mail, (err) => {
            if (err) {
                res.status(400).send("Could not send email");
            }
            else {
                res.status(200).send(user);
            }
        });
    }
    catch (e) {
        res.status(400).json(e.message);
    }
});
module.exports = { userSignup, userLogin, editProfile, resetPassword, getResetLink };
