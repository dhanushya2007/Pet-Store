const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// GET /api/cart/:sessionId — fetch all cart items for a session
router.get('/:sessionId', async (req, res) => {
  try {
    const items = await CartItem.find({ sessionId: req.params.sessionId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart.' });
  }
});

// POST /api/cart — add item (or increment qty)
router.post('/', async (req, res) => {
  try {
    const { petId, name, price, sessionId } = req.body;
    if (!petId || !name || price == null || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    let item = await CartItem.findOne({ petId, sessionId });
    if (item) {
      item.qty += 1;
      await item.save();
    } else {
      item = await CartItem.create({ petId, name, price, qty: 1, sessionId });
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error adding to cart.' });
  }
});

// PUT /api/cart/:id — update qty
router.put('/:id', async (req, res) => {
  try {
    const { qty } = req.body;
    if (qty < 1) {
      await CartItem.findByIdAndDelete(req.params.id);
      return res.json({ deleted: true });
    }
    const item = await CartItem.findByIdAndUpdate(req.params.id, { qty }, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error updating cart.' });
  }
});

// DELETE /api/cart/:id — remove single item
router.delete('/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Error removing item.' });
  }
});

// DELETE /api/cart/session/:sessionId — clear entire cart
router.delete('/session/:sessionId', async (req, res) => {
  try {
    await CartItem.deleteMany({ sessionId: req.params.sessionId });
    res.json({ cleared: true });
  } catch (err) {
    res.status(500).json({ error: 'Error clearing cart.' });
  }
});

module.exports = router;
