# Insighta Web

Frontend for the Insighta platform — a professional profiles directory with natural language search, built with React 19, TypeScript, and Vite.

## Features

- **Authentication** — cookie-based session with automatic JWT refresh on 401
- **Dashboard** — quick stats and role-aware navigation
- **Profiles** — paginated table of professional profiles with CSV export
- **Profile detail** — full view of an individual profile
- **Natural language search** — query profiles in plain English (e.g. *"engineers in Nigeria with 5+ years"*)
- **Create profile** — admin-only form for adding new profiles
- **Account** — user account management

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router 7 |
| HTTP | Axios |

## Getting started

### Prerequisites

- Node.js 20+
- A running instance of the Insighta API

### Install

```bash
npm install
```

### Configure

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

Output goes to `dist/`.

## Routes

| Path | Page | Auth required |
|---|---|---|
| `/login` | Login | No |
| `/` | Dashboard | Yes |
| `/profiles` | Profiles list | Yes |
| `/profiles/new` | Create profile | Yes (admin) |
| `/profiles/:id` | Profile detail | Yes |
| `/search` | Natural language search | Yes |
| `/account` | Account settings | Yes |

## Project structure

```
src/
  api.ts              # Axios instance with auth interceptor
  App.tsx             # Route definitions
  context/
    AuthContext.tsx   # Auth state and logout
  components/
    NavBar.tsx
    ProtectedRoute.tsx
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    ProfilesPage.tsx
    ProfileDetailPage.tsx
    CreateProfilePage.tsx
    SearchPage.tsx
    AccountPage.tsx
```
