const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// GET /api/enquiries
router.get('/', async (req, res) => {
  try {
    const list = await Enquiry.find().sort({ createdAt: -1 });
    const formatted = list.map(item => ({
      id: item._id,
      fullName: item.fullName,
      email: item.email,
      message: item.message,
      submittedAt: item.submittedAt ? item.submittedAt.toLocaleString() : new Date(item.createdAt).toLocaleString()
    }));
    res.json(formatted);
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    res.status(500).json({ error: "Server error fetching enquiries." });
  }
});

// POST /api/enquiries
router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: "Please fill in all fields before submitting." });
    }

    const enquiry = new Enquiry({
      fullName,
      email,
      message
    });

    const saved = await enquiry.save();
    res.status(201).json({
      id: saved._id,
      fullName: saved.fullName,
      email: saved.email,
      message: saved.message,
      submittedAt: saved.submittedAt ? saved.submittedAt.toLocaleString() : new Date(saved.createdAt).toLocaleString()
    });
  } catch (error) {
    console.error("Submit enquiry error:", error);
    res.status(500).json({ error: "Server error submitting enquiry." });
  }
});

module.exports = router;
