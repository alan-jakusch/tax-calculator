# Tax Calculator Frontend

Frontend application for calculating Canadian federal marginal income tax based on tax brackets returned by the backend API.

## Project Description

This app allows users to:

- Enter annual income
- Select a tax year (2019 to 2022)
- Fetch tax brackets from the backend
- Calculate and display:
  - Total tax
  - Bracket-by-bracket breakdown
  - Effective tax rate

The UI also handles loading states, API errors, and common edge cases (such as zero income).

## Architecture (FSD Lite)

The project follows a lightweight Feature-Sliced Design structure:

- `src/app`: Application bootstrap and top-level composition
- `src/features/tax-calculator`: Tax calculator feature modules (API, model, hooks, and UI)
- `src/shared`: Reusable UI components and shared utilities

## Libraries and Tooling

Main technologies used in this frontend:

- React 19
- TypeScript
- Vite
- React Hook Form
- Zod
- TanStack Query
- Tailwind CSS
- Vitest
- Testing Library
- Playwright (end-to-end tests)

## How to Run

### Prerequisites

- Node.js `v24`
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root with:

```bash
VITE_API_BASE_URL=http://localhost:5001
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run tests

```bash
npm run test
npm run test:run
npm run test:coverage
```

### End-to-end tests (Playwright)

E2E tests live under `e2e/` and exercise the real UI against the **real** tax API (no mocks). Playwright starts the Vite dev server with `VITE_API_BASE_URL=http://localhost:5001` from [`playwright.config.ts`](playwright.config.ts), so you do not need a `.env` file for E2E.

**Prerequisites**

- The backend must be reachable at `http://localhost:5001` before you run E2E (for example the interview Docker image: `docker run --init -p 5001:5001 ptsdocker16/interview-test-server`).
- Node.js must meet Vite’s requirement (see [How to Run](#how-to-run)); the same version is used for the dev server Playwright launches.

**First-time browser install**

Chromium for Playwright is installed separately from npm packages:

```bash
npm run test:e2e:install
```

On macOS or Linux, the npm scripts set `PLAYWRIGHT_BROWSERS_PATH=0` so browser binaries are stored under the project. On Windows, run `npx playwright install chromium` if the script fails.

**Commands**

```bash
npm run test:e2e       # headless run
npm run test:e2e:ui    # interactive UI mode
```

[`e2e/global-setup.ts`](e2e/global-setup.ts) checks that the API responds before tests run. If it fails, start the backend on port 5001 and try again.

## Backend Requirement

This frontend expects the backend API base URL to be set in `.env` using:

`VITE_API_BASE_URL`

For local development, use:

`http://localhost:5001`

Used endpoint pattern:

`GET /tax-calculator/tax-year/{year}`
