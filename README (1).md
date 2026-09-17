# PulseBoard — Analytics SaaS Dashboard

PulseBoard is a full-stack MERN analytics/admin dashboard that turns the reference Glass SaaS Dashboard Figma design into a working, data-driven project management application. Authenticated users can create, view, update, and delete their own projects, while the dashboard displays live project statistics, project creation/completion trends, and recent activity from MongoDB rather than hardcoded data. The application supports authentication, protected routes, light/dark themes, responsive desktop/tablet/mobile layouts, validation, and explicit loading, empty, and error states.

## Features

### Authentication
- User registration with name, email, and password.
- Passwords are hashed before storage.
- JWT-based authentication.
- Protected dashboard/project API routes.
- Unauthenticated users are prevented from accessing protected dashboard pages.
- Logout clears the client authentication state/session.

### Dashboard
- Total Projects
- Active Projects
- Completed Projects
- Overdue Projects
- Project completion information
- Recent Activity
- Project Insights
- Projects Created & Completed chart
- Dashboard values are derived from the authenticated user's persisted MongoDB records.

### Projects
- Create projects with:
  - Title
  - Description
  - Status
  - Due date
- List projects with pagination.
- Search/filter project records.
- Update project information and status.
- Delete projects with confirmation.
- Client-side and server-side validation.

### UI / Design
- Figma-inspired sidebar navigation.
- Figma-inspired top bar.
- Glassmorphism/translucent cards.
- Light/dark theme toggle.
- Theme preference persisted locally.
- Responsive desktop, tablet, and mobile layouts.
- Mobile sidebar/drawer behavior.
- Responsive project list/card presentation.
- Hover, focus, active, and disabled states for interactive controls.
- Dark-mode contrast/readability handling.

## FRD Coverage

PulseBoard is implemented against the supplied **PulseBoard — Analytics SaaS Dashboard (MERN Stack Challenge)** FRD.

| Requirement | Implementation |
|---|---|
| FR-1 | Registration with name, email, and password; password is hashed |
| FR-2 | Login with JWT authentication |
| FR-3 | Protected API routes validate authentication |
| FR-4 | Frontend protects dashboard routes |
| FR-5 | Logout clears authentication/session state |
| FR-6 | Dashboard statistics are aggregated from database records |
| FR-7 | Created/Completed project trend is calculated from actual project records |
| FR-8 | Recent Activity displays recently updated projects |
| FR-9 | Project/dashboard data is scoped to the authenticated user |
| FR-10 | Project creation with title, description, status, and due date |
| FR-11 | Project listing uses pagination |
| FR-12 | Project fields and status can be updated |
| FR-13 | Project deletion requires UI confirmation |
| FR-14 | Client-side and server-side validation |
| FR-15 | Reference sidebar, top bar, glassmorphism and layered card treatment |
| FR-16 | Light/dark theme with persisted preference |
| FR-17 | Interactive controls include appropriate UI states |
| FR-18 | Desktop/tablet/mobile responsive behavior |
| FR-19 | Dashboard/chart/project data views provide loading, empty, and error states |
| FR-20 | Form validation and submitting/pending states |

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Responsive CSS media queries
- Fetch/Axios-style API communication as implemented in the client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Database
- MongoDB Atlas or a local MongoDB instance

## Project Structure

```text
PulseBoard/
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── server.js
│   │   └── ...
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

> The exact component/module names may vary slightly by project version. Keep the existing `client` and `server` structure intact when applying this README.

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Git (optional, for repository management)

Check Node/npm:

```bash
node --version
npm --version
```

## Environment Variables

Create:

```text
server/.env
```

Use the following variable names:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Important security rules

- Never commit `.env` to Git.
- Never put a real MongoDB password in `.env.example`.
- Never commit a real JWT secret.
- Use a strong, unique MongoDB database password.
- If credentials are accidentally exposed, rotate them before submission/deployment.

A safe `.env.example` should contain variable names only:

```env
MONGO_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

## MongoDB Setup

### MongoDB Atlas

1. Create or open your MongoDB Atlas project.
2. Create a database user.
3. Create/use an M0 cluster for a challenge deployment if appropriate.
4. In Atlas, open **Connect → Drivers**.
5. Copy the Node.js connection string.
6. Put the connection string in `server/.env` as `MONGO_URI`.
7. Make sure your network access configuration allows the development/deployment environment to connect.
8. Start the backend.
9. Create a project through the application.
10. Verify the persisted project document in the `projects` collection.

The application should use MongoDB as the source of truth. Dashboard values should not depend on hardcoded project records.

## Installation

### 1. Clone or extract the project

```bash
git clone <your-repository-url>
cd PulseBoard
```

Or extract the ZIP and open the project folder.

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment

Create:

```text
server/.env
```

and add the required variables described above.

### 4. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

## Running Locally

### Start the backend

From:

```text
PulseBoard/server
```

run:

```bash
npm run dev
```

If the project does not define a development script, use its configured start command, for example:

```bash
npm start
```

The backend normally runs on:

```text
http://localhost:5000
```

### Start the frontend

From:

