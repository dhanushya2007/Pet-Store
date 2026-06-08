const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  petId:    { type: String, required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true, default: 1 },
  sessionId:{ type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
