const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  petId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  fromUser:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:       { type: String, required: true },
  threadId:   { type: String, required: true }, // sorted combo of fromUser+toUser+petId
  readAt:     { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
