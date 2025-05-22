// server/routes/chatRoutes.js

const express = require('express');
const { getMessages } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/chats/:chatId/messages
// Returns the full message history for a chat
router.get('/:chatId/messages', getMessages);

module.exports = router;
