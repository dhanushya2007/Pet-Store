const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    petId:   { type: String },
    name:    String,
    price:   Number,
    qty:     Number,
    imageUrl:String,
  }],
  total:     { type: Number, required: true },
  status:    { type: String, enum: ['processing','shipped','delivered','cancelled'], default: 'processing' },
  sessionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
