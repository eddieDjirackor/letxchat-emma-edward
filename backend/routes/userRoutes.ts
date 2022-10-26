// const router = require('express').Router();
import {Router} from "express";
const router = Router();
// const User = require('../models/User');
// import User from '../models/User'
// const bcrypt = require('bcrypt');
// import bcrypt from 'bcrypt'
// const { userSignup, userLogin, editProfile, resetPassword, getResetLink } = require('../controllers/controllers');
import { userSignup, userLogin, editProfile, resetPassword, getResetLink, getUsers, createRoom, deleteRoom } from '../controllers/controllers';

// creating user
router.post('/', userSignup)
//userLogin
// login user
router.post('/login', userLogin);

//edit user
router.put('/profile/:id', editProfile);

//reset password
router.put('/reset/:id', resetPassword);

//Forgotten Password
router.put('/reset', getResetLink);

//get all users
router.get('/getUsers', getUsers);

//create room
router.post('/createRoom', createRoom);

//delete room
router.delete('/deleteRoom/:id', deleteRoom);

// module.exports = router
export default router;
