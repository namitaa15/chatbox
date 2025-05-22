// server/controllers/chatController.js

const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    // Fetch all messages for this chat, sorted from oldest → newest
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages };