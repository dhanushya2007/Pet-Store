const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const mongoose = require('mongoose');

// POST /api/orders — place an order (checkout)
router.post('/', protect, async (req, res) => {
  try {
    const { items, total, sessionId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty.' });
    }
    if (total == null || isNaN(total)) {
      return res.status(400).json({ error: 'A valid total is required.' });
    }

    // Sanitise items — ensure petId is stored as string, and numeric fields are correct
    const sanitisedItems = items.map(i => ({
      petId:    i.petId ? String(i.petId) : undefined,
      name:     i.name  || 'Unknown',
      price:    parseFloat(i.price)  || 0,
      qty:      parseInt(i.qty, 10)  || 1,
      imageUrl: i.imageUrl || '',
    }));

    const order = await Order.create({
      userId:    req.user._id,
      items:     sanitisedItems,
      total:     parseFloat(total),
      sessionId: sessionId || null,
    });

    // Mark ordered pets as 'sold'
    const Pet = require('../models/Pet');
    const rawPetIds = sanitisedItems
      .map(i => i.petId)
      .filter(id => id && mongoose.Types.ObjectId.isValid(id));

    if (rawPetIds.length > 0) {
      const objectIds = rawPetIds.map(id => new mongoose.Types.ObjectId(id));
      await Pet.updateMany({ _id: { $in: objectIds } }, { status: 'sold' });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Error placing order.' });
  }
});

// GET /api/orders/my — logged-in user's own order history
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Error fetching orders.' });
  }
});

// GET /api/orders/seller — seller: orders that contain their pets
router.get('/seller', protect, async (req, res) => {
  try {
    const Pet = require('../models/Pet');
    const myPets = await Pet.find({ seller: req.user._id }).select('_id');
    const myPetIds = myPets.map(p => p._id.toString());

    const allOrders = await Order.find({ 'items.petId': { $exists: true } })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const myOrders = [];
    for (const o of allOrders) {
      const myItems = o.items.filter(
        it => it.petId && myPetIds.includes(it.petId.toString())
      );
      if (myItems.length > 0) {
        myOrders.push({ ...o.toObject(), items: myItems });
      }
    }

    res.json(myOrders);
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ error: 'Error fetching seller orders.' });
  }
});

// GET /api/orders — admin: all orders
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Error fetching orders.' });
  }
});

// PUT /api/orders/:id/status — admin updates order status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Error updating order.' });
  }
});

module.exports = router;
