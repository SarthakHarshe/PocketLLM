# Deliverable 4: Video Script & Demo Points

**Duration:** ~5 Minutes

## 1. Introduction (0:00 - 0:30)
*   **Visual:** Title Slide "Pocket LLM Portal" -> Cut to App Landing Page (Gray + Pastel Theme).
*   **Script:** "Hi, this is [Team Name]. Today we are presenting Pocket LLM, our lightweight, offline-first AI portal designed to run on constrained hardware. We've focused on a 'Premium Simple' aesthetic using a modern gray and pastel palette."

## 2. Architecture Overview (0:30 - 1:00)
*   **Visual:** Show the **Component Diagram** (from Deliverable 1).
*   **Script:** "Our architecture follows a clean client-server model. On the frontend, we have a React SPA that handles all UI state. On the backend, a modular Node.js application manages sessions and inference. We chose this to ensure modularity and separation of concerns."

## 3. Demo: Core Features (1:00 - 3:00)
*   **Visual:** Split screen or full screen of the App.
*   **Action:** Type "Tell me a story about a robot."
*   **Script:** "Let's see it in action. As I type a prompt, notice the immediate feedback. The response streams in token-by-token via Server-Sent Events. We also have a persistent sidebar that saves your history locally using SQLite."
*   **Key Point:** Highlight the **CPU Mode** badge and the smooth animations.

## 4. High Points & Low Points (3:00 - 4:00)
*   **Visual:** Team Slide or Architecture Diagram.
*   **Script:**
    *   **High Points:** "Our biggest success was the seamless integration of the streaming pipeline. Getting the token-by-token update to feel 'native' and responsive on the React frontend was a major win. We also love the modularity of the backend; swapping the mock engine for a real GGUF loader is trivial."
    *   **Low Points:** "One low point was the initial struggle with PDF parsing for the requirements gathering phase. We spent significant time debugging binary formats before settling on a reliable library. We also had to reject a Django proposal which, while good, didn't fit the Node.js constraint."

## 5. Major Challenges (4:00 - 5:00)
*   **Visual:** Code Snippet of `InferenceService` or `useChatStream`.
*   **Script:** "Our major challenge was optimizing for the 'Pocket' constraints. Ensuring the app runs smoothly on 4 vCPUs meant we had to be very careful with our render loops in React and our memory management in Node.js. We solved this by implementing a custom `useChatStream` hook that efficiently manages the SSE connection without unnecessary re-renders."
*   **Conclusion:** "Pocket LLM demonstrates that powerful AI tools can be beautiful, simple, and efficient. Thank you."
