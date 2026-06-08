const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');

// GET /api/sellers
router.get('/', async (req, res) => {
  try {
    const list = await Seller.find().sort({ createdAt: -1 });
    const formatted = list.map(seller => ({
      id: seller._id,
      sellerName: seller.sellerName,
      shopName: seller.shopName,
      email: seller.email,
      phone: seller.phone,
      address: seller.address
    }));
    res.json(formatted);
  } catch (error) {
    console.error("Fetch sellers error:", error);
    res.status(500).json({ error: "Server error fetching sellers." });
  }
});

// POST /api/sellers
router.post('/', async (req, res) => {
  try {
    const { sellerName, shopName, email, phone, address } = req.body;
    if (!sellerName || !shopName || !email || !phone || !address) {
      return res.status(400).json({ error: "Please complete all fields before registering." });
    }

    const seller = new Seller({
      sellerName,
      shopName,
      email,
      phone,
      address
    });

    const saved = await seller.save();
    res.status(201).json({
      id: saved._id,
      sellerName: saved.sellerName,
      shopName: saved.shopName,
      email: saved.email,
      phone: saved.phone,
      address: saved.address
    });
  } catch (error) {
    console.error("Register seller error:", error);
    res.status(500).json({ error: "Server error registering seller." });
  }
});

module.exports = router;
