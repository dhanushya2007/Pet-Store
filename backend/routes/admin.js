const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const Application = require('../models/Application');
const { protect, admin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [users, sellers, pets, applications, approvedPets] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'seller' }),
      Pet.countDocuments(),
      Application.countDocuments(),
      Pet.countDocuments({ isApproved: true }),
    ]);
    const pendingApps = await Application.countDocuments({ status: 'pending' });
    const pendingPets = await Pet.countDocuments({ isApproved: false });
    res.json({ users, sellers, pets, applications, approvedPets, pendingApps, pendingPets });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching stats.' });
  }
});

// GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

// PUT /api/admin/users/:id/approve — toggle approval
router.put('/users/:id/approve', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.isApproved = !user.isApproved;
    await user.save();
    res.json({ id: user._id, isApproved: user.isApproved });
  } catch (err) {
    res.status(500).json({ error: 'Error updating user.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user.' });
  }
});

// GET /api/admin/sellers
router.get('/sellers', protect, admin, async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password').sort({ createdAt: -1 });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching sellers.' });
  }
});

// GET /api/admin/pets — all including unapproved
router.get('/pets', protect, admin, async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 }).populate('seller', 'name email shopName');
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pets.' });
  }
});

// PUT /api/admin/pets/:id/approve — toggle pet listing approval
router.put('/pets/:id/approve', protect, admin, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });
    pet.isApproved = !pet.isApproved;
    await pet.save();
    res.json({ id: pet._id, isApproved: pet.isApproved });
  } catch (err) {
    res.status(500).json({ error: 'Error updating pet.' });
  }
});

// DELETE /api/admin/pets/:id — remove fraudulent listing
router.delete('/pets/:id', protect, admin, async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting pet.' });
  }
});

// GET /api/admin/applications — all adoption requests
router.get('/applications', protect, admin, async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 })
      .populate('petId', 'name species imageUrl')
      .populate('userId', 'name email');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching applications.' });
  }
});

module.exports = router;
