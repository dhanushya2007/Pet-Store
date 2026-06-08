const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true, enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'hamster', 'other'] },
  breed: { type: String, default: 'Mixed' },
  age: { type: Number, required: true },        // in months
  ageUnit: { type: String, default: 'months' },
  gender: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
  price: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  imageUrls: [{ type: String }],
  description: { type: String, default: '' },
  vaccinated: { type: Boolean, default: false },
  neutered: { type: Boolean, default: false },
  location: { type: String, default: '' },
  adoptionType: { type: String, enum: ['adoption', 'sale', 'both'], default: 'adoption' },
  status: { type: String, enum: ['available', 'adopted', 'sold', 'pending'], default: 'available' },
  isApproved: { type: Boolean, default: false },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stars: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
