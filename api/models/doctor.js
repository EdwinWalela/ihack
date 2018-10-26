const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docSchema = new Schema({
    surname:String,
    email:String,
    docID:String
})

const Doctor = mongoose.model('doctors',docSchema);

module.exports = Doctor;