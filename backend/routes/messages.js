const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// GET /api/messages/threads — get all conversation thread summaries for current user
router.get('/threads', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    // Get latest message per thread where user is sender or receiver
    const messages = await Message.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .populate('fromUser', 'name avatar role')
      .populate('toUser', 'name avatar role')
      .populate('petId', 'name imageUrl');

    // Deduplicate by threadId (keep latest)
    const threads = {};
    messages.forEach(m => {
      if (!threads[m.threadId]) threads[m.threadId] = m;
    });
    res.json(Object.values(threads));
  } catch (err) {
    res.status(500).json({ error: 'Error fetching threads.' });
  }
});

// GET /api/messages/:threadId — get all messages in a thread
router.get('/:threadId', protect, async (req, res) => {
  try {
    const msgs = await Message.find({ threadId: req.params.threadId })
      .sort({ createdAt: 1 })
      .populate('fromUser', 'name avatar')
      .populate('toUser', 'name avatar');
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages.' });
  }
});

// POST /api/messages — send a message
router.post('/', protect, async (req, res) => {
  try {
    const { petId, toUserId, text } = req.body;
    if (!petId || !toUserId || !text) {
      return res.status(400).json({ error: 'petId, toUserId and text are required.' });
    }
    // Build a stable thread ID
    const ids = [req.user._id.toString(), toUserId, petId].sort();
    const threadId = ids.join('_');

    const msg = await Message.create({
      petId, fromUser: req.user._id, toUser: toUserId, text, threadId
    });
    const populated = await msg.populate([
      { path: 'fromUser', select: 'name avatar' },
      { path: 'toUser', select: 'name avatar' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Error sending message.' });
  }
});

module.exports = router;
