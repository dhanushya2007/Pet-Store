const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    // Admin role only for the hardcoded admin email
    const assignedRole = email.toLowerCase() === 'admin@petstore.com'
      ? 'admin'
      : (role === 'seller' ? 'seller' : 'user');

    const user = await User.create({ name, email, password, role: assignedRole });
    res.status(201).json({
      message: 'Registration successful',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Email received: "${email}", Password received: "${password}"`);
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }
    // Case-insensitive email search
    const user = await User.findOne({ email: new RegExp('^' + email.trim() + '$', 'i') });
    if (user && (await user.matchPassword(password))) {
      res.json({
        message: 'Login successful',
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials. Try again or sign up.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me — get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    
    // Manually fetch DB pets for wishlist
    const Pet = require('../models/Pet');
    const validIds = user.wishlist.filter(id => id && id.length === 24);
    const dbPets = await Pet.find({ _id: { $in: validIds } }).lean();
    
    user.wishlist = user.wishlist.map(id => {
      if (id && id.length === 24) {
        return dbPets.find(p => p._id.toString() === id) || null;
      }
      return id; // fallback for static pets like "s101"
    }).filter(Boolean);

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch profile.' });
  }
});

// PUT /api/auth/profile — update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, shopName, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (name)     user.name     = name;
    if (phone)    user.phone    = phone;
    if (address)  user.address  = address;
    if (shopName) user.shopName = shopName;
    if (bio)      user.bio      = bio;
    if (avatar)   user.avatar   = avatar;
    if (req.body.password) {
      user.password = req.body.password; // pre-save hook will hash it
    }
    const saved = await user.save();
    res.json({ id: saved._id, name: saved.name, email: saved.email, role: saved.role });
  } catch (err) {
    res.status(500).json({ error: 'Could not update profile.' });
  }
});

// PUT /api/auth/wishlist/:petId — toggle wishlist
router.put('/wishlist/:petId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const petId = req.params.petId;
    const idx = user.wishlist.findIndex(id => id.toString() === petId);
    if (idx === -1) {
      user.wishlist.push(petId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Could not update wishlist.' });
  }
});

module.exports = router;
