const express = require('express');
const ChatController = require('../controllers/ChatController');

const router = express.Router();

router.post('/chat', (req, res) => ChatController.handleChat(req, res));
router.get('/sessions', (req, res) => ChatController.getHistory(req, res));
router.get('/sessions/:id/messages', (req, res) => ChatController.getSessionMessages(req, res));
router.delete('/sessions/:id', (req, res) => ChatController.deleteSession(req, res));

module.exports = router;
