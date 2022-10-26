"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
// const bcrypt = require('bcrypt');
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.UserSchema = new mongoose_1.default.Schema({
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
}, { minimize: false });
exports.UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt_1.default.genSalt(10, function (err, salt) {
        if (err)
            return next(err);
        bcrypt_1.default.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});
exports.UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
// export const credentials = UserSchema.statics.findByCredentials = async function(email, password) {
//   const user = await User.findOne({email});
//   if(!user) throw new Error('invalid email or password');
//   const isMatch = await bcrypt.compare(password, user.password);
//   if(!isMatch) throw new Error('invalid email or password')
//   return user
// }
exports.User = mongoose_1.default.model('User', exports.UserSchema);
// export default User
