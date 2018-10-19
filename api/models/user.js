const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:String,
    googleId:String,
    firstName:String,
    lastName:String,
    gender:String,
    weight:Number,
    height:Number,
    bloodGroup:String,
    thumbnail:String
})

const User = mongoose.model('users',userSchema);

module.exports = User;