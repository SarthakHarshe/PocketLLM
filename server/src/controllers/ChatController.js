const InferenceService = require('../services/InferenceService');
const SessionRepository = require('../services/SessionRepository');
const crypto = require('crypto');

class ChatController {
    async handleChat(req, res) {
        const { prompt, sessionId } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Ensure session exists
        let session = sessionId ? SessionRepository.getSession(sessionId) : null;
        let currentSessionId = sessionId;

        if (!session) {
            currentSessionId = crypto.randomUUID();
            session = SessionRepository.createSession(currentSessionId, prompt.substring(0, 30) + '...');
        }

        // Save user message
        SessionRepository.addMessage(currentSessionId, 'user', prompt);

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Send session ID first
        res.write(`data: ${JSON.stringify({ type: 'session', sessionId: currentSessionId })}\n\n`);

        let fullResponse = '';

        try {
            await InferenceService.streamResponse(prompt, (token) => {
                fullResponse += token;
                res.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
            });

            // Save assistant message
            SessionRepository.addMessage(currentSessionId, 'assistant', fullResponse);

            res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
            res.end();
        } catch (error) {
            console.error('Inference error:', error);
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Inference failed' })}\n\n`);
            res.end();
        }
    }

    async getHistory(req, res) {
        const sessions = SessionRepository.getAllSessions();
        res.json(sessions);
    }

    async getSessionMessages(req, res) {
        const { id } = req.params;
        const messages = SessionRepository.getMessages(id);
        res.json(messages);
    }

    async deleteSession(req, res) {
        const { id } = req.params;
        try {
            SessionRepository.deleteSession(id);
            res.json({ success: true });
        } catch (error) {
            console.error('Failed to delete session:', error);
            res.status(500).json({ error: 'Failed to delete session' });
        }
    }
}

module.exports = new ChatController();
