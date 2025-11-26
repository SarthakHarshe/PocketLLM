import { useState, useRef, useCallback } from 'react';

export function useChatStream() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const abortControllerRef = useRef(null);

    const sendMessage = useCallback(async (prompt, sessionId = null) => {
        setIsLoading(true);

        // Optimistic update
        const userMessage = { role: 'user', content: prompt, timestamp: Date.now() };
        setMessages(prev => [...prev, userMessage]);

        // Placeholder for assistant message
        const assistantMessageId = Date.now() + 1;
        setMessages(prev => [...prev, {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: Date.now()
        }]);

        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, sessionId: sessionId || currentSessionId }),
                signal: abortControllerRef.current.signal,
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'session') {
                                setCurrentSessionId(data.sessionId);
                            } else if (data.type === 'token') {
                                assistantContent += data.content;
                                setMessages(prev => prev.map(msg =>
                                    msg.id === assistantMessageId
                                        ? { ...msg, content: assistantContent }
                                        : msg
                                ));
                            } else if (data.type === 'done') {
                                setIsLoading(false);
                            } else if (data.type === 'error') {
                                console.error('Stream error:', data.message);
                                setIsLoading(false);
                            }
                        } catch (e) {
                            // Ignore parse errors for partial lines
                        }
                    }
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Stream aborted');
            } else {
                console.error('Fetch error:', error);
            }
            setIsLoading(false);
        }
    }, [currentSessionId]);

    const stopStream = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
        }
    }, []);

    const clearChat = useCallback(() => {
        setMessages([]);
        setCurrentSessionId(null);
    }, []);

    const loadSession = useCallback(async (sessionId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/messages`);
            const data = await response.json();
            setMessages(data);
            setCurrentSessionId(sessionId);
        } catch (error) {
            console.error('Failed to load session:', error);
        }
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        stopStream,
        clearChat,
        loadSession,
        currentSessionId
    };
}
