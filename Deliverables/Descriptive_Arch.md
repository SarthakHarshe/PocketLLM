# Descriptive Architecture (Design Decisions and departures)

This document outlines the design decisions and departures from the initial architectural plan made during the implementation of the Pocket LLM Portal.

## 1. Tech Stack Refinement
*   **Decision:** Use **Express.js** instead of NestJS.
*   **Rationale:** While the initial requirements suggested "NestJS or Express", we opted for Express.js. For a "Pocket" application with limited scope, Express provides a lighter footprint and faster development cycle while still allowing for the required modular Controller/Service architecture. NestJS's dependency injection system, while powerful, adds unnecessary boilerplate for this specific scale.

## 2. Inference Engine Abstraction
*   **Decision:** Implement a **Mock Inference Service** for the initial prototype.
*   **Rationale:** To satisfy the "CPU-only" and "Limited Resources" constraints during the development and verification phase, we implemented a simulated inference engine (`InferenceService.js`). This allows us to verify the **Streaming Architecture** (SSE, Frontend handling, Token appending) without the heavy overhead of loading a multi-gigabyte model file (GGUF) during the initial build. The architecture is designed such that this service can be replaced with a real `node-llama-cpp` binding with zero changes to the Controller or Frontend.

## 3. Frontend Styling & UX
*   **Decision:** Adopt a **Slate/Sky** color theme with **TailwindCSS v4**.
*   **Rationale:** The initial requirement was generic, but we refined the UX to be "Premium, Simple, and Modern" (avoiding purple). We chose TailwindCSS for its utility-first approach, enabling rapid UI iteration. We specifically used the latest v4 to leverage modern CSS features and reduced build configuration overhead.

## 4. Docker Deployment Strategy
*   **Decision:** Single Container Deployment.
*   **Rationale:** Instead of running separate containers for Frontend (Nginx) and Backend (Node), we configured the Node.js backend to serve the static frontend build in production.
    *   **Benefit:** Reduces resource consumption (memory/CPU overhead of an extra container).
    *   **Benefit:** Simplifies deployment (single Docker image).
    *   **Trade-off:** Tightly couples the deployment artifacts, but acceptable for a "Pocket" app.

## 5. Database Choice
*   **Decision:** **Better-SQLite3** In-process over a separate SQL server.
*   **Rationale:** To strictly adhere to the "Pocket" nature and resource constraints, we used `better-sqlite3`. This runs in the same process as the Node.js application, eliminating the latency and resource cost of a separate database server process (like PostgreSQL or MySQL), which aligns perfectly with the requirement for a lightweight, self-contained app.
