# Docker Deployment & Verification Instructions

## 1. Build and Run in Background
To start the container in "detached" mode (so it keeps running even if you close the terminal), use the `-d` flag:

```bash
docker-compose up -d --build
```

*   **Builds** the image (using the `Dockerfile`).
*   **Creates** the container.
*   **Starts** the server (and auto-downloads the model if missing).
*   **Runs in background** (releases your terminal).

## 2. Verify Server Connectivity
Once running, the server is accessible via port forwarding:

*   **URL:** [http://localhost:3001](http://localhost:3001)
*   **Test:** Open the URL in your browser. You should see the Pocket LLM interface.

## 3. "Prove It": View the Running Process Inside the Container
To verify the server is actually running *inside* the container:

### Step A: Find the Container ID
Run this command to list active containers:
```bash
docker-compose ps
```
*Copy the name of the container (e.g., `saimplementation-pocket-llm-1`).*

### Step B: Exec into the Container
Open a shell inside the running container:
```bash
docker exec -it saimplementation-pocket-llm-1 /bin/bash
```
*(Note: If `/bin/bash` fails, try `/bin/sh`)*

### Step C: View Running Processes
Inside the container, run:
```bash
ps aux | grep node
```
You should see:
1.  `npm start` process.
2.  `node src/app.js` process (the actual server).

### Step D: Check Logs (Alternative)
To see the server logs (including model loading status) without entering the container:
```bash
docker-compose logs -f
```
*(Press `Ctrl+C` to exit logs; the server will keep running).*

## 4. Stop the Container
To stop and remove the container:
```bash
docker-compose down
```
