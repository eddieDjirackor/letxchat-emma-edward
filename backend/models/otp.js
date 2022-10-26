const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  otpToken: Number,
  userEmail: String
})

const Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp