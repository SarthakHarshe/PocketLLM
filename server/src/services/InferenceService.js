const path = require('path');
const fs = require('fs');

class InferenceService {
    constructor() {
        this.modelName = "PocketLLM-Hybrid";
        this.llama = null;
        this.model = null;
        this.context = null;
        this.session = null;
        this.isRealModel = false;

        this.initialize();
    }

    async initialize() {
        try {
            // Check if model exists
            const modelPath = path.join(__dirname, '../../models/Llama-3.2-1B-Instruct-Q4_K_M.gguf');

            if (fs.existsSync(modelPath)) {
                console.log('Found local GGUF model. Initializing node-llama-cpp...');
                const { getLlama, LlamaChatSession } = await import('node-llama-cpp');

                this.llama = await getLlama();
                this.model = await this.llama.loadModel({
                    modelPath: modelPath
                });

                // Limit threads to reduce CPU usage (User Request)
                this.context = await this.model.createContext({
                    threads: 2
                });
                this.session = new LlamaChatSession({
                    contextSequence: this.context.getSequence()
                });

                this.isRealModel = true;
                this.modelName = "Llama-3.2-1B (Real)";
                console.log('Real LLM initialized successfully!');
            } else {
                console.log('No GGUF model found. Using Mock Inference Engine.');
            }
        } catch (error) {
            console.error('Failed to initialize real LLM:', error);
            console.log('Falling back to Mock Inference Engine.');
        }
    }

    /**
     * Streams response from either Real LLM or Mock Engine.
     * @param {string} prompt - The user's input.
     * @param {function} onToken - Callback for each token.
     * @returns {Promise<void>}
     */
    async streamResponse(prompt, onToken) {
        if (this.isRealModel && this.session) {
            await this.streamRealResponse(prompt, onToken);
        } else {
            await this.streamMockResponse(prompt, onToken);
        }
    }

    async streamRealResponse(prompt, onToken) {
        try {
            // Llama 3 Prompt Template
            const formattedPrompt = `<|start_header_id|>system<|end_header_id|>\n\nYou are a helpful AI assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

            await this.session.prompt(formattedPrompt, {
                onTextChunk: (chunk) => {
                    // chunk is a string
                    onToken(chunk);
                }
            });
        } catch (error) {
            console.error('Real inference error:', error);
            onToken("\n[Error: Failed to generate response from local model]");
        }
    }

    async streamMockResponse(prompt, onToken) {
        const mockResponse = `[MOCK MODE] I received your prompt: "${prompt}".
    
    To use the REAL AI:
    1. Run 'node download_model.js' in the project root.
    2. Restart the server.
    
    For now, here is a simulated response to demonstrate the streaming UI:
    - The architecture handles token streaming perfectly.
    - The UI updates in real-time.
    - Your history is saved locally.`;

        const tokens = mockResponse.split(/(?=[\s\S])/);

        for (const token of tokens) {
            await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
            onToken(token);
        }
    }
}

module.exports = new InferenceService();
