const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    password:String,
    email:String,
    firstName:String,
    lastName:String,
    gender:String,
    weight:Number,
    height:Number,
    bloodGroup:String
})

const User = mongoose.model('users',userSchema);

module.exports = User;