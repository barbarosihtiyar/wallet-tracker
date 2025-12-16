## Overview
- React + TypeScript + Vite dashboard for managing customer wallets, limits, and transactions.
- Uses Ant Design UI, React Query for server state (with retries and abort support), and Redux Toolkit for view state (filters, selections).
- i18n with Turkish/English locales and CSP-friendly Ant Design setup.
- When the API is unreachable, the app falls back to curated mock data so core flows keep working.

## Features
- Customer list with search and filters (wallet status, KYC, active flag) and pagination.
- Create, edit, and delete customers with validated forms and toast feedback.
- Customer detail view with wallet summary, transaction feed + filters, and limit update form.
- Global error boundary, notification/toast utilities, and language selector.
- API client with configurable base URL, timeout, and offline/mock fallback.

## Tech Stack
- React 19, TypeScript, Vite 7
- Ant Design 6, classnames, react-i18next
- React Query 5, Redux Toolkit 2
- Sass for styling, Vite SVGR for icons

## Getting Started
1) Install dependencies  
`npm install`

2) Run the dev server (opens on port 3001)  
`npm run dev`

3) Build for production  
`npm run build`

4) Preview the production build  
`npm run preview`

5) Lint  
`npm run lint`

## Environment
Create a `.env` (or `.env.local`) at the project root if you need to override defaults:
```env
VITE_API_BASE_URL=https://frontend-case-study.onrender.com/api
VITE_API_TIMEOUT=12000
VITE_APP_ENV=development
VITE_APP_VERSION=0.0.0
```
- Defaults live in `src/shared/config/env.ts` and normalize trailing slashes.
- Dev server runs at `http://localhost:3001` (see `vite.config.dev.js`).

## Data Flow
- Server data: React Query hooks under `src/features/Dashboard/api` hit the API and normalize pagination. On network/API failure, services fall back to mock data in `src/shared/dummy/dashboard.ts` and surface a warning toast.
- View/UI state: Redux slices in `src/redux/slices` store filters, selections, and notifications; wired via `src/redux/store/index.ts`.
- Routing: See `src/app/router` and the `Router` component at `src/components/Layouts/Router/index.tsx` (AppShell + ErrorBoundary per route).
- i18n: Initialized in `src/shared/i18n` with locale files under `public/locales/{tr,en}/translation.json`.

## Project Structure (high level)
- `src/features/Dashboard`: Dashboard pages, tables, forms, and hooks.
- `src/components`: Shared UI (buttons, layouts, modals, sidebar, etc.).
- `src/shared`: Config, lib utilities, i18n, dummy data, types, and services.
- `src/app/router`: Route config and paths.
- `public`: Static assets and locale files.

## Notes
- API client (`src/shared/services/apiClient.ts`) supports aborting requests, custom headers, and optional mock fallbacks to keep the UI usable offline.
- Toasts/notifications and CSP nonce support are wired in `src/main.tsx` via `AntNotificationLayout` and `ConfigProvider`.
