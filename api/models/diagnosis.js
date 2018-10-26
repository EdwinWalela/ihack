const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diagnosisSchema = new Schema({
   userID:String,
   diagnosis:String,
   symptoms:String,
   dosage:String,
   center:String,
   date:Date,
   docID:String,
   confirmed:Boolean
})

const Diagnosis = mongoose.model('diagnosis',diagnosisSchema);

module.exports = Diagnosis;