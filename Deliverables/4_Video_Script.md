# Deliverable 4: Video Script & Demo Points

**Duration:** ~5 Minutes

## 1. Introduction (0:00 - 0:30)
*   **Visual:** Title Slide "Pocket LLM Portal" -> Cut to App Landing Page.
*   **Script:** "Hi, this is [Team Name]. Today we are presenting Pocket LLM, our lightweight, offline-first AI portal designed to run on constrained hardware."
*   **Key Point:** Emphasize the "Premium Simple" design and the goal of bringing LLMs to the edge.

## 2. Architecture Overview (0:30 - 1:30)
*   **Visual:** Show the **Component Diagram** (from Deliverable 1).
*   **Script:** "Our architecture follows a clean client-server model. On the frontend, we have a React SPA that handles all UI state. On the backend, a modular Node.js application manages sessions and inference."
*   **Key Point:** Highlight the **Streaming Architecture** (SSE) and **Local Persistence** (SQLite) as key architectural decisions for performance.

## 3. Demo: Core Chat & Streaming (1:30 - 3:00)
*   **Visual:** Split screen or full screen of the App.
*   **Action:** Type "Tell me a story about a robot."
*   **Script:** "Let's see it in action. As I type a prompt, notice the immediate feedback. The response streams in token-by-token. This is powered by our Server-Sent Events implementation, ensuring the user never stares at a loading spinner."
*   **Key Point:** Show the **CPU Mode** badge and explain how the system is optimized for limited resources (4 vCPU).

## 4. Demo: History & Persistence (3:00 - 4:00)
*   **Visual:** Click "New Chat", then click back to the previous session in the Sidebar.
*   **Action:** Show the history loading instantly.
*   **Script:** "Pocket LLM remembers your conversations. Our SQLite-backed Session Repository ensures that your history is safe and loads instantly, even if you refresh the page."
*   **Key Point:** Demonstrate the **Sidebar** navigation and the seamless state restoration.

## 5. Challenges & Conclusion (4:00 - 5:00)
*   **Visual:** Return to Architecture Diagram or Team Slide.
*   **Script:** "One of our major challenges was optimizing the streaming pipeline to work smoothly within the 16GB RAM limit. We solved this by implementing a custom Inference Service that manages memory efficiently."
*   **Conclusion:** "Pocket LLM demonstrates that powerful AI tools can be beautiful, simple, and efficient. Thank you."
