const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    password:String,
    email:String,
    mobile:String,
    nationalID:String,
    insuarance:String,
    firstName:String,
    lastName:String,
    gender:String,
    weight:Number,
    height:Number
})

const User = mongoose.model('users',userSchema);

module.exports = User;