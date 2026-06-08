const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect, seller, admin } = require('../middleware/auth');

// GET /api/pets — list with filters
router.get('/', async (req, res) => {
  try {
    const { species, breed, gender, minAge, maxAge, minPrice, maxPrice, adoptionType, status, search, sellerId } = req.query;
    const query = { isApproved: true, status: status || 'available' };

    if (species)      query.species = species;
    if (gender)       query.gender = gender;
    if (adoptionType) query.adoptionType = adoptionType;
    if (breed)        query.breed = { $regex: breed, $options: 'i' };
    if (sellerId)     query.seller = sellerId;
    if (search)       query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { breed: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pets = await Pet.find(query).sort({ createdAt: -1 }).populate('seller', 'name email shopName avatar');
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pets.' });
  }
});

// GET /api/pets/all — admin: all pets including unapproved
router.get('/all', protect, admin, async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 }).populate('seller', 'name email shopName');
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pets.' });
  }
});

// GET /api/pets/my — seller: their own listings
router.get('/my', protect, seller, async (req, res) => {
  try {
    const pets = await Pet.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your listings.' });
  }
});

// GET /api/pets/:id — pet detail (increment views)
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('seller', 'name email shopName avatar phone');
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pet.' });
  }
});

// POST /api/pets — seller creates listing
router.post('/', protect, seller, async (req, res) => {
  try {
    const { name, species, breed, age, ageUnit, gender, price, imageUrl, imageUrls, description, vaccinated, neutered, location, adoptionType } = req.body;
    if (!name || !species || age == null) {
      return res.status(400).json({ error: 'Name, species and age are required.' });
    }
    const pet = await Pet.create({
      name, species, breed, age, ageUnit: ageUnit || 'months', gender: gender || 'unknown',
      price: price || 0,
      imageUrl: imageUrl || '', imageUrls: imageUrls || [],
      description: description || '', vaccinated: vaccinated || false,
      neutered: neutered || false, location: location || '',
      adoptionType: adoptionType || 'adoption',
      seller: req.user._id,
      isApproved: true   // auto-approve seller listings
    });
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error creating listing.' });
  }
});

// PUT /api/pets/:id — seller updates own listing
router.put('/:id', protect, seller, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });
    if (pet.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not your listing.' });
    }
    const allowed = ['name','species','breed','age','ageUnit','gender','price','imageUrl','imageUrls','description','vaccinated','neutered','location','adoptionType','status'];
    allowed.forEach(f => { if (req.body[f] !== undefined) pet[f] = req.body[f]; });
    const saved = await pet.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error updating listing.' });
  }
});

// DELETE /api/pets/:id — seller deletes own listing, admin deletes any
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });
    if (pet.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not your listing.' });
    }
    await pet.deleteOne();
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting listing.' });
  }
});

module.exports = router;
