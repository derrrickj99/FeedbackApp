const userSchema = require("./schemas/userSchema");
const mongoose = require("mongoose");

const User = mongoose.model('User', userSchema);

module.exports = User;