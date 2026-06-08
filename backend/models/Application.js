const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  applicantName:  { type: String, required: true },
  petName:        { type: String, required: true },
  contactNumber:  { type: String, required: true },
  location:       { type: String, required: true },
  reason:         { type: String, required: true },
  petId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', default: null },
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sellerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status:         { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  sellerNote:     { type: String, default: '' },
  submittedAt:    { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
