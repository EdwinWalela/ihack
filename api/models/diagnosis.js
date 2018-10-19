const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diagnosisSchema = new Schema({
   googleId:String,
   dosage:[String],
   center:String,
   date:Date,
   docId:String
})

const Diagnosis = mongoose.model('users',diagnosisSchema);

module.exports = Diagnosis;