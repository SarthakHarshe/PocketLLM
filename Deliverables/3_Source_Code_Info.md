# Deliverable 3: Source Code & Implementation

This folder contains the complete source code for the Pocket LLM Portal.

## Source Code Structure

*   **`client/`**: The React Frontend.
    *   `src/components/`: UI Components (`ChatInterface`, `Sidebar`).
    *   `src/hooks/`: Custom hooks (`useChatStream`).
    *   `src/context/`: State management (`AuthContext`).
*   **`server/`**: The Node.js Backend.
    *   `src/controllers/`: Request handlers (`ChatController`).
    *   `src/services/`: Business logic (`InferenceService`, `SessionRepository`).
    *   `src/routes/`: API route definitions.
*   **`Dockerfile`**: Configuration for building the production image.
*   **`docker-compose.yml`**: Configuration for running the app with resource limits.

## How to Run (Docker)

**Prerequisites:** Docker Desktop installed.

1.  **Build and Run:**
    Open a terminal in the project root (where `docker-compose.yml` is) and run:
    ```bash
    docker-compose up --build
    ```

2.  **Access the App:**
    Open your browser and navigate to:
    ```
    http://localhost:3001
    ```

3.  **Stop:**
    Press `Ctrl+C` in the terminal.

## How to Run (Manual / Dev Mode)

1.  **Backend:**
    ```bash
    cd server
    npm install
    npm start
    ```
    (Runs on port 3001)

2.  **Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```
    (Runs on port 5173, proxies API calls to 3001)

## Enabling Real AI (Hybrid Mode)
The app defaults to a **Mock Inference Engine** for speed and testing. To enable the **Real LLM**:

1.  **Download the Model:**
    Run the included script to download TinyLlama (approx. 600MB):
    ```bash
    node download_model.js
    ```
    This will save the GGUF model to `server/models/`.

2.  **Restart Server:**
    Restart the backend (`npm start` or Docker). The app will automatically detect the model file and switch to **Real Inference Mode**.

