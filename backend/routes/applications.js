const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, admin, seller } = require('../middleware/auth');

// GET /api/applications — admin: all
router.get('/', protect, admin, async (req, res) => {
  try {
    const list = await Application.find().sort({ createdAt: -1 })
      .populate('petId', 'name species imageUrl')
      .populate('userId', 'name email')
      .populate('sellerId', 'name email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching applications.' });
  }
});

// GET /api/applications/my — user: their own applications
router.get('/my', protect, async (req, res) => {
  try {
    const list = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 })
      .populate('petId', 'name species imageUrl breed');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your applications.' });
  }
});

// GET /api/applications/seller — seller: requests for their pets
router.get('/seller', protect, seller, async (req, res) => {
  try {
    const list = await Application.find({ sellerId: req.user._id }).sort({ createdAt: -1 })
      .populate('petId', 'name species imageUrl breed')
      .populate('userId', 'name email phone');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching adoption requests.' });
  }
});

// POST /api/applications — anyone (auth optional)
router.post('/', async (req, res) => {
  try {
    const { applicantName, petName, contactNumber, location, reason, petId, userId, sellerId } = req.body;
    if (!applicantName || !petName || !contactNumber || !location || !reason) {
      return res.status(400).json({ error: 'Please complete all fields.' });
    }
    
    const mongoose = require('mongoose');
    const validPetId = (petId && mongoose.isValidObjectId(petId)) ? petId : null;
    const validUserId = (userId && mongoose.isValidObjectId(userId)) ? userId : null;
    const validSellerId = (sellerId && mongoose.isValidObjectId(sellerId)) ? sellerId : null;

    const app = await Application.create({ 
      applicantName, petName, contactNumber, location, reason, 
      petId: validPetId, userId: validUserId, sellerId: validSellerId 
    });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: 'Error submitting application.' });
  }
});

// PUT /api/applications/:id/status — seller or admin approves/rejects
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, sellerNote } = req.body;
    if (!['approved','rejected','pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found.' });

    const isSeller = app.sellerId && app.sellerId.toString() === req.user._id.toString();
    const isAdmin  = req.user.role === 'admin';
    if (!isSeller && !isAdmin) {
      return res.status(403).json({ error: 'Not authorised to update this application.' });
    }
    app.status = status;
    if (sellerNote !== undefined) app.sellerNote = sellerNote;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Error updating application status.' });
  }
});

module.exports = router;
