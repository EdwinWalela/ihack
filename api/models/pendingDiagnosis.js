const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PendingDiagnosisSchema = new Schema({
   googleId:String,
   dosage:[String],
   center:String,
   date:Date,
   docId:String
})

const pendingDiagnosis = mongoose.model('pending_diagnosis',PendingDiagnosisSchema);

module.exports = pendingDiagnosis;