```text
PulseBoard/client
```

run:

```bash
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

Open the URL shown by Vite in the browser.

## Typical User Flow

1. Open the application.
2. Register a user.
3. Log in.
4. Open the Dashboard.
5. Click **New Project**.
6. Enter the project title, description, status, and due date.
7. Create the project.
8. Confirm the project appears in the Projects page.
9. Confirm the project is persisted in MongoDB.
10. Return to the Dashboard.
11. Confirm dashboard statistics and Recent Activity reflect the project.
12. Change the project status when work progresses.
13. Mark the project as completed.
14. Confirm the Completed statistic/chart/activity update.
15. Test search, edit, and delete.
16. Test light/dark mode.
17. Test the sidebar and responsive mobile layout.
18. Log out and confirm protected pages are no longer accessible.

## Data Flow

```text
User
  │
  ▼
React / Vite Frontend
  │
  │ HTTP API requests
  ▼
Express / Node Backend
  │
  │ Authentication + validation
  ▼
Mongoose
  │
  ▼
MongoDB
  │
  │ Aggregated/project records
  ▼
Express API Response
  │
  ▼
Dashboard / Projects UI
```

The important distinction is that dashboard metrics are derived from persisted project records rather than being static UI values.

## Project Data Model

### User

```text
{
  name: String,
  email: String,
  passwordHash: String,
  createdAt: Date
}
```

### Project

```text
{
  owner: ObjectId,
  title: String,
  description: String,
  status: "todo" | "in_progress" | "completed" | "overdue",
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

`completedAt` is used to associate completion activity with the time a project actually becomes completed when supported by the implementation.

## Dashboard Chart

The dashboard chart represents:

- **Created** — projects created over time, based on project creation records.
- **Completed** — projects completed over time, based on completion records.

The chart should be driven by backend data. Changing only a project's due date does not change the month in which the project was created or completed.

## API Surface

The primary API surface follows the supplied FRD:

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Authenticate user |
| POST | `/api/auth/logout` | Yes | End authenticated session |
| GET | `/api/dashboard/summary` | Yes | Dashboard aggregated data |
| GET | `/api/projects` | Yes | Paginated project list |
| POST | `/api/projects` | Yes | Create project |
| PATCH | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |

The exact route/controller implementation may be extended internally without changing the required behavior.

## Authentication and Security

- Passwords are never intended to be stored as plaintext.
- Passwords are hashed using bcrypt.
- JWT authentication protects private API resources.
- The JWT secret is supplied through an environment variable.
- Project queries are scoped to the authenticated owner.
- Authentication secrets are not part of the source-controlled application code.
- Client and server validation are both used.
- Delete operations require confirmation in the UI.

For production deployment, configure secure cross-origin authentication/cookies according to the deployment architecture.

## Responsive Design

The application targets the FRD's requested layout ranges:

### Desktop

```text
≥ 1280px
```

- Full sidebar
- Multi-column dashboard cards
- Full dashboard panels
- Desktop project layout

### Tablet

```text
~768px – 1024px
```

- Reduced multi-column layout
- Adapted panel widths
- Responsive navigation/layout

### Mobile

```text
≤ 480px
```

- Sidebar becomes a drawer/hamburger navigation
- Dashboard cards stack
- Project list adapts to a mobile-friendly presentation
- Controls wrap/reflow
- Charts and panels scale to the available width

## Loading, Empty, and Error States

Data-driven screens should distinguish between:

### Loading
Display a visible loading state while dashboard/project data is being requested.

### Empty
Display a useful empty state when the authenticated user has no projects or no recent activity.

### Error
Display a useful error message/action when an API/database request fails.

The UI should not leave a data panel blank without explaining whether it is loading, empty, or failed.

## Validation

### Client-side validation

The frontend validates required fields and provides immediate feedback before submission.

### Server-side validation

The backend validates incoming project/authentication data independently.

Server-side validation remains mandatory even when the frontend performs the same checks.

## Design Fidelity

PulseBoard follows the supplied Glass SaaS Dashboard reference for:

- Sidebar navigation
- Top navigation/top bar
- Glassmorphism/translucent panels
- Layered depth
- Dashboard stat-card structure
- Main chart area
- Insights area
- Recent Activity/project data presentation
- Light/dark themes
- Responsive collapse behavior

The existing Figma visual structure is intentionally retained while unrelated sample/business data is represented using the project's FRD-aligned project-management data.

## Architectural Decisions and Trade-offs

### MERN architecture

MongoDB, Express, React, and Node.js provide a straightforward full-stack JavaScript architecture suitable for this dashboard.

### MongoDB aggregation

Dashboard statistics are calculated in the database where practical instead of fetching every project and calculating all metrics in the browser. This keeps dashboard aggregation closer to the data source and aligns with the performance requirement.

### Pagination

The Projects page uses pagination rather than loading an unbounded list. This keeps the response size manageable as the project collection grows.

### Project ownership

Each project is associated with its authenticated owner. API queries use the authenticated user context so users only operate on their own project records.

### Theme persistence

The selected light/dark theme is persisted locally so the user's preference remains after refresh.

### Responsive navigation

Desktop uses the persistent sidebar layout while smaller screens use a drawer-style navigation pattern to preserve usable content width.

## Build Verification

Before submission, run a clean installation and production build.

### Frontend

```bash
cd client
npm install
npm run build
```

### Backend

```bash
cd server
npm install
```

Then run the configured backend start command and verify the API responds successfully.

Also test the application in a browser after the production build.

## Pre-Submission Checklist

### Authentication
- [ ] Register works
- [ ] Login works
- [ ] Password is hashed
- [ ] Protected API routes reject unauthenticated requests
- [ ] Protected frontend routes redirect unauthenticated users
- [ ] Logout works

### Dashboard
- [ ] Total Projects comes from MongoDB
- [ ] Active Projects comes from MongoDB
- [ ] Completed comes from MongoDB
- [ ] Overdue comes from MongoDB
- [ ] Created/Completed chart uses real records
- [ ] Recent Activity uses real records
- [ ] Data is scoped to the logged-in user

### Projects
- [ ] Create works
- [ ] Read/list works
- [ ] Pagination works
- [ ] Search works
- [ ] Update works
- [ ] Status update works
- [ ] Delete confirmation works
- [ ] Delete works
- [ ] Client validation works
- [ ] Server validation works

### UI
- [ ] Figma sidebar is preserved
- [ ] Figma top bar is preserved
- [ ] Glassmorphism treatment is preserved
- [ ] Light mode works
- [ ] Dark mode is readable
- [ ] Hover states work
- [ ] Focus states work
- [ ] Active states work
- [ ] Disabled states work
- [ ] Desktop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works
- [ ] Mobile sidebar works

### Resilience
- [ ] Dashboard loading state works
- [ ] Dashboard empty state works
- [ ] Dashboard error state works
- [ ] Chart loading/empty/error behavior works
- [ ] Projects loading state works
- [ ] Projects empty state works
- [ ] Projects error state works
- [ ] Forms show validation errors
- [ ] Submit buttons show pending state

### Security
- [ ] `.env` is not committed
- [ ] Real MongoDB credentials are not committed
- [ ] JWT secret is not committed
- [ ] Production secrets are configured in hosting environment variables

## Git and Repository Practices

Recommended repository structure:

```text
pulseboard/
├── client/
├── server/
├── .gitignore
└── README.md
```

Recommended root `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
```

Use meaningful commit messages, for example:

```text
feat: add JWT authentication
feat: add project CRUD
feat: add dashboard aggregation
fix: scope project queries to authenticated user
fix: improve mobile sidebar
style: align dashboard cards with Figma
docs: add setup instructions
```

## Deployment

The supplied hosting guidance recommends:

- MongoDB Atlas for the database
- Render or a comparable backend host
- Vercel or Netlify for the frontend
- GitHub for source control

For a deployed frontend, configure the API URL using an environment variable such as:

```env
VITE_API_URL=https://your-backend-url.example
```

Do not hardcode a localhost API URL in the production frontend.

For deployment:

1. Push the project to GitHub.
2. Deploy the `server` directory to the selected backend host.
3. Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and the platform's required `PORT`.
4. Deploy the `client` directory as the Vite frontend.
5. Configure `VITE_API_URL` to point to the deployed backend.
6. Configure CORS using the deployed frontend origin.
7. Test registration, login, dashboard loading, CRUD, and logout on the live deployment.

## Live Demo

Add the final deployed frontend URL here:

```text
Live Demo: <ADD-YOUR-DEPLOYED-FRONTEND-URL>
```

Backend URL, if you want to expose it:

```text
API: <ADD-YOUR-DEPLOYED-BACKEND-URL>
```

Repository:

```text
GitHub: <ADD-YOUR-GITHUB-REPOSITORY-URL>
```

## Known Limitations / Trade-offs

- This project is intentionally focused on the FRD's single-user project-management scope.
- Team/multi-tenant accounts are outside the supplied scope.
- Payment/billing functionality is outside the supplied scope.
- Real-time WebSocket updates are outside the supplied scope; refetching after actions is sufficient.
- Free hosting services may have cold-start delays or other free-tier limitations.
- Exact production security settings for cookies/CORS must be configured according to the deployed domain architecture.

## What Could Be Improved With More Time

- Add automated unit/integration tests for authentication, project CRUD, and dashboard aggregation.
- Add end-to-end browser tests for the main user journey.
- Add stronger observability/logging for production.
- Add richer project filtering and sorting.
- Add more granular accessibility testing with screen readers and automated accessibility tooling.
- Add CI checks for linting, tests, and production builds.
- Add a polished deployed demo and screenshots to the repository.

## Submission Notes

The project is intended to be evaluated as a **working full-stack application**, not as a static Figma reproduction.

The key submission flow is:

```text
Figma-inspired UI
       +
React frontend
       +
Express/Node API
       +
MongoDB persistence
       +
JWT authentication
       =
Data-driven PulseBoard dashboard
```

Before submitting, replace the placeholder repository/live-demo URLs above with the actual URLs and confirm that no secrets are present in the repository.
