"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const router = require('express').Router();
const express_1 = require("express");
const router = (0, express_1.Router)();
// const User = require('../models/User');
// import User from '../models/User'
// const bcrypt = require('bcrypt');
// import bcrypt from 'bcrypt'
// const { userSignup, userLogin, editProfile, resetPassword, getResetLink } = require('../controllers/controllers');
const controllers_1 = require("../controllers/controllers");
// creating user
router.post('/', controllers_1.userSignup);
//userLogin
// login user
router.post('/login', controllers_1.userLogin);
//edit user
router.put('/profile/:id', controllers_1.editProfile);
//reset password
router.put('/reset/:id', controllers_1.resetPassword);
//Forgotten Password
router.put('/reset', controllers_1.getResetLink);
//get all users
router.get('/getUsers', controllers_1.getUsers);
//create room
router.post('/createRoom', controllers_1.createRoom);
//delete room
router.delete('/deleteRoom/:id', controllers_1.deleteRoom);
// module.exports = router
exports.default = router;
