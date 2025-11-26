class InferenceService {
    constructor() {
        // Mock model parameters
        this.modelName = "PocketLLM-CPU-Quantized";
    }

    /**
     * Simulates streaming a response from a quantized LLM.
     * In a real implementation, this would wrap node-llama-cpp or similar.
     * @param {string} prompt - The user's input.
     * @param {function} onToken - Callback for each token.
     * @returns {Promise<void>}
     */
    async streamResponse(prompt, onToken) {
        const mockResponse = `This is a simulated response from the ${this.modelName} running on CPU. 
    I received your prompt: "${prompt}". 
    
    Here is some generated text to demonstrate streaming:
    1. First point
    2. Second point
    3. Third point
    
    End of transmission.`;

        const tokens = mockResponse.split(/(?=[\s\S])/); // Split by char but keep delimiters (simplified)

        for (const token of tokens) {
            // Simulate inference latency (CPU bound)
            await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
            onToken(token);
        }
    }
}

module.exports = new InferenceService();
