# Sigma-Contacts

Graph-based contact management system. Users build visual network graphs of contacts.

## Stack

| Layer | Tech |
|-------|------|
| Backend | Go 1.23.2, Gin, MongoDB, JWT (HS256) |
| Frontend | React 18, TypeScript, Sigma.js, Graphology, Chakra-UI, Axios |
| Deploy | Docker Compose |

## Project Structure

```
backend/
  cmd/app/main.go              # Entry point → app.Run()
  internal/
    app/app.go                 # DI wiring (repos → services → controllers)
    config/config.go           # Env-based config (DB_HOST, JWT_SECRET, ENVIRONMENT)
    api/
      route/router.go          # All routes
      controller/              # HTTP handlers
      middleware/              # auth.go (JWT), role.go (admin check)
    domain/
      entities/                # User, Graph, Node, Edge, Contact
      dto/request|response/    # API contract DTOs
      interface/repository|service/  # Interfaces for DI
      logic/graph_manager.go   # PropagateGroupColor, FindGroupNode
    repository/                # MongoDB data access
    service/                   # Business logic
  pkg/
    utils/                     # JWT, password/login/email/phone validators, bcrypt
    logger/                    # Logrus (dev=text/stdout, prod=JSON/file)
  tests/                       # Auth + validator tests; mocks/stubs in user_repository/

web-app/src/
  App.tsx                      # Router: /login, /register, / (Main), /graph, /profile
  pages/                       # Auth, Main (graph + panel), Profile
  components/                  # SigmaContainer, SettingsPanel, NodeContextMenu, AdminUserTable
  hook/                        # useAuth, useGraphStore, useUserStore, useDragNodes
  service/                     # authService, graphService, nodeService, contactService, adminService
  context/GraphContext.tsx      # Global graph state
  types/                       # graph.ts, node.ts, edge.ts, contact.ts, user.tsx, response.ts
```

## Routes

```
POST /api/auth/register|login                     # public
GET  /api/utils/ping                              # public
GET|POST|PUT /api/users/*                         # JWT required
GET|POST /api/graph/*                             # JWT required
POST|PUT|DELETE /api/contact/                     # JWT required
POST|PUT|DELETE /api/node/*                       # JWT required
GET /api/analytics/baseInfo                       # JWT required
GET /api/admin/ping|users                         # JWT + role=admin
```

## Auth

- JWT, HS256, 1024h expiry
- Claims: `sub`=userId, `iss`=role
- Bearer token in Authorization header
- Role check: `claims["iss"] == "admin"`
- Token stored in localStorage on frontend

## Data Model

MongoDB — Graph is root document with embedded Nodes, Edges. Contact embedded in Node.
- `users` collection — separate
- `graphs` collection — contains nodes[], edges[], each node has contact{}

## Config / Env

**Backend `.env`:**
```
DB_HOST=mongodb://database   # Docker hostname; locally use mongodb://localhost
DB_PORT=27017
DATABASE_NAME=sigma-contacts
JWT_SECRET=secret
ENVIRONMENT=dev|prod
```

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:8080/api
```

## Running

```bash
# Full stack (Docker)
make run    # docker compose up --build
make stop   # docker compose down

# Backend only (local)
cd backend && go run ./cmd/app/

# Frontend only (local)
cd web-app && npm start

# Tests
cd backend && go test ./...
```

## Validators (backend)

- Password: min 9 chars, uppercase + lowercase + 2+ special chars from `!/?$&@%`
- Login: max 15 chars

## Conventions

### Backend (Go)

**Naming:**
- Structs, interfaces, methods: `PascalCase`
- Files: `snake_case` (e.g., `user_repository.go`, `auth_service.go`)
- Variables, params: `camelCase` (e.g., `graphId`, `dbTimeout`)
- Layers: `XxxRepository`, `XxxService`, `XxxController`

**DTOs:**
- Request: `AddXxxRequest`, `ChangeXxxRequest`, `GetXxxRequest`, `DeleteXxxRequest`
- Response: `AddXxxResponse`, `ChangeXxxResponse`, `GetXxxResponse`
- Use `Add` (not `Create`), `Change` (not `Update`)
- Grouped requests: `AddXxxFullDataRequest` (node + edge + contact in one)

**JSON / BSON tags:** camelCase on all struct fields (`json:"graphId"`, `bson:"parentId"`)

**Error handling:** check `err != nil` → `log.Error(...)` → `return nil, err`

**Routes:** `/api/<resource>/` — lowercase, use action verbs in path when REST isn't enough (`/api/node/addContact`, `/api/node/addGroup`)

**MongoDB collections:** lowercase plural (`users`, `graphs`)

**MongoDB field names:** camelCase, matching JSON tags (`contactId`, `isGroup`, `parentId`)

**ID fields:** embedded doc IDs named `<entity>Id` (e.g., `contactId`, `nodeId`, `edgeId`). Primary key is `_id`.

---

### Frontend (React/TypeScript)

**Files:**
- Components: `PascalCase.tsx` (e.g., `Header.tsx`, `EditNodeForm.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useGraphStore.ts`)
- Services: `camelCase.ts` (e.g., `nodeService.ts`, `graphService.ts`)
- Types: `camelCase.ts` (e.g., `node.ts`, `contact.ts`)

**Components:** PascalCase, each in its own folder under `components/`

**Hooks:** `useXxx` — return state + actions

**Services:** exported as named class or const object with static methods

**Interfaces:** `interface Xxx` (no `I` prefix), e.g., `Node`, `Contact`, `GraphData`

**Enums:** `PascalCase` name, `UPPER_CASE` values (e.g., `SettingPanelState.ADD`)

**State vars:** camelCase; booleans with `is` prefix (`isGroup`, `isOpen`)

**API payload fields:** camelCase, must match backend JSON tags exactly

**Context:** `XxxContext.tsx` + `useXxxContext()` hook, `XxxProvider` wraps app

---

### Known Inconsistencies (do not replicate)

- `vitrualGraph` typo in `useGraphStore` — should be `virtualGraph` (not fixed yet to avoid breaking changes)
- Some component files use `camelCase.tsx` (e.g., `profileForm.tsx`) — new components must use `PascalCase.tsx`
- Services inconsistently exported as class vs const object — prefer const object with static methods for new services
- `Node.ID` / `Edge.ID` uses Go `ID` (uppercase) but `Contact.Id` uses `Id` — new entities: use `Id`

## Known Issues

1. `tests/user_repository/user_repository_stub.go` — missing `GetAll()` method → tests don't compile
2. JWT: no refresh token, only 1024h access token
3. Register endpoint doesn't return token (frontend workaround: redirect to login)
4. `Main.tsx:52` — incorrect `typeof(Error)` check for graphId
5. `middleware/role.go` — debug logging left in production path
6. `DB_HOST` in `.env` uses Docker hostname `mongodb://database` — change to `mongodb://localhost` for local dev
