# Deliverable 1: Prescriptive Architecture

## 1. Architectural Design & Rationale

### Selected Architecture: React SPA + Node.js Backend (Layered Client-Server)
We have selected a **Layered Architecture** with a **Client-Server** separation. This architecture is "Prescriptive" because it was defined before implementation based on the project requirements and best practices for modern web applications.

**Rationale for Selection:**
1.  **User Experience (UX):** The core requirement of an LLM portal is a highly interactive, streaming chat interface. A React Single Page Application (SPA) allows for seamless state management (chat history, active session) and real-time updates (token streaming) without full page reloads. This provides a "native app" feel that is superior to traditional server-side rendered (SSR) apps for this specific use case.
2.  **Offline Capability:** The architecture explicitly supports the "Offline-First" requirement. By separating the frontend, we can leverage Service Workers and client-side storage (IndexedDB/LocalStorage) to cache the UI shell and chat history, allowing the app to function (read-only or queued) without a network connection.
3.  **Modularity & Separation of Concerns:** The backend is structured into distinct layers:
    *   **Controller Layer:** Handles HTTP requests, routing, and input validation.
    *   **Service Layer:** Encapsulates business logic (Inference, Session Management).
    *   **Repository Layer:** Manages data persistence (SQLite).
    This separation ensures maintainability and allows individual components (like the Inference Engine) to be swapped or upgraded without affecting the rest of the system.
4.  **Resource Constraints:** The system is designed to run on limited resources (4 vCPU, 16GB RAM). By offloading UI rendering to the client and using a lightweight, in-process SQLite database, we maximize the resources available for the CPU-bound inference task.

### Did we update the architecture?
**Yes, slightly.**
*   **Original Plan:** We considered a strictly "MVC" pattern where the backend might render views (e.g., EJS/Pug).
*   **Updated Decision:** We moved to a **REST API + SPA** model.
*   **Why:** The requirement for *streaming* tokens (Server-Sent Events) and complex client-side state (typing indicators, optimistic UI updates, history management) is significantly easier to implement and maintain in a React SPA than in a server-rendered view. This decoupling also allows the backend to serve other clients (e.g., a CLI or mobile app) in the future without changes.

## 2. UML Diagrams (PlantUML)

### Component Diagram
This diagram shows the high-level structural components and their interactions.

```plantuml
@startuml
package "Client Workstation" {
    component "React Frontend" as Client {
        [Chat Interface]
        [Sidebar]
        [Auth Context]
        [HTTP Client]
    }
    database "Browser Storage" {
        [LocalStorage]
    }
}

package "Server (Node.js)" {
    component "API Gateway (Express)" as API
    
    package "Business Logic Layer" {
        [Chat Controller]
        [Inference Service]
        [Session Service]
    }
    
    package "Data Access Layer" {
        [Session Repository]
    }
    
    database "SQLite DB" as DB
}

Client --> API : HTTPS / JSON
Client --> [LocalStorage] : Read/Write Theme
API --> [Chat Controller] : Route Request
[Chat Controller] --> [Inference Service] : Stream Request
[Chat Controller] --> [Session Service] : Manage History
[Session Service] --> [Session Repository] : Persist Data
[Session Repository] --> DB : SQL Queries
@enduml
```

### Sequence Diagram: Chat Flow
This diagram illustrates the flow of a user sending a message and receiving a streamed response.

```plantuml
@startuml
actor User
participant "React UI" as UI
participant "Chat Controller" as Ctrl
participant "Inference Service" as Inf
participant "Session Repository" as Repo
database "SQLite" as DB

User -> UI : Type "Hello" & Send
activate UI
UI -> UI : Optimistic Update (Show User Msg)
UI -> Ctrl : POST /api/chat {prompt: "Hello"}
activate Ctrl

Ctrl -> Repo : saveMessage(user, "Hello")
activate Repo
Repo -> DB : INSERT INTO messages
Repo --> Ctrl : success
deactivate Repo

Ctrl -> Inf : streamResponse("Hello")
activate Inf

loop Every Token Generated
    Inf --> Ctrl : Token
    Ctrl --> UI : SSE Event (Token)
    UI -> UI : Append Token to View
end

Inf --> Ctrl : Done
deactivate Inf

Ctrl -> Repo : saveMessage(assistant, fullResponse)
activate Repo
Repo -> DB : INSERT INTO messages
Repo --> Ctrl : success
deactivate Repo

Ctrl --> UI : SSE Event (Done)
deactivate Ctrl
deactivate UI
@enduml
```

### Class Diagram (Backend Structure)
This diagram details the internal structure of the backend application.

```plantuml
@startuml
class ChatController {
    +handleChat(req, res)
    +getHistory(req, res)
    +getSessionMessages(req, res)
}

class InferenceService {
    +modelName: String
    +streamResponse(prompt, callback)
}

class SessionRepository {
    -db: Database
    +createSession(id, title)
    +getSession(id)
    +addMessage(sessionId, role, content)
    +getMessages(sessionId)
    +getAllSessions()
}

class App {
    +start()
    +setupRoutes()
    +setupMiddleware()
}

App --> ChatController : initializes
ChatController ..> InferenceService : uses
ChatController ..> SessionRepository : uses
@enduml
```
