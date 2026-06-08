const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const list = await Product.find().sort({ createdAt: -1 });
    const formatted = list.map(prod => ({
      id: prod._id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      description: prod.description
    }));
    res.json(formatted);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: "Server error fetching products." });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;
    if (!name || !category || !price || !stock || !description) {
      return res.status(400).json({ error: "Please complete all fields before listing." });
    }

    const product = new Product({
      name,
      category,
      price,
      stock: Number(stock),
      description
    });

    const saved = await product.save();
    res.status(201).json({
      id: saved._id,
      name: saved.name,
      category: saved.category,
      price: saved.price,
      stock: saved.stock,
      description: saved.description
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Server error listing product." });
  }
});

module.exports = router;
