# Architecture Comparison & Selection - Pocket LLM

## Overview
This document compares the architectural proposals from the team members for the Pocket LLM project. The goal is to select the best architecture that aligns with the project requirements and constraints.

## Requirements Recap
Based on `Assignment3 CSC-578.pdf` and `pocket_llm.pdf`:
*   **Frontend:** React Single Page Application (SPA) with Service Worker and IndexedDB (Offline-first).
*   **Backend:** Node.js application (NestJS or Express) with modular controllers.
*   **Inference:** CPU-only, quantized model (1-8B params), streaming response.
*   **Persistence:** SQLite.
*   **Caching:** In-memory LRU + Disk-backed (SQLite/RocksDB).

## Candidate Architectures

### 1. Aarush Verulkar
*   **Frontend:** React.
*   **Backend:** Modular backend based on Assignment 2 structure.
*   **Pros:** Good alignment with React requirement. Clear separation of concerns.
*   **Cons:** Backend details are slightly generic, relying heavily on the previous assignment's structure without explicit Node.js/NestJS mapping details in the text provided.

### 2. Sarthak Harshe
*   **Frontend:** React (Detailed Component/Context/Hook breakdown).
*   **Backend:** Modular backend with explicit Service/Adapter layers.
*   **Pros:**
    *   **High Detail:** Explicitly defines React components (`ChatPage`, `HistoryPage`), Contexts (`AuthContext`), and Hooks (`useChatStream`).
    *   **Alignment:** Perfectly aligns with the "Refined" requirements for Assignment 3.
    *   **Clarity:** Clear separation of UI, State, and Side-effects (API Clients).
    *   **Completeness:** Addresses all functional requirements including Admin/Developer consoles and Batch processing.
*   **Cons:** None significant.

### 3. Mayur Prasanna
*   **Frontend:** React.
*   **Backend:** "Stays nearly the same as HW2".
*   **Pros:** Very detailed breakdown of "Delta Functional Requirements" and UI states.
*   **Cons:** Less architectural detail on the backend structure compared to Sarthak's. Focuses more on requirements definition than architectural component mapping.

### 4. Software Architectures Assignment 3 (Django)
*   **Framework:** Django (Python).
*   **Verdict:** **REJECTED**.
*   **Reason:** The project requirements explicitly state the backend must be a **Node.js application**. This proposal uses Django, which violates the core technology constraint.

### 5. Kasyap Sai Chakkirala
*   **Frontend:** React (TypeScript).
*   **Backend:** Node.js.
*   **Pros:**
    *   Good functional breakdown (Theme customization, Typing indicators).
    *   Mentions `ReadableStream` for streaming.
    *   Clear requirements for Admin Dashboard.
*   **Cons:**
    *   Less detailed on the specific backend component structure (Controllers/Services) compared to Sarthak's.
    *   Focuses heavily on requirements rather than architectural component mapping.

## Selected Architecture: Sarthak Harshe

**Reasoning:**
Sarthak Harshe's architecture remains the best choice because:
1.  **Detail & Structure:** It provides the most concrete breakdown of React components (`ChatPage`, `Sidebar`) and Backend services (`SessionRepository`, `InferenceService`).
2.  **Implementation Readiness:** The component diagram maps directly to the file structure we have implemented.
3.  **Completeness:** It covers all "Refined" requirements including the offline-first Service Worker pattern (which Kasyap also mentions but less structurally).

**Note on Kasyap's Proposal:** Kasyap's proposal is strong and very similar in stack (React + Node), but Sarthak's provides a better *blueprint* for the actual code structure we are building. We can incorporate Kasyap's "Theme Customization" idea as a future enhancement.

## Modifications & Refinements
While Sarthak's architecture is excellent, we will ensure the following during implementation:
*   **Tech Stack:** We will use **Express.js** for the backend (as it's a valid option and often lighter/faster to set up than NestJS for a "Pocket" app) but structure it with the Controller/Service pattern as requested.
*   **Persistence:** We will strictly use **SQLite** as defined in the requirements.
*   **Inference:** We will use a mock or lightweight CPU inference engine (like `node-llama-cpp` or a mock for development) to satisfy the CPU-only constraint.

## Next Steps
1.  Initialize project structure based on Sarthak's component diagram.
2.  Set up React SPA with Vite.
3.  Set up Express.js backend with SQLite.
